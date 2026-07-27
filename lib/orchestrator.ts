import type { Job } from 'bullmq';
import path from 'node:path';
import type { TaskData, TaskResult } from './types';
import { videoGraph } from '@/lib/agent/graph';

/**
 * 核心编排器 — 调用 LangGraph 管线完成端到端视频生成。
 *
 * 新流程：research → proposal → asset_gen → video_gen
 * progress 映射: 10=research, 30=proposal, 60=asset_gen, 90=video_gen, 100=完成
 */
export async function executeTask(
  job: Job<TaskData>,
  storageDir: string
): Promise<TaskResult> {
  const jobId = String(job.id);
  const text = job.data.text?.trim();
  if (!text) {
    throw new Error('任务文本为空');
  }

  // LangGraph 状态机：调研 → 提案 → 素材生成 → 视频生成
  await job.updateProgress(10);
  await job.log('阶段 1/4: 内容调研');
  const result = await videoGraph.invoke({ userPrompt: text, jobId });

  await job.updateProgress(90);
  await job.log('阶段 4/4: 视频生成');

  const videoPath = (result.videoUrl as string) ?? '';
  const durationSec = (result.durationSec as number) ?? 0;

  await job.updateProgress(100);
  return {
    videoPath: videoPath.startsWith(storageDir)
      ? path.relative(storageDir, videoPath).replaceAll('\\', '/')
      : videoPath,
    durationSec,
  };
}
