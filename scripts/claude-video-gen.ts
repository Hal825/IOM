/**
 * 方案 B · Claude 视频生成器（配合 worker 的 AI_VIDEO_MODE=claude）。
 *
 * 套餐视频 key 仅 Claude 可用（项目调用 403）→ worker 在 shot_video_gen 暂停在
 * pause_gate_video 门；本脚本用套餐 API 逐场景生成视频，完成后调用
 * POST /api/tasks/{jobId}/claude-release 放行 → worker 继续 video_merge 拼接。
 *
 * 用法：
 *   npx tsx --env-file=.env scripts/claude-video-gen.ts <jobId>
 *
 * 依赖 .env：ANTHROPIC_AUTH_TOKEN（套餐 key，sk-sp-）。
 * 模型：happyhorse-1.1-r2v（图生视频，带场景参考图）优先；无公网场景图时回退 happyhorse-1.1-t2v。
 * 480P（测试统一）；r2v 参数 {resolution, duration, style_strength}，t2v 参数 {resolution, ratio, duration}。
 * 传 --t2v 可强制走 t2v。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'node:fs';
import path from 'node:path';

const VIDEO_SYNTH_URL =
  'https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis';
const TASK_LIST_URL =
  'https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/tasks';
const MODEL_R2V = 'happyhorse-1.1-r2v';
const MODEL_T2V = 'happyhorse-1.1-t2v';
const RESOLUTION = process.env.AI_VIDEO_RESOLUTION ?? '480P';
const RATIO = '16:9';
const STYLE_STRENGTH = Number(process.env.AI_VIDEO_STYLE_STRENGTH ?? '0.85');
const POLL_MS = 15_000;
const MAX_WAIT_MS = 10 * 60_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 时长钳制并取整到 [3,15]（DashScope happyhorse 限制） */
function clampDuration(seconds: number, min = 3, max = 15): number {
  const r = Math.round(seconds);
  return Math.min(max, Math.max(min, r));
}

/** 由 SceneVideoSpec.storyboard 构建运镜/构图描述（与 lib/tools/video-generation/util.ts 一致） */
function buildMotionDescription(board: any): string {
  const parts: string[] = [];
  const shot = board?.shot ?? {};
  if (shot.movement?.trim()) parts.push(`Movement: ${shot.movement}`);
  if (shot.type?.trim()) parts.push(`Shot type: ${shot.type}`);
  if (shot.angle?.trim()) parts.push(`Angle: ${shot.angle}`);
  if (shot.focus?.trim()) parts.push(`Focus: ${shot.focus}`);
  if (board?.composition?.trim()) parts.push(`Composition: ${board.composition}`);
  if (board?.lighting?.trim()) parts.push(`Lighting: ${board.lighting}`);
  if (board?.atmosphere?.trim()) parts.push(`Atmosphere: ${board.atmosphere}`);
  if (typeof board?.motionLevel === 'number') parts.push(`Motion level (1-5): ${board.motionLevel}`);
  for (const ve of board?.visualElements ?? []) {
    if (ve?.trim()) parts.push(`Visual element: ${ve}`);
  }
  return parts.join('. ');
}

