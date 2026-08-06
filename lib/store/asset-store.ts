/**
 * AssetStore — 素材存储 / 库访问 / OSS 发布统一入口。
 *
 * 职责：
 * - 相对路径 → 本地绝对路径（resolve / store）
 * - 本地库角色组「一组拿」（meta + 四视图）
 * - 本地路径 → OSS 公网 URL（publish），库素材公网 URL 回填到组 meta.json 实现跨任务缓存
 *
 * 约定：manifest 只存相对路径；公网 URL 是派生物，下游要公网就调 publish()。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadFile, isOssConfigured, relToOssKey } from '@/lib/tools/oss-uploader';
import type { AssetManifest, CharacterAsset } from '@/lib/types';
import { fetchWithTimeout } from '@/lib/tools/http';

const STORAGE_ROOT = path.resolve(process.cwd(), 'storage');

export const VIEW_ORDER = ['front', 'back', 'left', 'right'] as const;
export type ViewName = (typeof VIEW_ORDER)[number];
export type CharacterViews = Record<ViewName, string>;

/** 库角色组 meta.json 结构 */
export interface CharacterGroupMeta {
  groupId: string;
  name: string;
  type: 'protagonist' | 'supporting';
  views: ViewName[];
  description: string;
  tags: string[];
  applicable: string;
  /** OSS 公网四视图（publish 后回填，未上传无此字段） */
  remoteViews?: Record<ViewName, string>;
}

/** 库角色组「一组拿」的完整内容 */
export interface CharacterGroup {
  meta: CharacterGroupMeta;
  views: CharacterViews;
}

export class AssetStore {
  private readonly root: string;
  private readonly urlCache = new Map<string, string>();

  constructor(root: string = STORAGE_ROOT) {
    this.root = root;
  }

  // ── 本地读写 ────────────────────────────────────────

  /** 相对路径 → 本地绝对路径 */
  resolve(relPath: string): string {
    return path.join(this.root, ...relPath.replace(/\\/g, '/').split('/'));
  }

