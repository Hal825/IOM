import { Worker, type Job } from 'bullmq';
import path from 'node:path';
import { createRedisConnection } from '../lib/queue';
import { executeTask } from '../lib/orchestrator';
import { renderVideo } from '../lib/tools/renderer';
import { warmUp } from '../lib/tools/renderer';
import { QUEUE_NAME, type TaskData, type TaskResult } from '../lib/types';
import {
  findProcedureLog,
  saveProcedureLog,
  calculateTotalTokenUsage,
  cleanupOldLogs,
} from '../lib/log/procedure';

/**
 * BullMQ Worker 进程 — 独立于 Next.js 运行（npm run worker）。
 * 消费 video-generation 队列，支持两种模式：
 *   1. LangGraph 模式：job.data 含 script + audioPath → 直接渲染
 *   2. 旧模式（兼容）：job.data 仅有 text → 走完整 executeTask（脚本→TTS→渲染）
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
      const jobId = String(job.id);

      // ── LangGraph 模式：脚本和音频已就绪，直接渲染 ──
      if (job.data.script && job.data.audioPath) {
        console.log(`[worker] LangGraph 模式: 任务 ${jobId} 直接渲染`);
        await job.updateProgress(50);
        await job.log(`阶段 3/3: 渲染视频（脚本 ${job.data.script.length} 个场景）`);

        // 加载 agent 阶段保存的日志
        const log = await findProcedureLog(jobId);
        const renderStart = Date.now();

        if (log) {
          log.stages.render.input = {
            script: job.data.script,
            audioPath: job.data.audioPath,
            visuals: job.data.visuals ?? [],
            outputDir: path.join(STORAGE_DIR, 'output'),
            jobId,
          };
        }

        try {
          const videoPath = await renderVideo({
            script: job.data.script,
            audioPath: job.data.audioPath,
            outputDir: path.join(STORAGE_DIR, 'output'),
            jobId,
            visuals: job.data.visuals,
            onProgress: (p) => {
              void job.updateProgress(50 + Math.round(p * 45));
            },
          });

          if (log) {
            log.stages.render.output = {
              videoPath,
              durationSec: job.data.script.length
                ? Math.max(...job.data.script.map((s) => s.endFrame)) / 30
                : 0,
            };
            log.finalStatus = 'success';
          }

          await job.updateProgress(100);
          return {
            videoPath: path.relative(STORAGE_DIR, videoPath).replaceAll('\\', '/'),
            audioPath: path.relative(STORAGE_DIR, job.data.audioPath).replaceAll('\\', '/'),
            script: job.data.script,
          };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          if (log) {
            log.stages.render.error = message;
            log.finalStatus = 'failed';
            log.globalError = message;
          }
          throw err;
        } finally {
          if (log) {
            log.stages.render.durationMs = Date.now() - renderStart;
            log.totalDurationMs =
              Date.now() - new Date(log.timestamp).getTime();
            log.totalTokenUsage = calculateTotalTokenUsage(log);
            await saveProcedureLog(log, jobId);
          }
        }
      }

      // ── 旧模式（兼容）：走完整流水线 ──
      console.log(`[worker] 旧模式: 开始处理任务 ${jobId}: "${job.data.text.slice(0, 30)}..."`);
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

  // 清理过期日志（异步，不阻塞启动）
  cleanupOldLogs(7).catch(() => {});

  // 预热 Remotion bundle（首次运行还会自动下载 Chrome Headless Shell，约 200MB）
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