/** 收集场景的可用公网参考图（r2v 用）；本地路径/缺失则忽略 */
function collectMedia(spec: any): string[] {
  const urls: string[] = [];
  if (typeof spec.assets?.sceneImageUrl === 'string' && /^https?:\/\//i.test(spec.assets.sceneImageUrl)) {
    urls.push(spec.assets.sceneImageUrl);
  }
  for (const u of spec.assets?.characterImageUrls ?? []) {
    if (typeof u === 'string' && /^https?:\/\//i.test(u)) urls.push(u);
  }
  return urls;
}

async function generateSceneVideo(
  key: string,
  scenesDir: string,
  spec: any,
  forceT2V: boolean
): Promise<void> {
  const duration = clampDuration(spec.duration);
  const media = collectMedia(spec);
  const motion = buildMotionDescription(spec.storyboard);

  // 有公网场景图且未强制 t2v → r2v（图生视频，带 reference_image）
  const useR2V = !forceT2V && media.length > 0;
  const model = useR2V ? MODEL_R2V : MODEL_T2V;

  let body: Record<string, unknown>;
  if (useR2V) {
    body = {
      model,
      input: {
        prompt: motion,
        negative_prompt: spec.storyboard?.negativePrompt,
        media: media.map((url) => ({ type: 'reference_image', url })),
      },
      parameters: { resolution: RESOLUTION, duration, style_strength: STYLE_STRENGTH },
    };
  } else {
    const prompt = [spec.story?.sceneDescription, motion].filter(Boolean).join('. ');
    body = {
      model,
      input: { prompt },
      parameters: { resolution: RESOLUTION, ratio: RATIO, duration },
    };
  }
  console.log(
    `  ${spec.sceneId}: ${useR2V ? `r2v（${media.length} 张参考图）` : 't2v（无公网场景图）'} · ${duration}s / ${RESOLUTION}`
  );

  const submit = await fetch(VIDEO_SYNTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'X-DashScope-Async': 'enable',
    },
    body: JSON.stringify(body),
  });
  if (!submit.ok) {
    throw new Error(`提交失败 ${submit.status}: ${(await submit.text()).slice(0, 300)}`);
  }
  const submitData = (await submit.json()) as { output?: { task_id?: string } };
  const taskId = submitData.output?.task_id;
  if (!taskId) {
    throw new Error(`未拿到 task_id: ${JSON.stringify(submitData).slice(0, 300)}`);
  }
  console.log(`  ${spec.sceneId}: 已提交 task ${taskId}（${duration}s / ${RESOLUTION}）`);

  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    await sleep(POLL_MS);
    const pr = await fetch(`${TASK_LIST_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const pd = (await pr.json()) as {
      output?: { task_status?: string; video_url?: string; results?: Array<{ video_url?: string }> };
    };
    const st = pd.output?.task_status;
    if (st === 'SUCCEEDED') {
      const url = pd.output?.video_url ?? pd.output?.results?.[0]?.video_url;
      if (!url) throw new Error(`SUCCEEDED 但无 video_url: ${JSON.stringify(pd).slice(0, 200)}`);
      const dl = await fetch(url);
      if (!dl.ok) throw new Error(`下载视频失败: HTTP ${dl.status}`);
      const buf = Buffer.from(await dl.arrayBuffer());
      fs.writeFileSync(path.join(scenesDir, `${spec.sceneId}.mp4`), buf);
      console.log(`  ${spec.sceneId}: 已下载 ${(buf.length / 1024).toFixed(0)} KB`);
      return;
    }
    if (st === 'FAILED') {
      throw new Error(`${spec.sceneId} 生成失败: ${JSON.stringify(pd).slice(0, 300)}`);
    }
    console.log(`  ${spec.sceneId}: ${st}`);
  }
  throw new Error(`${spec.sceneId} 超时（${MAX_WAIT_MS / 60_000}min）`);
}

async function main(): Promise<void> {
  const jobId = process.argv[2];
  const forceT2V = process.argv.includes('--t2v');
  if (!jobId) {
    console.error('用法: npx tsx --env-file=.env scripts/claude-video-gen.ts <jobId> [--t2v]');
    process.exit(1);
  }
  const key = process.env.ANTHROPIC_AUTH_TOKEN;
  if (!key) {
    console.error('缺少 ANTHROPIC_AUTH_TOKEN（套餐 key，需在 .env 且用 --env-file=.env 启动）');
    process.exit(1);
  }

  const scenesDir = path.join(process.cwd(), 'storage', 'scenes', jobId);
  const specPath = path.join(scenesDir, 'scene-specs.json');
  if (!fs.existsSync(specPath)) {
    console.error(`缺少 ${specPath} —— 任务还没跑到 shot_video_gen，或已在视频节点失败`);
    process.exit(1);
  }
  const specs = JSON.parse(fs.readFileSync(specPath, 'utf-8')) as any[];
  console.log(`[claude-video-gen] job ${jobId}: ${specs.length} 个场景，${RESOLUTION}/${RATIO}${forceT2V ? '（强制 t2v）' : ''}`);

  for (const spec of specs) {
    await generateSceneVideo(key, scenesDir, spec, forceT2V);
  }

  // 全部场景就绪 → 放行 worker（API 进程清 paused/awaiting + 广播 proceed）
  const release = await fetch(`http://localhost:3000/api/tasks/${jobId}/claude-release`, {
    method: 'POST',
  });
  const releaseText = await release.text();
  console.log(`[claude-video-gen] 放行: HTTP ${release.status} ${releaseText}`);
  if (!release.ok) throw new Error(`放行失败: ${releaseText}`);
  console.log('[claude-video-gen] 完成 ✅ worker 将继续拼接（video_merge）→ 前端出成片');
}

main().catch((e) => {
  console.error('[claude-video-gen] 失败:', e.message);
  process.exit(1);
});
