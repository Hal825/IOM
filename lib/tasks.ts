import type { Job } from 'bullmq';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { TaskData, TaskResult, TaskSummary } from './types';
import { isJobPaused } from './pause';

/** 产物存储根目录（与 Worker 保持一致，均相对项目根） */
export const STORAGE_DIR = path.resolve('./storage');

/** 把 BullMQ Job 转成前端可用的任务摘要 */
export async function jobToSummary(job: Job<TaskData>): Promise<TaskSummary> {
  const state = await job.getState();
  const paused = await isJobPaused(String(job.id));
  return {
    id: String(job.id),
    // 逐任务暂停：waiting/active 且被暂停 → 展示为 paused（恢复后还原）
    status: paused && (state === 'waiting' || state === 'active') ? 'paused' : state,
    progress: typeof job.progress === 'number' ? job.progress : 0,
    text: (job.data.text || '').slice(0, 80),
    createdAt: job.timestamp,
    result: (job.returnvalue as TaskResult | undefined) ?? undefined,
    failedReason: job.failedReason || undefined,
  };
}

/**
 * 删除某任务的全部产物（按 jobId 隔离，路径与 lib/agent/nodes.ts 一致）。
 * 不动 storage/assets/ 根级共享库 / library/ —— 跨任务复用。
 * dirs 可注入（测试用临时目录），默认用真实 storage / log 目录。
 */
export async function deleteTaskFiles(
  jobId: string,
  dirs: { storageDir?: string; logDir?: string } = {}
): Promise<void> {
  const storageDir = dirs.storageDir ?? STORAGE_DIR;
  const logDir = dirs.logDir ?? path.resolve('./log/procedure');
  const targets = [
    path.join(storageDir, 'output', `${jobId}.mp4`),
    path.join(storageDir, 'scenes', jobId),
    path.join(storageDir, 'scripts', jobId),
    path.join(storageDir, 'audio', jobId),
    path.join(storageDir, 'assets', jobId),
    path.join(logDir, `job-${jobId}`),
  ];
  for (const target of targets) {
    await fs.rm(target, { recursive: true, force: true }).catch(() => {
      /* 文件不存在等忽略 */
    });
  }
}
