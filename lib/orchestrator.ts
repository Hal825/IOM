import type { Job } from 'bullmq';
import path from 'node:path';
import type { TaskData, TaskResult } from './types';
import { videoGraph } from '@/lib/agent/graph';
import { pausePoint } from '@/lib/pause';
import { publishPipelineEvent } from '@/lib/agent/events';

/**
 * 逐节点遍历 stream("updates") 的纯逻辑（可单测）：
 * 非空 output → 回调 onNodeEvent；空 output（如暂停门返回 {}）→ 跳过；
 * 收集最终状态（video_merge 的 mergedVideoUrl / durationSec）。
 * 图内节点抛错 → for-await 直接抛（零容错保持）。
 */
export interface DrainedState {
  mergedVideoUrl: string | null;
  durationSec: number;
}

export async function drainGraphUpdates(
  stream: AsyncIterable<Record<string, unknown>>,
  onNodeEvent: (nodeName: string, output: Record<string, unknown>) => Promise<void>
): Promise<DrainedState> {
  let mergedVideoUrl: string | null = null;
  let durationSec = 0;
  for await (const update of stream) {
    for (const [nodeName, output] of Object.entries(update)) {
      // 只发非空 output 的节点（暂停门返回 {} → 不产卡，其提问来自显式 gate 事件）
      if (output && typeof output === 'object' && Object.keys(output).length > 0) {
        await onNodeEvent(nodeName, output as Record<string, unknown>);
      }
      // 收集最终状态
      if (output && typeof output === 'object') {
        const o = output as Record<string, unknown>;
        if (typeof o.mergedVideoUrl === 'string') mergedVideoUrl = o.mergedVideoUrl;
        if (typeof o.durationSec === 'number') durationSec = o.durationSec;
      }
    }
  }
  return { mergedVideoUrl, durationSec };
}

/**
 * 核心编排器 — 调用 LangGraph 管线完成端到端视频生成。
 *
 * Worker 是「纯执行者」：用 stream("updates") 逐节点拿增量状态，
 * 每个节点完成即发布原始事件到 Redis（coordinator 订阅后决定呈现），
 * 暂停门在节点内发布 gate 事件并阻塞等用户回复。
 *
 * 新流程：research → proposal → script_gen
 *   → fanout(asset_gen ‖ tts) → fanout(shot_video_gen × N)
 *   → video_merge → END
 */
export async function executeTask(
  job: Job<TaskData>,
  storageDir: string
): Promise<TaskResult> {
  const jobId = String(job.id);
  const text = job.data.text?.trim();
  if (!text) throw new Error('任务文本为空');

  await job.updateProgress(10);
  await job.log('LangGraph 管线启动');
  await pausePoint(jobId); // 排队中即被暂停的任务在此挂起，直到恢复或删除

  let mergedVideoUrl: string | null = null;
  let durationSec = 0;

  try {
    // 重跑：以「上游产出 + rerunFrom」为初始状态跑同一张全图（上游节点因产出已存在而跳过）
    const initial: Record<string, unknown> = {
      userPrompt: text,
      jobId,
      ...(job.data.resumeState ?? {}),
      ...(job.data.videoMode ? { videoMode: job.data.videoMode } : {}),
      ...(job.data.rerunFrom ? { rerunFrom: job.data.rerunFrom } : {}),
    };
    const stream = await videoGraph.stream(initial, { streamMode: 'updates' });
    const drained = await drainGraphUpdates(stream, async (nodeName, output) => {
      await publishPipelineEvent(jobId, { type: 'node', nodeName, output });
    });
    mergedVideoUrl = drained.mergedVideoUrl;
    durationSec = drained.durationSec;
  } catch (err) {
    // 图内节点抛错（零容错）：发布 error 事件后让任务失败
    const message = err instanceof Error ? err.message : String(err);
    await publishPipelineEvent(jobId, { type: 'error', message }).catch(() => {});
    throw err;
  }

  const videoPath = mergedVideoUrl ?? '';
  const relPath = videoPath.startsWith(storageDir)
    ? path.relative(storageDir, videoPath).replaceAll('\\', '/')
    : videoPath;

  await job.updateProgress(100);
  // 发布完成状态事件（coordinator 转发给前端）
  await publishPipelineEvent(jobId, {
    type: 'status',
    status: 'completed',
    result: { videoPath: relPath, durationSec },
  }).catch(() => {});

  return { videoPath: relPath, durationSec };
}
