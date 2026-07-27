/**
 * 视频生成全流程日志记录与可观测性模块。
 *
 * 每个任务生成独立目录：log/procedure/job-<jobId>/procedure.json
 * 覆盖从用户请求到最终视频输出的所有关键节点。
 * 同一任务多次保存会覆盖同一文件，确保日志始终完整。
 */

import fs from 'node:fs/promises';
import path from 'node:path';

// ── 日志目录 ────────────────────────────────────────

export const PROCEDURE_LOG_DIR = path.resolve(process.cwd(), 'log', 'procedure');

// ── 类型定义 ────────────────────────────────────────

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ProcedureLog {
  jobId: string;
  timestamp: string; // ISO 8601
  totalDurationMs: number;
  totalTokenUsage?: TokenUsage;

  stages: {
    research: {
      input: { userPrompt: string };
      output: {
        report: unknown;
        model?: string;
        retries?: number;
        tokenUsage?: TokenUsage;
      };
      durationMs: number;
      error?: string;
    };

    proposal: {
      input: { researchReport?: unknown; userPrompt?: string };
      output: {
        proposal: unknown;
        model?: string;
        retries?: number;
        tokenUsage?: TokenUsage;
      };
      durationMs: number;
      error?: string;
    };

    asset_gen: {
      input: {
        proposal: {
          characterCount: number;
          sceneCount: number;
        };
      };
      output: {
        manifest: unknown;
        characterCount: number;
        sceneCount: number;
      };
      durationMs: number;
      error?: string;
    };

    tts: {
      input: {
        sceneCount: number;
        voice: string;
      };
      output: {
        audioPath: string;
        durationSec: number;
        model?: string;
      };
      durationMs: number;
      error?: string;
    };

    video_gen: {
      input: {
        proposal: unknown;
        assetManifest: {
          characterCount: number;
          sceneCount: number;
        };
      };
      output: {
        videoPath: string;
        durationSec: number;
        model?: string;
      };
      durationMs: number;
      error?: string;
    };

    queue: {
      input: { jobData: unknown };
      output: { jobId: string };
      durationMs: number;
      error?: string;
    };
  };

  finalStatus: 'success' | 'failed';
  globalError?: string;
}

// ── 工厂函数 ────────────────────────────────────────

/** 创建空的日志对象 */
export function createProcedureLog(jobId: string): ProcedureLog {
  return {
    jobId,
    timestamp: new Date().toISOString(),
    totalDurationMs: 0,
    stages: {
      research: {
        input: { userPrompt: '' },
        output: { report: {} },
        durationMs: 0,
      },
      proposal: {
        input: {},
        output: { proposal: {} },
        durationMs: 0,
      },
      asset_gen: {
        input: { proposal: { characterCount: 0, sceneCount: 0 } },
        output: { manifest: {}, characterCount: 0, sceneCount: 0 },
        durationMs: 0,
      },
      tts: {
        input: { sceneCount: 0, voice: '' },
        output: { audioPath: '', durationSec: 0 },
        durationMs: 0,
      },
      video_gen: {
        input: { proposal: {}, assetManifest: { characterCount: 0, sceneCount: 0 } },
        output: { videoPath: '', durationSec: 0 },
        durationMs: 0,
      },
      queue: {
        input: { jobData: {} },
        output: { jobId: '' },
        durationMs: 0,
      },
    },
    finalStatus: 'success',
  };
}

// ── 持久化 ──────────────────────────────────────────

/** 递归截断超长字符串，控制日志文件大小 */
function truncateLongFields(obj: unknown, maxLen: number): unknown {
  if (typeof obj === 'string' && obj.length > maxLen) {
    return obj.slice(0, maxLen) + '...(truncated)';
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => truncateLongFields(item, maxLen));
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = truncateLongFields(value, maxLen);
    }
    return result;
  }
  return obj;
}

/** 保存日志到文件，返回文件路径 */
export async function saveProcedureLog(
  log: ProcedureLog,
  jobId: string
): Promise<string> {
  const dir = path.join(PROCEDURE_LOG_DIR, `job-${jobId}`);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, 'procedure.json');

  const safeLog = truncateLongFields(log, 2000);
  await fs.writeFile(filePath, JSON.stringify(safeLog, null, 2), 'utf-8');
  return filePath;
}

// ── 查询 ────────────────────────────────────────────

/** 根据 jobId 查找日志（直接定位目录，无需扫描） */
export async function findProcedureLog(
  jobId: string
): Promise<ProcedureLog | null> {
  try {
    const dir = path.join(PROCEDURE_LOG_DIR, `job-${jobId}`);
    const filePath = path.join(dir, 'procedure.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as ProcedureLog;
  } catch {
    return null;
  }
}

// ── 汇总 ────────────────────────────────────────────

/** 汇总多个 TokenUsage */
export function sumTokenUsage(
  usages: (TokenUsage | undefined)[]
): TokenUsage | undefined {
  const valid = usages.filter((u): u is TokenUsage => u !== undefined);
  if (valid.length === 0) return undefined;
  return {
    prompt_tokens: valid.reduce((s, u) => s + u.prompt_tokens, 0),
    completion_tokens: valid.reduce((s, u) => s + u.completion_tokens, 0),
    total_tokens: valid.reduce((s, u) => s + u.total_tokens, 0),
  };
}

/** 汇总日志中所有阶段的 token 消耗 */
export function calculateTotalTokenUsage(
  log: ProcedureLog
): TokenUsage | undefined {
  return sumTokenUsage([
    log.stages.research.output.tokenUsage,
    log.stages.proposal.output.tokenUsage,
  ]);
}

// ── 清理 ────────────────────────────────────────────

/** 清理 7 天前的日志目录（在应用启动时调用） */
export async function cleanupOldLogs(retentionDays = 7): Promise<number> {
  try {
    const entries = await fs.readdir(PROCEDURE_LOG_DIR, { withFileTypes: true });
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    let removed = 0;

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dirPath = path.join(PROCEDURE_LOG_DIR, entry.name);
      try {
        const stat = await fs.stat(dirPath);
        if (stat.mtimeMs < cutoff) {
          await fs.rm(dirPath, { recursive: true, force: true });
          removed++;
        }
      } catch {
        // 单个目录操作失败不阻断
      }
    }

    if (removed > 0) {
      console.log(`[log] 清理了 ${removed} 个过期日志目录（保留 ${retentionDays} 天）`);
    }
    return removed;
  } catch {
    return 0;
  }
}
