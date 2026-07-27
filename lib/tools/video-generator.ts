/**
 * AI 视频生成工具 — DashScope / 火山引擎 视频合成。
 *
 * 将素材清单（AssetManifest）和分镜提案（Proposal）提交给 AI 视频生成服务。
 * 支持异步任务模式（DashScope: X-DashScope-Async）。
 *
 * 配置通过 AI_VIDEO_API_KEY / AI_VIDEO_BASE_URL / AI_VIDEO_MODEL 环境变量管理。
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import type { Proposal, AssetManifest } from '@/lib/types';

// ── 配置（全部来自环境变量）─────────────────────────

const AI_VIDEO_API_KEY = process.env.AI_VIDEO_API_KEY;
const AI_VIDEO_BASE_URL = process.env.AI_VIDEO_BASE_URL;
const AI_VIDEO_MODEL = process.env.AI_VIDEO_MODEL;
const AI_VIDEO_RESOLUTION = process.env.AI_VIDEO_RESOLUTION ?? '720P';

/** DashScope 异步任务查询端点（与创建端点路径不同） */
const AI_VIDEO_TASK_URL: string = (() => {
  if (!AI_VIDEO_BASE_URL) return '';
  try {
    const origin = new URL(AI_VIDEO_BASE_URL).origin;
    return `${origin}/api/v1/tasks`;
  } catch {
    return `${AI_VIDEO_BASE_URL}/tasks`;
  }
})();

/** 视频输出根目录 */
export const VIDEO_OUTPUT_DIR = path.resolve('./storage/output');

/** 异步任务轮询间隔（毫秒） */
const POLL_INTERVAL_MS = 5000;
/** 异步任务最大等待时间（毫秒） */
const MAX_WAIT_MS = 600_000; // 10 分钟

// ── 类型 ────────────────────────────────────────────

export interface VideoGenResult {
  videoPath: string;
  durationSec: number;
  model: string;
}

/** 创建任务响应 */
interface TaskCreatedResponse {
  output?: {
    task_id?: string;
    task_status?: string;
  };
  request_id?: string;
}

/** 查询任务响应 */
interface TaskResultResponse {
  output?: {
    task_id?: string;
    task_status?: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    /** DashScope: video_url 可能在 output 根级别 */
    video_url?: string;
    /** 或者嵌套在 results 数组中 */
    results?: Array<{ video_url?: string }>;
    message?: string;
  };
}

// ── 构建 prompt ─────────────────────────────────────

/**
 * 将 Proposal.shotScript 中的 videoPrompt 串联为视频生成 prompt。
 * 用第一张场景背景作为首帧参考。
 */
function buildPrompt(proposal: Proposal): string {
  const scenes = proposal.shotScript
    .map((s, i) => `[场景${i + 1} ${s.duration}s] ${s.videoPrompt}`)
    .join('\n');

  return `视频生成任务：\n标题：${proposal.blueprint.title}\n风格：${proposal.videoGen?.style ?? proposal.styleGuide.globalTone}\n\n分镜脚本：\n${scenes}`;
}

/** 获取首帧参考图片 URL（优先使用可公网访问的远程 URL） */
function getFirstFrameUrl(assetManifest: AssetManifest): string | undefined {
  const scene = assetManifest.scenes[0];
  if (!scene) return undefined;
  // remoteUrl 是 DashScope 返回的临时公网 URL，video API 需要公网可访问的地址
  return scene.remoteUrl ?? scene.imageUrl;
}

// ── API 调用 ────────────────────────────────────────

/**
 * 创建视频生成异步任务（DashScope async 模式）。
 * 返回 task_id，后续轮询获取结果。
 */
