import { getQueue, getRedisConnection } from './queue';

/**
 * 逐任务暂停 / 删除标志 —— 基于 Redis，供 API 写入、Worker 暂停点轮询。
 *
 * 暂停语义：暂停 = 置 `om:paused:<jobId>` 标志；管线在暂停点（pausePoint）阻塞轮询，
 * 直到恢复（清标志）或删除（抛错中止）。删除 = 置 `om:deleted:<jobId>` + 移除 job。
 */

const pausedKey = (jobId: string) => `om:paused:${jobId}`;
const deletedKey = (jobId: string) => `om:deleted:${jobId}`;

/** 任务是否被暂停 */
export async function isJobPaused(jobId: string): Promise<boolean> {
  const redis = getRedisConnection();
  return (await redis.exists(pausedKey(jobId))) === 1;
}

/** 设置 / 清除暂停标志 */
export async function setJobPaused(jobId: string, paused: boolean): Promise<void> {
  const redis = getRedisConnection();
  if (paused) {
    await redis.set(pausedKey(jobId), '1');
  } else {
    await redis.del(pausedKey(jobId));
  }
}

/** 标记任务已删除（供暂停中的管线检测后中止；1 小时自动过期） */
export async function markJobDeleted(jobId: string): Promise<void> {
  const redis = getRedisConnection();
  await redis.set(deletedKey(jobId), '1', 'EX', 3600);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 暂停点：任务被暂停时阻塞轮询（每秒）。
 * 恢复（清暂停标志）→ 继续；检测到删除标志或队列中任务已不存在 → 抛错中止管线（零容错）。
 * Worker 并发为 1，暂停期间占住 worker，其他排队任务随之等待 —— 个人工具可接受。
 */
export async function pausePoint(jobId: string): Promise<void> {
  const redis = getRedisConnection();
  const queue = getQueue();
  while (await isJobPaused(jobId)) {
    const deleted = (await redis.exists(deletedKey(jobId))) === 1;
    const jobGone = (await queue.getJob(jobId)) === null;
    if (deleted || jobGone) {
      throw new Error('任务已删除，管线中止');
    }
    await sleep(1000);
  }
}
