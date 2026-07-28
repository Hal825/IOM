/**
 * 日志记录 — TokenUsage 类型 + 过期日志清理。
 *
 * 运行时日志通过 LangGraph state._procedureLog 通道记录，
 * 本模块保留类型定义和启动时清理逻辑。
 */

import fs from 'node:fs/promises';
import path from 'node:path';

// ── 类型 ────────────────────────────────────────────

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/** 日志目录 */
const PROCEDURE_LOG_DIR = path.resolve(process.cwd(), 'log', 'procedure');

// ── 清理 ────────────────────────────────────────────

/** 清理 N 天前的日志目录（Worker 启动时调用） */
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