async function createVideoTask(
  proposal: Proposal,
  assetManifest: AssetManifest,
  audioUrl?: string
): Promise<string | null> {
  if (!AI_VIDEO_API_KEY || !AI_VIDEO_BASE_URL || !AI_VIDEO_MODEL) {
    console.log('[video-gen] AI 视频生成未配置，使用占位输出');
    return null;
  }

  const prompt = buildPrompt(proposal);
  const firstFrameUrl = getFirstFrameUrl(assetManifest);

  // 构建 media 数组（首帧参考图）
  const media: Array<{ type: string; url: string }> = [];
  if (firstFrameUrl && (firstFrameUrl.startsWith('http') || firstFrameUrl.startsWith('/'))) {
    media.push({ type: 'first_frame', url: firstFrameUrl });
  }

  const body: Record<string, unknown> = {
    model: AI_VIDEO_MODEL,
    input: {
      prompt,
      media: media.length > 0 ? media : undefined,
    },
    parameters: {
      resolution: AI_VIDEO_RESOLUTION,
      duration: proposal.videoGen?.duration ?? proposal.blueprint.totalDuration,
    },
  };

  // 清理 undefined 值
  if (!media.length) delete (body.input as Record<string, unknown>).media;

  try {
    console.log(`[video-gen] 创建视频任务: "${prompt.slice(0, 80)}..."`);
    if (audioUrl) console.log(`[video-gen] 含语音参考: ${audioUrl}`);

    const resp = await fetch(AI_VIDEO_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_VIDEO_API_KEY}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(`[video-gen] 创建任务返回 ${resp.status}: ${errText.slice(0, 300)}`);
      return null;
    }

    const data = (await resp.json()) as TaskCreatedResponse;
    const taskId = data.output?.task_id;
    if (!taskId) {
      console.warn('[video-gen] 响应中未找到 task_id');
      return null;
    }

    console.log(`[video-gen] 任务已创建: ${taskId}`);
    return taskId;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[video-gen] 创建任务异常: ${message}`);
    return null;
  }
}

/**
 * 轮询异步任务直到完成或超时。
 * 返回视频 URL，失败返回 null。
 */
async function pollVideoTask(taskId: string): Promise<string | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT_MS) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    try {
      const resp = await fetch(
        `${AI_VIDEO_TASK_URL}/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${AI_VIDEO_API_KEY}`,
          },
          signal: AbortSignal.timeout(10_000),
        }
      );

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.warn(`[video-gen] 查询任务返回 ${resp.status}: ${errText.slice(0, 300)}`);
        // 4xx 客户端错误 → 重试无意义，立即失败
        if (resp.status >= 400 && resp.status < 500) return null;
        // 5xx 服务端错误 → 继续轮询
        continue;
      }

      const data = (await resp.json()) as TaskResultResponse;
      const status = data.output?.task_status;

      console.log(`[video-gen] 任务 ${taskId} → ${status}`);

      if (status === 'SUCCEEDED') {
        // 兼容多种响应格式：output.video_url | output.results[0].video_url
        const videoUrl =
          data.output?.video_url ??
          data.output?.results?.[0]?.video_url;
        if (videoUrl) return videoUrl;
        console.warn('[video-gen] 任务成功但未找到视频 URL:', JSON.stringify(data.output).slice(0, 300));
        return null;
      }

      if (status === 'FAILED') {
        console.warn(`[video-gen] 任务失败: ${data.output?.message ?? '未知错误'}`);
        return null;
      }
      // PENDING / RUNNING → 继续轮询
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[video-gen] 轮询异常: ${message}`);
    }
  }

  console.warn(`[video-gen] 任务 ${taskId} 超时（${MAX_WAIT_MS / 1000}s）`);
  return null;
}

// ── 占位视频生成 ────────────────────────────────────

async function createPlaceholderVideo(
  jobId: string
): Promise<{ videoPath: string; durationSec: number }> {
  const outputDir = path.join(VIDEO_OUTPUT_DIR);
  await fs.mkdir(outputDir, { recursive: true });
  const placeholderPath = path.join(outputDir, `${jobId}.placeholder.mp4`);

  await fs.writeFile(
    placeholderPath,
    JSON.stringify(
      {
        status: 'placeholder',
        jobId,
        message: 'AI 视频生成 API 未配置或任务失败。请在 .env 中设置 AI_VIDEO_* 变量。',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log(`[video-gen] 占位输出: ${placeholderPath}`);
  return { videoPath: placeholderPath, durationSec: 0 };
}

// ── 下载视频到本地 ──────────────────────────────────

async function downloadVideo(url: string, jobId: string): Promise<string | null> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(300_000) });
    if (!resp.ok) return null;

    const outputDir = path.join(VIDEO_OUTPUT_DIR);
    await fs.mkdir(outputDir, { recursive: true });
    const localPath = path.join(outputDir, `${jobId}.mp4`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    await fs.writeFile(localPath, buffer);
    return localPath;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[video-gen] 下载失败: ${message}`);
    return null;
  }
}

// ── 公开 API ────────────────────────────────────────

/**
 * 生成最终视频。
 *
 * 流程：创建异步任务 → 轮询 → 下载到本地 storage/output/<jobId>.mp4
 */
export async function generateVideo(
  proposal: Proposal,
  assetManifest: AssetManifest,
  jobId: string,
  audioUrl?: string
): Promise<VideoGenResult> {
  console.log('[video-gen] 开始视频生成...' +
    (audioUrl ? ` (含语音: ${audioUrl})` : ' (无语音)'));

  // 1. 创建异步任务
  const taskId = await createVideoTask(proposal, assetManifest, audioUrl);
  if (!taskId) {
    const placeholder = await createPlaceholderVideo(jobId);
    return { ...placeholder, model: 'placeholder' };
  }

  // 2. 轮询任务结果
  const videoUrl = await pollVideoTask(taskId);
  if (!videoUrl) {
    const placeholder = await createPlaceholderVideo(jobId);
    return { ...placeholder, model: 'placeholder' };
  }

  // 3. 下载到本地
  const localPath = await downloadVideo(videoUrl, jobId);
  const finalPath = localPath ?? videoUrl;

  console.log(`[video-gen] 完成: ${finalPath}`);
  return {
    videoPath: finalPath,
    durationSec: proposal.videoGen?.duration ?? proposal.blueprint.totalDuration,
    model: AI_VIDEO_MODEL!,
  };
}
