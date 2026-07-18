import { Worker, type Job } from 'bullmq';
import path from 'node:path';
import { createRedisConnection } from '../lib/queue';
import { executeTask } from '../lib/orchestrator';
import { warmUp } from '../lib/tools/renderer';
import { QUEUE_NAME, type TaskData, type TaskResult } from '../lib/types';

/**
 * BullMQ Worker 进程 — 独立于 Next.js 运行（npm run worker）。
 * 消费 video-generation 队列，执行 脚本→TTS→渲染 流水线。
 */

const STORAGE_DIR = path.resolve('./storage');

async function main() {
  console.log('[worker] OpenMontage Worker 启动中...');
  console.log(`[worker] 存储目录: ${STORAGE_DIR}`);

  const connection = createRedisConnection();
  connection.on('error', () => {
    /* 错误已在 retryStrategy 中提示，避免未捕获异常刷屏 */
  });

  const worker = new Worker<TaskData, TaskResult>(
    QUEUE_NAME,
    async (job: Job<TaskData>) => {
      console.log(`[worker] 开始处理任务 ${job.id}: "${job.data.text.slice(0, 30)}..."`);
      return executeTask(job, STORAGE_DIR);
    },
    {
      connection,
      concurrency: 1, // 渲染是 CPU 密集操作，串行处理
    }
  );

  worker.on('ready', () => {
    console.log('[worker] 已连接 Redis，等待任务...');
  });
  worker.on('completed', (job) => {
    console.log(`[worker] ✓ 任务 ${job.id} 完成 → ${job.returnvalue?.videoPath}`);
  });
  worker.on('failed', (job, err) => {
    console.error(`[worker] ✗ 任务 ${job?.id} 失败: ${err.message}`);
  });
  worker.on('error', (err) => {
    console.error(`[worker] Worker 错误: ${err.message}`);
  });

  // 预热 Remotion bundle（首次渲染还会自动下载 Chrome Headless Shell，约 200MB）
  console.log('[worker] 预热 Remotion bundle（首次运行需数分钟，会下载浏览器内核）...');
  warmUp().catch((err) => {
    console.error(`[worker] Remotion 预热失败（渲染时将重试）: ${err.message}`);
  });

  const shutdown = async () => {
    console.log('[worker] 正在关闭...');
    await worker.close();
    connection.disconnect();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[worker] 启动失败:', err);
  process.exit(1);
});
