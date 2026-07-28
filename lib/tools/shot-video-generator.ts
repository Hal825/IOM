/**
 * 单镜头视频生成工具 — DashScope happyhorse-1.1-i2v。
 *
 * 为单个镜头独立生成视频片段，返回 Buffer。
 * 异步模式：创建任务 → 轮询 → 下载。
 * 零容错：任何异常直接抛出。
 */

// ── 配置 ────────────────────────────────────────────

const AI_VIDEO_API_KEY = process.env.AI_VIDEO_API_KEY!;
const AI_VIDEO_BASE_URL = process.env.AI_VIDEO_BASE_URL!;
const AI_VIDEO_MODEL = process.env.AI_VIDEO_MODEL!;
const AI_VIDEO_RESOLUTION = process.env.AI_VIDEO_RESOLUTION ?? '720P';

const POLL_INTERVAL_MS = 5000;
const MAX_WAIT_MS = 600_000; // 10 分钟

// ── 任务创建 URL ────────────────────────────────────
function getTaskUrl(): string {
  try {
    const origin = new URL(AI_VIDEO_BASE_URL).origin;
    return `${origin}/api/v1/tasks`;
  } catch {
    return `${AI_VIDEO_BASE_URL}/tasks`;
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

// ── 公开 API ────────────────────────────────────────

export interface SingleVideoInput {
  sceneImagePath: string;
  /** 所有出镜角色的视图 URL（OSS 公网地址），最多 8 张（2 角色 × 4 视图） */
  characterImagePaths: string[];
  motionDescription: string;
  negativePrompt: string;
  duration: number;
  styleStrength: number;
}

/**
 * 为单个镜头生成视频片段。
 * 零容错：API 失败或配置缺失直接抛异常。
 */
export async function generateSingleVideo(input: SingleVideoInput): Promise<Buffer> {
  if (!AI_VIDEO_API_KEY || !AI_VIDEO_BASE_URL || !AI_VIDEO_MODEL) {
    throw new Error('视频生成环境变量未配置（AI_VIDEO_API_KEY / AI_VIDEO_BASE_URL / AI_VIDEO_MODEL）');
  }

  const prompt = `Motion: ${input.motionDescription}\nStyle strength: ${input.styleStrength}`;

  // 构建媒体引用：场景图 + 所有角色参考图（最多 1 + 8 = 9 张）
  const media: Array<{ type: string; url: string }> = [];
  if (input.sceneImagePath.startsWith('http')) {
    media.push({ type: 'reference_image', url: input.sceneImagePath });
  }
  for (const path of input.characterImagePaths) {
    if (path.startsWith('http')) {
      media.push({ type: 'reference_image', url: path });
    }
  }

  const body: Record<string, unknown> = {
    model: AI_VIDEO_MODEL,
    input: {
      prompt,
      negative_prompt: input.negativePrompt,
      media: media.length > 0 ? media : undefined,
    },
    parameters: {
      resolution: AI_VIDEO_RESOLUTION,
      duration: input.duration,
      style_strength: input.styleStrength,
    },
  };

  console.log(
    `[shot-video] 创建任务 (${media.length} 张参考图): ` +
    `"${input.motionDescription.slice(0, 60)}..."`
  );

  // 1. 创建异步任务（含 429 重试，间隔 5s，最多 3 次）
  let taskId: string | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      const delay = 5000 * attempt;
      console.log(`[shot-video] 429 重试，${delay / 1000}s 后重试...`);
      await new Promise((r) => setTimeout(r, delay));
    }

    const createResp = await fetch(AI_VIDEO_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_VIDEO_API_KEY}`,
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
  const taskUrl = getTaskUrl();
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT_MS) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const pollResp = await fetch(`${taskUrl}/${taskId}`, {
      headers: { Authorization: `Bearer ${AI_VIDEO_API_KEY}` },
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
      return downloadVideo(videoUrl);
    }

    if (status === 'FAILED') {
      throw new Error(`任务失败: ${pollData.output?.message ?? '未知错误'}`);
    }
  }

  throw new Error(`任务 ${taskId} 超时（${MAX_WAIT_MS / 1000}s）`);
}

// ── 下载 ────────────────────────────────────────────

async function downloadVideo(url: string): Promise<Buffer> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`下载视频失败: HTTP ${resp.status}`);
  return Buffer.from(await resp.arrayBuffer());
}
