import type { Job } from 'bullmq';
import path from 'node:path';
import type { TaskData, TaskResult } from './types';
import { videoGraph } from '@/lib/agent/graph';
import { pausePoint } from '@/lib/pause';

/**
 * 核心编排器 — 调用 LangGraph 管线完成端到端视频生成。
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
  const result = await videoGraph.invoke({ userPrompt: text, jobId });

  const videoPath = (result.mergedVideoUrl as string) ?? '';
  const durationSec = (result.durationSec as number) ?? 0;

  await job.updateProgress(100);
  return {
    videoPath: videoPath.startsWith(storageDir)
      ? path.relative(storageDir, videoPath).replaceAll('\\', '/')
      : videoPath,
    durationSec,
  };
}
