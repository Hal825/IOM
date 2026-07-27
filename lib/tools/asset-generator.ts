/**
 * 素材生成工具 — AI 图片生成节点。
 *
 * 读取 Proposal 中的 characters 和 shotScript，调用 AI 图片 API：
 * - 每个角色 → 1 次 API 调用生成 4 视图（front / back / left / right）
 * - 每个镜头 → 1 次 API 调用生成场景背景图
 *
 * 输出 AssetManifest，供下游 video_generation 节点消费。
 *
 * 支持任意兼容 OpenAI 图片接口的服务（DashScope / 火山引擎 Ark / DALL-E 等）。
 * 通过 AI_ASSET_MODEL / AI_ASSET_API_KEY / AI_ASSET_BASE_URL 配置。
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import type { Proposal, CharacterAsset, SceneAsset, AssetManifest } from '@/lib/types';
import {
  buildCharacterViewPrompt,
  buildSceneBackgroundPrompt,
} from '@/lib/prompts/asset-generation';

// ── 配置（全部来自环境变量）─────────────────────────

const AI_ASSET_API_KEY = process.env.AI_ASSET_API_KEY;
const AI_ASSET_BASE_URL = process.env.AI_ASSET_BASE_URL;
const AI_ASSET_MODEL = process.env.AI_ASSET_MODEL;

/** 素材本地存储根目录 */
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

/**
 * 调用 AI 图片 API 生成单张图片。
 */
async function callImageAPI(prompt: string): Promise<string | null> {
  if (!AI_ASSET_API_KEY || !AI_ASSET_BASE_URL || !AI_ASSET_MODEL) {
    console.log('[asset-gen] AI 图片生成未配置，跳过');
    return null;
  }

  try {
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
          messages: [
            {
              role: 'user',
              content: [{ text: prompt }],
            },
          ],
        },
        parameters: {
          size: '1280*720',
          n: 1,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(
        `[asset-gen] API 返回 ${resp.status}: ${errText.slice(0, 200)}`
      );
      return null;
    }

    const data = (await resp.json()) as ImageGenResponse;
    const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;

    if (!imageUrl) {
      console.warn('[asset-gen] 响应中未找到图片 URL');
      return null;
    }

    return imageUrl;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[asset-gen] API 异常: ${message}`);
    return null;
  }
}

/**
 * 调用 AI 图片 API 批量生成多张图片。
 * 一次 API 调用，返回 n 张独立图片 URL。
 */
async function callImageAPIBatch(
  prompt: string,
  n: number
): Promise<string[]> {
  if (!AI_ASSET_API_KEY || !AI_ASSET_BASE_URL || !AI_ASSET_MODEL) {
    console.log('[asset-gen] AI 图片生成未配置，跳过');
    return [];
  }

  try {
    console.log(`[asset-gen] 批量生成 ${n} 张: "${prompt.slice(0, 60)}..."`);

    const resp = await fetch(AI_ASSET_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_ASSET_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_ASSET_MODEL,
        input: {
          messages: [
            {
              role: 'user',
              content: [{ text: prompt }],
            },
          ],
        },
        parameters: {
          size: '1280*720',
          n,
        },
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(
        `[asset-gen] 批量 API 返回 ${resp.status}: ${errText.slice(0, 200)}`
      );
      return [];
    }

    const data = (await resp.json()) as ImageGenResponse;
    const choices = data.output?.choices ?? [];

    const urls = choices
      .map((choice) => choice.message?.content?.[0]?.image)
      .filter((url): url is string => !!url);

    if (urls.length === 0) {
      console.warn('[asset-gen] 批量响应中未找到任何图片 URL');
      return [];
    }

    console.log(`[asset-gen] 批量返回 ${urls.length}/${n} 张图片`);
    return urls;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[asset-gen] 批量 API 异常: ${message}`);
    return [];
  }
}

// ── 本地存储 ─────────────────────────────────────────

async function downloadToLocal(url: string, localPath: string): Promise<string | null> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!resp.ok) return null;

    const buffer = Buffer.from(await resp.arrayBuffer());
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, buffer);
    return localPath;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[asset-gen] 下载失败: ${message}`);
    return null;
  }
}

// ── 纯色兜底 ─────────────────────────────────────────

function generateSolidColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 30%)`;
}

// ── 角色视图生成（单次 API 调用，4 张独立图片）───────

