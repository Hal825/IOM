import type { Job } from 'bullmq';
import path from 'node:path';
import type { TaskData, TaskResult, TaskSummary } from './types';

/** 产物存储根目录（与 Worker 保持一致，均相对项目根） */
export const STORAGE_DIR = path.resolve('./storage');

/** 把 BullMQ Job 转成前端可用的任务摘要 */
export async function jobToSummary(job: Job<TaskData>): Promise<TaskSummary> {
  const state = await job.getState();
  return {
    id: String(job.id),
    status: state,
    progress: typeof job.progress === 'number' ? job.progress : 0,
    text: (job.data.text || job.data.script?.map((s) => s.text).join('') || '').slice(0, 80),
    createdAt: job.timestamp,
    result: (job.returnvalue as TaskResult | undefined) ?? undefined,
    failedReason: job.failedReason || undefined,
  };
}
