import { Worker, type Job } from 'bullmq';
import path from 'node:path';
import { createRedisConnection } from '../lib/queue';
import { executeTask } from '../lib/orchestrator';
import { QUEUE_NAME, type TaskData, type TaskResult } from '../lib/types';
import { findProcedureLog, saveProcedureLog, calculateTotalTokenUsage, cleanupOldLogs } from '../lib/log/procedure';

/**
 * BullMQ Worker 进程 — 独立于 Next.js 运行（npm run worker）。
 *
 * 新流程（纯 AI 管线）：
 *   - API 层经 LangGraph（research→proposal→asset_gen→video_gen）完成所有 AI 调用
 *   - Worker 接收已完成的任务，执行后处理（如视频下载到本地 storage）
 *   - 兼容旧模式：job.data 仅有 text → 走完整 executeTask
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
      const jobId = String(job.id);

      // ── LangGraph 模式：视频 URL/路径已生成 ──
      if (job.data.videoUrl) {
        console.log(`[worker] LangGraph 模式: 任务 ${jobId} 视频已生成 → ${job.data.videoUrl}`);
        await job.updateProgress(95);

        const log = await findProcedureLog(jobId);
        if (log) {
          log.finalStatus = 'success';
          log.totalDurationMs = Date.now() - new Date(log.timestamp).getTime();
          log.totalTokenUsage = calculateTotalTokenUsage(log);
          await saveProcedureLog(log, jobId);
        }

        await job.updateProgress(100);
        return {
          videoPath: job.data.videoUrl,
          durationSec: job.data.durationSec ?? 0,
        };
      }

      // ── 旧模式（兼容）：走完整 executeTask ──
      console.log(`[worker] 旧模式: 开始处理任务 ${jobId}: "${job.data.text.slice(0, 30)}..."`);
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
  });
  worker.on('error', (err) => {
    console.error(`[worker] Worker 错误: ${err.message}`);
  });

  // 清理过期日志
  cleanupOldLogs(7).catch(() => {});

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