/** 4 视角顺序（与 API 返回的 4 张图片一一对应） */
const VIEW_ORDER: Array<keyof CharacterAsset['views']> = [
  'front', 'back', 'left', 'right',
];

/**
 * 为单个角色生成 4 视图素材。
 * 一次 API 调用生成 4 张独立图片，按顺序对应 front / back / left / right。
 */
async function generateCharacterViews(
  character: { characterId: string; name: string; appearance: string },
  jobId: string
): Promise<CharacterAsset> {
  const views: CharacterAsset['views'] = {
    front: '',
    back: '',
    left: '',
    right: '',
  };

  const prompt = buildCharacterViewPrompt(character.name, character.appearance);
  const charDir = path.join(ASSET_STORE_DIR, jobId, 'characters', character.characterId);

  // 一次 API 调用，生成 4 张独立图片
  const imageUrls = await callImageAPIBatch(prompt, 4);

  // 按顺序映射到视图
  for (let i = 0; i < VIEW_ORDER.length; i++) {
    const view = VIEW_ORDER[i];
    const imageUrl = imageUrls[i] ?? null;

    if (imageUrl) {
      const localPath = path.join(charDir, `${view}.png`);
      const saved = await downloadToLocal(imageUrl, localPath);
      views[view] = saved ?? imageUrl;
    } else {
      views[view] = generateSolidColor(`${character.name}-${view}`);
      console.log(`[asset-gen] 角色 ${character.name} ${view} 视角 → 纯色兜底`);
    }
  }

  const ok = VIEW_ORDER.filter((v) => views[v]).length;
  console.log(
    `[asset-gen] 角色 ${character.name}: ${ok}/4 视图生成成功`
  );

  return {
    characterId: character.characterId,
    views,
    prompt,
  };
}

// ── 场景背景生成 ────────────────────────────────────

async function generateSceneBackground(
  scene: { sceneId: string; visualDescription: string },
  sceneIndex: number,
  jobId: string
): Promise<SceneAsset> {
  const prompt = buildSceneBackgroundPrompt(scene.visualDescription);
  const imageUrl = await callImageAPI(prompt);

  let finalUrl: string;
  let remoteUrl: string | undefined;
  if (imageUrl) {
    // 保留远程 URL（供 video-gen 等外部 API 引用首帧）
    remoteUrl = imageUrl;
    const localPath = path.join(
      ASSET_STORE_DIR,
      jobId,
      'scenes',
      `scene_${String(sceneIndex).padStart(3, '0')}.png`
    );
    const saved = await downloadToLocal(imageUrl, localPath);
    finalUrl = saved ?? imageUrl;
  } else {
    finalUrl = generateSolidColor(scene.visualDescription);
    console.log(`[asset-gen] 场景 ${scene.sceneId} → 纯色兜底`);
  }

  return {
    sceneId: scene.sceneId,
    imageUrl: finalUrl,
    remoteUrl,
    prompt,
  };
}

// ── 公开 API ────────────────────────────────────────

export interface AssetGenResult {
  manifest: AssetManifest;
  characterCount: number;
  sceneCount: number;
}

export async function generateAssets(
  proposal: Proposal,
  jobId: string
): Promise<AssetGenResult> {
  const characters = proposal.characters ?? [];
  const shots = proposal.shotScript;

  console.log(
    `[asset-gen] 开始生成素材: ${characters.length} 个角色, ${shots.length} 个场景`
  );

  // ── 每个角色一次 API 调用生成 4 视图 ──
  const characterAssets: CharacterAsset[] = [];
  for (const char of characters) {
    const asset = await generateCharacterViews(
      { characterId: char.characterId, name: char.name, appearance: char.appearance },
      jobId
    );
    characterAssets.push(asset);
  }

  // ── 并行生成场景背景 ──
  const sceneAssets = await Promise.all(
    shots.map((shot, i) =>
      generateSceneBackground(
        { sceneId: shot.sceneId, visualDescription: shot.visualDescription },
        i,
        jobId
      )
    )
  );

  const manifest: AssetManifest = {
    characters: characterAssets,
    scenes: sceneAssets,
  };

  console.log(
    `[asset-gen] 完成: ${characterAssets.length} 角色, ${sceneAssets.length} 场景`
  );

  return { manifest, characterCount: characterAssets.length, sceneCount: sceneAssets.length };
}
