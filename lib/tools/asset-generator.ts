/**
 * 素材生成工具 — 角色使用预置素材 + 场景 AI 生成。
 *
 * - 角色：从 storage/assets/char_userd_1/{male,female}/ 复制预设四视图
 * - 场景：调用 DashScope qwen-image-2.0 生成背景图，按 sceneImageRef 去重
 *
 * 零容错：任何异常直接抛出。
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import type { Proposal, VideoScript, CharacterAsset, SceneAsset, AssetManifest } from '@/lib/types';
import { buildSceneBackgroundPrompt } from '@/lib/prompts/asset-generation';
import { uploadCharacterViews, isOssConfigured } from '@/lib/tools/oss-uploader';

// ── 配置 ────────────────────────────────────────────

const AI_ASSET_API_KEY = process.env.AI_ASSET_API_KEY!;
const AI_ASSET_BASE_URL = process.env.AI_ASSET_BASE_URL!;
const AI_ASSET_MODEL = process.env.AI_ASSET_MODEL!;

export const ASSET_STORE_DIR = path.resolve('./storage/assets');

// ── API 调用 ─────────────────────────────────────────

interface ImageGenResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{ image?: string }>;
      };
    }>;
  };
}

async function callImageAPI(prompt: string): Promise<string> {
  if (!AI_ASSET_API_KEY || !AI_ASSET_BASE_URL || !AI_ASSET_MODEL) {
    throw new Error('AI 图片生成环境变量未配置（AI_ASSET_API_KEY / AI_ASSET_BASE_URL / AI_ASSET_MODEL）');
  }

  console.log(`[asset-gen] 生成中: "${prompt.slice(0, 60)}..."`);

  const resp = await fetch(AI_ASSET_BASE_URL, {
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

// ── 本地存储 ─────────────────────────────────────────

async function downloadToLocal(url: string, localPath: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`下载图片失败: HTTP ${resp.status}`);

  const buffer = Buffer.from(await resp.arrayBuffer());
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, buffer);
  return localPath;
}

// ── 预置角色素材 ────────────────────────────────────

const CHAR_PRESET_DIR = path.resolve('./storage/assets/char_userd_1');
const VIEW_ORDER: Array<keyof CharacterAsset['views']> = ['front', 'back', 'left', 'right'];

/** 从 appearance 文本中检测性别（英文描述） */
function detectGender(appearance: string): 'male' | 'female' {
  const lower = appearance.toLowerCase();
  if (/\b(female|woman|girl|lady|her|she)\b/.test(lower)) return 'female';
  return 'male'; // 默认男性
}

/**
 * 使用预置角色素材，不再调用 AI 生成。
 * 1. 从 storage/assets/char_userd_1/{male|female}/ 复制四视图到任务目录
 * 2. 上传到 OSS 获取公网 URL（供视频生成 API 引用）
 */
async function usePresetCharacter(
  character: { characterId: string; name: string; appearance: string },
  jobId: string
): Promise<CharacterAsset> {
  const gender = detectGender(character.appearance);
  const presetDir = path.join(CHAR_PRESET_DIR, gender);

  const charDir = path.join(ASSET_STORE_DIR, jobId, 'characters', character.characterId);
  await fs.mkdir(charDir, { recursive: true });

  const views: CharacterAsset['views'] = { front: '', back: '', left: '', right: '' };

  for (const view of VIEW_ORDER) {
    const srcPath = path.join(presetDir, `${view}.jpeg`);
    const destPath = path.join(charDir, `${view}.jpeg`);
    try {
      await fs.copyFile(srcPath, destPath);
      views[view] = destPath;
    } catch {
      throw new Error(`预置角色素材缺失: ${srcPath}`);
    }
  }

  // 上传到 OSS（供视频 API 作为 character_image 引用）
  let remoteViews: CharacterAsset['remoteViews'] = null;
  if (isOssConfigured()) {
    try {
      const urls = await uploadCharacterViews(views, jobId, character.characterId);
      remoteViews = urls;
    } catch (err) {
      console.warn(`[asset-gen] OSS 上传失败（视频中将无角色参考图）: ${(err as Error).message}`);
    }
  } else {
    console.warn('[asset-gen] OSS 未配置，角色图无公网 URL（视频中将无角色参考图）');
  }

  console.log(`[asset-gen] 角色 ${character.name} → ${gender} 预设素材` +
    (remoteViews ? ' + OSS' : ''));
  return { characterId: character.characterId, views, remoteViews, prompt: `preset:${gender}` };
}

