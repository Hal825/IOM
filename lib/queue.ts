import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAME, type TaskData } from './types';

/**
 * BullMQ 队列模块 — Queue 单例 + Redis 连接工厂。
 * Next.js dev 模式会热重载模块，用 globalThis 缓存避免连接泄漏。
 */

const globalForQueue = globalThis as unknown as {
  __omRedis?: IORedis;
  __omQueue?: Queue<TaskData>;
};

/** 创建一个新的 ioredis 连接（Worker 进程独立调用） */
export function createRedisConnection(): IORedis {
  return new IORedis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    // BullMQ 要求
    maxRetriesPerRequest: null,
    // 连不上时快速失败并给出友好提示，而不是无限静默重试
    retryStrategy(times) {
      if (times > 3) {
        console.error(
          '[queue] 无法连接 Redis。请确认 Docker Desktop 已启动，并执行: npm run redis:up'
        );
        return null; // 停止重试
      }
      return Math.min(times * 500, 2000);
    },
  });
}

/** 获取共享 Redis 连接（API 进程内复用） */
export function getRedisConnection(): IORedis {
  if (!globalForQueue.__omRedis) {
    globalForQueue.__omRedis = createRedisConnection();
  }
  return globalForQueue.__omRedis;
}

/** 获取任务队列单例 */
export function getQueue(): Queue<TaskData> {
  if (!globalForQueue.__omQueue) {
    globalForQueue.__omQueue = new Queue<TaskData>(QUEUE_NAME, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        removeOnComplete: { count: 100 }, // 保留最近 100 条完成记录
        removeOnFail: { count: 100 },
        attempts: 1, // 视频渲染失败不自动重试（MVP）
      },
    });
  }
  return globalForQueue.__omQueue;
}
