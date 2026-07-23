/**
 * 图片预下载 & AI 生成工具 — 在 Remotion 渲染前将远程图片本地化并转为 Base64。
 *
 * 流程：
 * 1. 下载 Unsplash/Pexels 远程图片 → app/images/<jobId>/
 * 2. 对 solid（纯色兜底）场景，调用 AI 生成图片
 * 3. 将本地文件转为 Base64 DataURL，内联传递给 Remotion（无需文件服务）
 *
 * 支持任意兼容 OpenAI 接口的图片生成服务（DashScope / 火山引擎 / DALL-E 等）。
 * 通过 AI_IMAGE_MODEL 指定模型，AI_IMAGE_API_KEY / AI_IMAGE_BASE_URL 配置连接。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { type VisualAsset, type ScriptScene } from '@/lib/types';
import { buildImageGenPrompt } from '@/lib/prompts/image-generation';

/** 图片本地存储根目录 */
export const IMAGE_STORE_DIR = path.resolve('./app/images');

// ── 配置（全部来自环境变量）─────────────────────────

const AI_IMAGE_API_KEY = process.env.AI_IMAGE_API_KEY;
const AI_IMAGE_BASE_URL = process.env.AI_IMAGE_BASE_URL;
const AI_IMAGE_MODEL = process.env.AI_IMAGE_MODEL;

// ── 图片下载 ────────────────────────────────────────

/**
 * 从远程 URL 下载图片到本地路径。
 * 失败时返回 false（不抛异常，保证流程继续）。
 */
async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!resp.ok) return false;

    const buffer = Buffer.from(await resp.arrayBuffer());
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, buffer);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[image-dl] 下载失败: ${url.slice(0, 60)}... → ${message}`);
    return false;
  }
}

// ── AI 图片生成（DashScope / 通义万象 兼容）─────────

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
 * 调用 AI 模型生成图片，下载到本地。
 * - 已配置 AI_IMAGE_* → 调用 API 生图 → 下载到本地
 * - 未配置或失败 → 返回 null（上游保持 solid 兜底）
 */
async function generateImageWithAI(
  prompt: string,
  destPath: string
): Promise<boolean> {
  if (!AI_IMAGE_API_KEY || !AI_IMAGE_BASE_URL || !AI_IMAGE_MODEL) {
    console.log('[image-gen] AI 图片生成未配置，跳过');
    return false;
  }

  try {
    console.log(`[image-gen] 生成中: "${prompt.slice(0, 40)}..."`);

    const resp = await fetch(AI_IMAGE_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_IMAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_IMAGE_MODEL,
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: buildImageGenPrompt(prompt),
                },
              ],
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
        `[image-gen] API 返回 ${resp.status}: ${errText.slice(0, 200)}`
      );
      return false;
    }

    const data = (await resp.json()) as ImageGenResponse;
    const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;

    if (!imageUrl) {
      console.warn('[image-gen] 响应中未找到图片 URL');
      return false;
    }

    // 下载生成的图片到本地
    console.log(`[image-gen] 下载生成图片: ${imageUrl.slice(0, 60)}...`);
    return await downloadImage(imageUrl, destPath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[image-gen] 异常: ${message}`);
    return false;
  }
}

// ── Base64 内联转换 ────────────────────────────────

/** 扩展名 → MIME 类型映射 */
const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/**
 * 将本地图片文件读取为 Base64 DataURL。
 * Remotion 可直接用 data: URL 作为 <Img src>，无需文件服务或 staticFile()。
 */
async function fileToBase64DataUrl(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_MAP[ext] ?? 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

// ── 公开 API ────────────────────────────────────────

/**
 * 预处理画面素材：远程图片下载到本地 + solid 场景 AI 生图 + Base64 内联。
 *
 * 图片持久存储到 app/images/<jobId>/（用于缓存/调试），
 * 但返回的 VisualAsset[].url 已经是 Base64 DataURL，可直接传给 Remotion <Img>。
 * solid 类型的 url（如 "#ff0000"）保持不变。
 */
export async function prepareVisuals(
  visuals: VisualAsset[] | undefined,
  script: ScriptScene[],
  jobId: string
): Promise<VisualAsset[]> {
  if (!visuals?.length) return [];

  const imageDir = path.join(IMAGE_STORE_DIR, jobId);
  await fs.mkdir(imageDir, { recursive: true });

  const prepared: VisualAsset[] = [];

  for (const visual of visuals) {
    const ext = visual.type === 'image' ? '.jpg' : '.png';
    const localName = `scene_${String(visual.sceneIndex).padStart(3, '0')}${ext}`;
    const destPath = path.join(imageDir, localName);

    if (visual.type === 'image') {
      // ── 远程图片 → 下载到本地 ──
      const ok = await downloadImage(visual.url, destPath);
      if (ok) {
        console.log(`[image-dl] 场景 ${visual.sceneIndex} 已下载 → ${destPath}`);
        prepared.push({ ...visual, url: destPath });
      } else {
        // 下载失败 → 回退 AI 生图
        console.warn(
          `[image-dl] 场景 ${visual.sceneIndex} 下载失败，尝试 AI 生成...`
        );
        const sceneText = script[visual.sceneIndex]?.text ?? '';
        const genOk = await generateImageWithAI(sceneText, destPath);
        if (genOk) {
          prepared.push({
            ...visual,
            type: 'image',
            url: destPath,
            source: 'ai-generated',
            photographer: undefined,
          });
        } else {
          // AI 也失败 → 保留原始 solid 兜底（标记为 ai-fallback）
          prepared.push({ ...visual });
        }
      }
    } else {
      // ── solid 兜底 → AI 生图 ──
      const sceneText = script[visual.sceneIndex]?.text ?? '';
      const ok = await generateImageWithAI(sceneText, destPath);
      if (ok) {
        console.log(`[image-gen] 场景 ${visual.sceneIndex} AI 生成 → ${destPath}`);
        prepared.push({
          ...visual,
          type: 'image',
          url: destPath,
          source: 'ai-generated',
          photographer: undefined,
        });
      } else {
        // AI 失败 → 保留原始 solid 兜底
        console.log(`[image-gen] 场景 ${visual.sceneIndex} AI 失败，保留纯色兜底`);
        prepared.push({ ...visual });
      }
    }
  }

  const downloaded = prepared.filter(
    (v) => v.type === 'image' && v.source !== 'solid'
  ).length;
  const aiGen = prepared.filter((v) => v.source === 'ai-generated').length;
  const solidFallback = prepared.filter((v) => v.type === 'solid').length;

  console.log(
    `[image-dl] 准备完成: ${prepared.length} 个场景 → ` +
      `下载=${downloaded - aiGen}, AI生成=${aiGen}, 纯色兜底=${solidFallback}`
  );

  // ── 将本地图片转为 Base64 DataURL，内联传递给 Remotion ──
  const withBase64 = await Promise.all(
    prepared.map(async (v) => {
      if (v.type === 'image' && v.url && !v.url.startsWith('data:')) {
        try {
          const dataUrl = await fileToBase64DataUrl(v.url);
          return { ...v, url: dataUrl };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.warn(`[image-dl] Base64 转换失败 ${v.url}: ${message}`);
          return v; // 保留原始路径，让渲染层兜底处理
        }
      }
      return v;
    })
  );

  return withBase64;
}