// ── 场景背景生成（去重）───────────────────────────────

async function generateSceneBackground(
  sceneImageRef: string,
  summary: string,
  jobId: string
): Promise<{ imageUrl: string; remoteUrl: string; prompt: string }> {
  const prompt = buildSceneBackgroundPrompt(summary);
  const imageUrl = await callImageAPI(prompt);
  const localPath = path.join(
    ASSET_STORE_DIR, jobId, 'scenes',
    `${sceneImageRef.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`
  );
  const saved = await downloadToLocal(imageUrl, localPath);

  return { imageUrl: saved, remoteUrl: imageUrl, prompt };
}

// ── 公开 API ────────────────────────────────────────

export interface AssetGenResult {
  manifest: AssetManifest;
  characterCount: number;
  sceneCount: number;
}

/**
 * 生成角色素材 + 场景背景图。
 * 场景图按 videoScript.sceneScripts[].resourceRefs.sceneImageRef 去重：
 * 相同 sceneImageRef 只生成一次，所有引用该 ref 的 shot 共用同一张图。
 */
export async function generateAssets(
  proposal: Proposal,
  videoScript: VideoScript,
  jobId: string
): Promise<AssetGenResult> {
  const characters = proposal.characters ?? [];
  const shots = proposal.shotScript;

  // ── 构建 sceneImageRef → 唯一场景 的映射 ──
  const sceneRefMap = new Map<string, { summary: string; sceneIds: string[] }>();

  for (const shot of shots) {
    const sceneScript = videoScript.sceneScripts.find((s) => s.sceneId === shot.sceneId);
    const ref = sceneScript?.resourceRefs.sceneImageRef ?? shot.sceneId;

    const entry = sceneRefMap.get(ref);
    if (entry) {
      entry.sceneIds.push(shot.sceneId);
    } else {
      sceneRefMap.set(ref, { summary: shot.summary, sceneIds: [shot.sceneId] });
    }
  }

  const uniqueSceneCount = sceneRefMap.size;
  console.log(
    `[asset-gen] 开始生成素材: ${characters.length} 个角色, ` +
    `${shots.length} 个镜头 → ${uniqueSceneCount} 个唯一场景（去重后）`
  );

  // ── 角色素材（预置，不调 AI）──
  const characterAssets: CharacterAsset[] = [];
  for (const char of characters) {
    const asset = await usePresetCharacter(
      { characterId: char.characterId, name: char.name, appearance: char.appearance },
      jobId
    );
    characterAssets.push(asset);
  }

  // ── 场景素材（每个唯一 sceneImageRef 只生成一次，间隔 2s 避免限流）──
  const refToAsset = new Map<string, { imageUrl: string; remoteUrl: string; prompt: string }>();

  let first = true;
  for (const [ref, info] of sceneRefMap) {
    if (!first) {
      await new Promise((r) => setTimeout(r, 2000)); // 请求间隔 2s
    }
    first = false;
    console.log(`[asset-gen] 场景 "${ref}": 覆盖 ${info.sceneIds.length} 个镜头`);
    const asset = await generateSceneBackground(ref, info.summary, jobId);
    refToAsset.set(ref, asset);
  }

  // ── 展开为 SceneAsset[]（每个 shot 一条记录，共用同一张图的 shot 共享 URL）──
  const sceneAssets: SceneAsset[] = [];
  for (const shot of shots) {
    const sceneScript = videoScript.sceneScripts.find((s) => s.sceneId === shot.sceneId);
    const ref = sceneScript?.resourceRefs.sceneImageRef ?? shot.sceneId;
    const asset = refToAsset.get(ref);
    if (!asset) throw new Error(`场景 "${ref}" 未能生成`);

    sceneAssets.push({
      sceneId: shot.sceneId,
      imageUrl: asset.imageUrl,
      remoteUrl: asset.remoteUrl,
      prompt: asset.prompt,
    });
  }

  const manifest: AssetManifest = { characters: characterAssets, scenes: sceneAssets };

  console.log(
    `[asset-gen] 完成: ${characterAssets.length} 角色, ` +
    `${uniqueSceneCount} 个唯一场景（${sceneAssets.length} 条引用）`
  );
  return { manifest, characterCount: characterAssets.length, sceneCount: uniqueSceneCount };
}
