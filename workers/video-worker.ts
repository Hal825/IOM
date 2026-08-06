import { Worker, type Job } from 'bullmq';
import path from 'node:path';
import { createRedisConnection } from '../lib/queue';
import { executeTask } from '../lib/orchestrator';
import { QUEUE_NAME, type TaskData, type TaskResult } from '../lib/types';

/**
 * BullMQ Worker 进程 — 独立于 Next.js 运行（npm run worker）。
 *
 * 消费队列中的任务，调用 executeTask() 执行完整 LangGraph 管线：
 *   research → proposal → script_gen → (asset_gen ‖ tts) → (shot_video_gen × N) → video_merge
 */

const STORAGE_DIR = path.resolve('./storage');

async function main() {
  console.log('[worker] OpenMontage Worker 启动中...');
  console.log(`[worker] 存储目录: ${STORAGE_DIR}`);

  const connection = createRedisConnection();
  connection.on('error', () => {
    /* 错误已在 retryStrategy 中提示 */
  });

  const worker = new Worker<TaskData, TaskResult>(
    QUEUE_NAME,
    async (job: Job<TaskData>) => {
      console.log(`[worker] 开始处理任务 ${String(job.id)}: "${job.data.text.slice(0, 40)}..."`);
      return executeTask(job, STORAGE_DIR);
    },
    {
      connection,
      concurrency: 1,
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
    // 展开 LangGraph 多节点并行错误（错误对象可能带 errors / cause.errors 聚合字段）
    type LangGraphError = { errors?: unknown[]; cause?: { errors?: unknown[] } };
    const detail = (err as LangGraphError).errors ?? (err as LangGraphError).cause?.errors;
    if (Array.isArray(detail)) {
      for (const e of detail) {
        const msg = (e as { message?: string })?.message ?? String(e);
        console.error(`  ↳ ${msg}`);
      }
    }
  });
  worker.on('error', (err) => {
    console.error(`[worker] Worker 错误: ${err.message}`);
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
