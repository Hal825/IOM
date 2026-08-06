/**
 * 素材生成工具 — 两个来源接口，向下交付统一 AssetManifest。
 *
 * 来源接口：
 * 1. 本地库（library）：选角占位取「最新库组」，四视图一组拿（后续专门设计匹配逻辑）
 * 2. AI 生成（ai）：角色四视图 + 场景背景图（按 sceneImageRef 去重，共享一张）
 *
 * 产物：
 * - AI 生成文件 → storage/assets/{jobId}/…
 * - 库素材      → 引用 storage/library/…（不复制）
 * - 交付物      → storage/assets/{jobId}/manifest.json（AssetManifest，全部相对路径）
 *
 * 失败策略：单个角色/场景图生成失败 → 跳过该项（对应 sceneImageUrl 落 null），任务继续；
 * 正式的中性兜底重试机制后续完善。
 */

import { AssetStore, VIEW_ORDER, type CharacterViews } from '@/lib/store/asset-store';
import type { Proposal, VideoScript, AssetManifest } from '@/lib/types';
import { fetchWithTimeout } from './http';

// ── 配置（全部来自环境变量）─────────────────────────

const AI_ASSET_API_KEY = process.env.AI_ASSET_API_KEY;
const AI_ASSET_BASE_URL = process.env.AI_ASSET_BASE_URL;
const AI_ASSET_MODEL = process.env.AI_ASSET_MODEL;

interface ImageGenResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{ image?: string }>;
      };
    }>;
  };
}

/** 调用 DashScope 图片生成 API，返回图片 URL */
async function callImageAPI(prompt: string): Promise<string> {
  if (!AI_ASSET_API_KEY || !AI_ASSET_BASE_URL || !AI_ASSET_MODEL) {
    throw new Error('AI 图片生成环境变量未配置（AI_ASSET_API_KEY / AI_ASSET_BASE_URL / AI_ASSET_MODEL）');
  }

  console.log(`[asset-gen] 生成中: "${prompt.slice(0, 60)}..."`);

  const resp = await fetchWithTimeout(AI_ASSET_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_ASSET_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_ASSET_MODEL,
      input: {
        messages: [{ role: 'user', content: [{ text: prompt }] }],
      },
      parameters: { size: '1280*720', n: 1 },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`图片生成 API 返回 ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await resp.json()) as ImageGenResponse;
  const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;
  if (!imageUrl) throw new Error('图片生成响应中未找到图片 URL');
  return imageUrl;
}

// ── Prompt 构建 ─────────────────────────────────────

function buildSceneBackgroundPrompt(visualHints: string): string {
  return `cinematic landscape, 16:9 wide angle, high quality, photorealistic, no characters, no people, empty scene — ${visualHints}`;
}

function buildCharacterViewPrompt(appearance: string, view: string): string {
  return `character concept art, full body ${view} view, consistent character design, high quality, photorealistic — ${appearance}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── 公开 API ────────────────────────────────────────

export interface AssetGenResult {
  manifest: AssetManifest;
  manifestPath: string;
  characterCount: number;
  /** 唯一场景数（去重后） */
  sceneCount: number;
}

/**
 * 生成角色素材 + 场景背景图，产出 AssetManifest。
 * - 角色：优先本地库（选角占位取最新组），库为空则 AI 生成四视图
 * - 场景：按 storyboard.resourceRefs.sceneImageRef 去重，同一 ref 只生成一次
 */
export async function generateAssets(
  proposal: Proposal,
  videoScript: VideoScript,
  jobId: string,
): Promise<AssetGenResult> {
  const store = new AssetStore();

  const storyboardScenes = videoScript.storyboardScript.scenes;
  const storyScenes = videoScript.storyScript.scenes;

  // ── 角色素材：选角占位（最新库组 / AI 生成）──
  const characters: AssetManifest['characters'] = {};
  const latestGroup = await store.getLatestCharacterGroup();

  for (const char of proposal.characters) {
    if (latestGroup) {
      const group = await store.getCharacterGroup(latestGroup.groupId);
      characters[char.characterId] = {
        source: 'library',
        sourceRef: `library/characters/${latestGroup.groupId}`,
        views: group.views,
      };
      console.log(`[asset-gen] 角色 ${char.name} → 库组 ${latestGroup.groupId}`);
    } else {
      // AI 生成四视图（占位实现，4 次独立调用；角色一致性后续专门设计）
      try {
        const dir = `assets/${jobId}/characters/${char.characterId}`;
        const views = {} as CharacterViews;
        for (let i = 0; i < VIEW_ORDER.length; i++) {
          const view = VIEW_ORDER[i];
          if (i > 0) await sleep(1000);
          const url = await callImageAPI(buildCharacterViewPrompt(char.appearance, view));
          views[view] = await store.storeFromUrl(url, `${dir}/${view}.png`);
        }
        characters[char.characterId] = { source: 'ai', views };
        console.log(`[asset-gen] 角色 ${char.name} → AI 生成四视图`);
      } catch (err) {
        // 单角色生成失败：跳过该角色（下游 characterImageUrls 为空），任务继续（兜底机制后续完善）
        console.warn(`[asset-gen] 角色 ${char.name} AI 生成失败，跳过（${(err as Error).message}）`);
      }
    }
  }

  // ── 场景素材：按 sceneImageRef 去重，AI 生成共享背景 ──
  const refMap = new Map<string, { hints: string; sceneIds: string[] }>();
  const sceneRefs: Record<string, string> = {};

  for (const sb of storyboardScenes) {
    const ref = sb.resourceRefs.sceneImageRef || sb.sceneId;
    sceneRefs[sb.sceneId] = ref;

    const visual = proposal.sceneVisuals.find((sv) => sv.visualId === sb.visualSource);
    const hints =
      visual?.visualHints ||
      storyScenes.find((s) => s.sceneId === sb.sceneId)?.sceneDescription ||
      ref;

    const entry = refMap.get(ref);
    if (entry) {
      entry.sceneIds.push(sb.sceneId);
    } else {
      refMap.set(ref, { hints, sceneIds: [sb.sceneId] });
    }
  }

  const scenes: AssetManifest['scenes'] = {};
  let first = true;
  for (const [ref, info] of refMap) {
    if (!first) await sleep(2000); // 请求间隔 2s 避免限流
    first = false;
    try {
      const url = await callImageAPI(buildSceneBackgroundPrompt(info.hints));
      const relPath = `assets/${jobId}/scenes/${ref.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
      await store.storeFromUrl(url, relPath);
      scenes[ref] = { source: 'ai', image: relPath };
      console.log(`[asset-gen] 场景 "${ref}": 覆盖 ${info.sceneIds.length} 个镜头`);
    } catch (err) {
      // 单张场景图失败：跳过该 ref，对应镜头 sceneImageUrl 落 null，任务继续（兜底机制后续完善）
      console.warn(`[asset-gen] 场景 "${ref}" 生成失败，跳过（${(err as Error).message}）`);
      for (const sceneId of info.sceneIds) {
        delete sceneRefs[sceneId];
      }
    }
  }

  const manifest: AssetManifest = { jobId, characters, scenes, sceneRefs };
  const manifestPath = await store.writeManifest(manifest);

  console.log(
    `[asset-gen] 完成: ${Object.keys(characters).length} 角色, ` +
    `${Object.keys(scenes).length} 个唯一场景 → ${manifestPath}`
  );

  return {
    manifest,
    manifestPath,
    characterCount: Object.keys(characters).length,
    sceneCount: Object.keys(scenes).length,
  };
}