  /** 写本地文件，返回相对路径 */
  async store(relPath: string, buffer: Buffer): Promise<string> {
    const abs = this.resolve(relPath);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, buffer);
    return relPath;
  }

  /** 下载 URL 到本地，返回相对路径 */
  async storeFromUrl(url: string, relPath: string): Promise<string> {
    const resp = await fetchWithTimeout(url);
    if (!resp.ok) throw new Error(`下载素材失败: HTTP ${resp.status} ${url}`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    return this.store(relPath, buffer);
  }

  // ── 库访问（一组拿）─────────────────────────────────

  private charDir(groupId: string): string {
    return `library/characters/${groupId}`;
  }

  private charMetaPath(groupId: string): string {
    return this.resolve(`${this.charDir(groupId)}/meta.json`);
  }

  /** 读库角色组 meta */
  async getCharacterGroupMeta(groupId: string): Promise<CharacterGroupMeta> {
    const raw = await fs.readFile(this.charMetaPath(groupId), 'utf-8');
    return JSON.parse(raw) as CharacterGroupMeta;
  }

  /** 读库角色组「一组」：meta + 四视图相对路径 */
  async getCharacterGroup(groupId: string): Promise<CharacterGroup> {
    const meta = await this.getCharacterGroupMeta(groupId);
    const base = this.charDir(groupId);
    const views: CharacterViews = {
      front: `${base}/front.jpeg`,
      back: `${base}/back.jpeg`,
      left: `${base}/left.jpeg`,
      right: `${base}/right.jpeg`,
    };
    return { meta, views };
  }

  /** 列出所有库角色组，按目录 mtime 降序（最新在前） */
  async listCharacterGroups(): Promise<CharacterGroupMeta[]> {
    const dir = this.resolve('library/characters');
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const groups: Array<{ meta: CharacterGroupMeta; mtime: number }> = [];
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const meta = await this.getCharacterGroupMeta(e.name).catch(() => null);
      if (!meta) continue;
      const st = await fs.stat(this.charMetaPath(e.name));
      groups.push({ meta: { ...meta, groupId: e.name }, mtime: st.mtimeMs });
    }
    groups.sort((a, b) => b.mtime - a.mtime);
    return groups.map((g) => g.meta);
  }

  /** 选角占位：取最新一组（后续专门设计匹配逻辑） */
  async getLatestCharacterGroup(): Promise<CharacterGroupMeta | null> {
    const groups = await this.listCharacterGroups();
    return groups[0] ?? null;
  }

  // ── manifest 读写 ──────────────────────────────────

  async writeManifest(manifest: AssetManifest): Promise<string> {
    const relPath = `assets/${manifest.jobId}/manifest.json`;
    await this.store(relPath, Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8'));
    return relPath;
  }

  async readManifest(jobId: string): Promise<AssetManifest> {
    const abs = this.resolve(`assets/${jobId}/manifest.json`);
    return JSON.parse(await fs.readFile(abs, 'utf-8')) as AssetManifest;
  }

  // ── OSS 发布 ───────────────────────────────────────

  /**
   * 本地相对路径 → OSS 公网 URL。
   * - 库角色视图（library/characters/...）：查组 meta.json 的 remoteViews，有则复用；否则上传并回填
   * - 任务产物（assets/{jobId}/...）：上传（内存缓存）
   */
  async publish(relPath: string): Promise<string> {
    const cached = this.urlCache.get(relPath);
    if (cached) return cached;
    if (!isOssConfigured()) {
      throw new Error(`OSS 未配置，无法为 ${relPath} 生成公网 URL（视频生成硬依赖）`);
    }

    // 库素材：命中组 meta 缓存则直接复用
    const libUrl = await this.lookupLibraryUrl(relPath);
    if (libUrl) {
      this.urlCache.set(relPath, libUrl);
      return libUrl;
    }

    const remoteKey = relToOssKey(relPath);
    const { publicUrl } = await uploadFile(this.resolve(relPath), remoteKey);
    this.urlCache.set(relPath, publicUrl);

    // 库素材：回填组 meta，供后续任务复用
    await this.backfillLibraryUrl(relPath, publicUrl);

    return publicUrl;
  }

  /**
   * 把整个 manifest 解析成公网 URL（供 scene_json_assembler 填 SceneVideoSpec.assets）。
   * @returns 每个 sceneId 的场景公网 URL + 每个 characterId 的四视图公网 URL
   */
  async publishManifest(manifest: AssetManifest): Promise<{
    scenes: Record<string, string>;
    characters: Record<string, CharacterAsset['remoteViews']>;
  }> {
    const scenes: Record<string, string> = {};
    for (const sceneId of Object.keys(manifest.sceneRefs)) {
      const ref = manifest.sceneRefs[sceneId];
      const scene = manifest.scenes[ref];
      if (!scene) throw new Error(`publishManifest: sceneRefs[${sceneId}] 指向不存在的 ref ${ref}`);
      scenes[sceneId] = await this.publish(scene.image);
    }

    const characters: Record<string, CharacterAsset['remoteViews']> = {};
    for (const [charId, char] of Object.entries(manifest.characters)) {
      characters[charId] = {
        front: await this.publish(char.views.front),
        back: await this.publish(char.views.back),
        left: await this.publish(char.views.left),
        right: await this.publish(char.views.right),
      };
    }
    return { scenes, characters };
  }

  // ── 内部：库 meta 缓存 ──────────────────────────────

  /** 若 relPath 是库角色视图且组 meta 已有公网 URL，返回之 */
  private async lookupLibraryUrl(relPath: string): Promise<string | null> {
    const view = this.parseLibraryView(relPath);
    if (!view) return null;
    const meta = await this.getCharacterGroupMeta(view.groupId).catch(() => null);
    return meta?.remoteViews?.[view.view] ?? null;
  }

  /** 上传库角色视图后回填组 meta.json */
  private async backfillLibraryUrl(relPath: string, url: string): Promise<void> {
    const view = this.parseLibraryView(relPath);
    if (!view) return;
    const meta = await this.getCharacterGroupMeta(view.groupId).catch(() => null);
    if (!meta) return;
    meta.remoteViews = meta.remoteViews ?? { front: '', back: '', left: '', right: '' };
    meta.remoteViews[view.view] = url;
    await fs.writeFile(this.charMetaPath(view.groupId), JSON.stringify(meta, null, 2), 'utf-8');
  }

  /** 解析 "library/characters/{groupId}/{view}.jpeg" → { groupId, view } */
  private parseLibraryView(relPath: string): { groupId: string; view: ViewName } | null {
    const parts = relPath.replace(/\\/g, '/').split('/');
    if (parts.length !== 4 || parts[0] !== 'library' || parts[1] !== 'characters') return null;
    const view = parts[3].split('.')[0] as ViewName;
    if (!(VIEW_ORDER as readonly string[]).includes(view)) return null;
    return { groupId: parts[2], view };
  }
}
