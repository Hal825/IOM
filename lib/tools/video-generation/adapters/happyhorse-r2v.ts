/**
 * happyhorse-1.1-r2v 视频模型适配器 — DashScope 异步视频生成。
 *
 * 协议：创建任务（X-DashScope-Async: enable）→ 轮询任务状态 → 下载视频。
 * 输入参考图（reference_image）：场景首帧 + 角色视图（公网 http(s) URL）。
 * 零容错：配置缺失 / API 失败 / 任务失败 / 超时 直接抛错。
 */

import type { VideoGenRequest, VideoGenResult } from '../types';
import { registerAdapter, type VideoModelAdapter } from '../adapter';

export const MODEL = 'happyhorse-1.1-r2v';

const POLL_INTERVAL_MS = 5000;
const MAX_WAIT_MS = 600_000; // 10 分钟

// ── 任务创建 URL ────────────────────────────────────
function getTaskUrl(baseUrl: string): string {
  try {
    const origin = new URL(baseUrl).origin;
    return `${origin}/api/v1/tasks`;
  } catch {
    return `${baseUrl}/tasks`;
  }
}

// ── 类型 ────────────────────────────────────────────

interface TaskCreatedResponse {
  output?: { task_id?: string; task_status?: string };
  request_id?: string;
}

interface TaskResultResponse {
  output?: {
    task_id?: string;
    task_status?: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    video_url?: string;
    results?: Array<{ video_url?: string }>;
    message?: string;
  };
}

export class HappyhorseR2vAdapter implements VideoModelAdapter {
  readonly model = MODEL;

  async generateVideo(req: VideoGenRequest): Promise<VideoGenResult> {
    const apiKey = process.env.AI_VIDEO_API_KEY;
    const baseUrl = process.env.AI_VIDEO_BASE_URL;
    if (!apiKey || !baseUrl) {
      throw new Error('视频生成环境变量未配置（AI_VIDEO_API_KEY / AI_VIDEO_BASE_URL）');
    }

    // 分辨率：请求档位合法则用之，否则回退 env（缺省 720P）
    const resolution = /^(480P|720P|1080P|2K|4K)$/i.test(req.resolution)
      ? req.resolution.toUpperCase()
      : process.env.AI_VIDEO_RESOLUTION ?? '720P';

    const prompt = `Motion: ${req.motionDescription}\nStyle strength: ${req.styleStrength}`;

    // 构建媒体引用：场景图必须为公网 http(s)（i2v 需要首帧），否则抛错
    if (!/^https?:\/\//i.test(req.sceneImageUrl)) {
      throw new Error(`场景图必须为公网 http(s) URL，收到: ${req.sceneImageUrl}`);
    }
    const media: Array<{ type: string; url: string }> = [
      { type: 'reference_image', url: req.sceneImageUrl },
    ];
    for (const path of req.characterImageUrls) {
      if (path.startsWith('http')) {
        media.push({ type: 'reference_image', url: path });
      }
    }

    const body: Record<string, unknown> = {
      model: this.model,
      input: {
        prompt,
        negative_prompt: req.negativePrompt,
        media,
      },
      parameters: {
        resolution,
        duration: req.durationSec,
        style_strength: req.styleStrength,
      },
    };

    console.log(
      `[shot-video] 创建任务 (${media.length} 张参考图): ` +
      `"${req.motionDescription.slice(0, 60)}..."`
    );

    // 1. 创建异步任务（含 429 重试，间隔 5s，最多 3 次）
    let taskId: string | undefined;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        const delay = 5000 * attempt;
        console.log(`[shot-video] 429 重试，${delay / 1000}s 后重试...`);
        await new Promise((r) => setTimeout(r, delay));
      }

      const createResp = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-DashScope-Async': 'enable',
        },
        body: JSON.stringify(body),
      });

      if (createResp.status === 429) continue;

      if (!createResp.ok) {
        const errText = await createResp.text().catch(() => '');
        throw new Error(`创建视频任务失败 ${createResp.status}: ${errText.slice(0, 300)}`);
      }

      const createData = (await createResp.json()) as TaskCreatedResponse;
      taskId = createData.output?.task_id;
      if (taskId) break;
    }

    if (!taskId) throw new Error('视频任务创建失败（多次 429 或响应中未找到 task_id）');

    console.log(`[shot-video] 任务 ${taskId} 已创建`);

    // 2. 轮询等待完成
    const taskUrl = getTaskUrl(baseUrl);
    const startTime = Date.now();

    while (Date.now() - startTime < MAX_WAIT_MS) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

      const pollResp = await fetch(`${taskUrl}/${taskId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!pollResp.ok) {
        if (pollResp.status >= 400 && pollResp.status < 500) {
          const errText = await pollResp.text().catch(() => '');
          throw new Error(`查询任务失败 ${pollResp.status}: ${errText.slice(0, 300)}`);
        }
        continue;
      }

      const pollData = (await pollResp.json()) as TaskResultResponse;
      const status = pollData.output?.task_status;
      console.log(`[shot-video] 任务 ${taskId} → ${status}`);

      if (status === 'SUCCEEDED') {
        const videoUrl =
          pollData.output?.video_url ??
          pollData.output?.results?.[0]?.video_url;
        if (!videoUrl) throw new Error('任务成功但未找到 video_url');
        const buffer = await this.downloadVideo(videoUrl);
        return { buffer, durationSec: req.durationSec };
      }

      if (status === 'FAILED') {
        throw new Error(`任务失败: ${pollData.output?.message ?? '未知错误'}`);
      }
    }

    throw new Error(`任务 ${taskId} 超时（${MAX_WAIT_MS / 1000}s）`);
  }

  // ── 下载 ────────────────────────────────────────────
  private async downloadVideo(url: string): Promise<Buffer> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`下载视频失败: HTTP ${resp.status}`);
    return Buffer.from(await resp.arrayBuffer());
  }
}

// ── 注册内置模型（副作用：必须先于 createVideoAdapter() 调用）──
registerAdapter(MODEL, () => new HappyhorseR2vAdapter());
