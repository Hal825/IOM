/**
 * 节点审计日志模块。
 *
 * 每个节点的耗时、token 消耗、费用、输入/输出都会写入
 * log/procedure/job-<jobId>/procedure.json。
 */

import fs from 'node:fs';
import path from 'node:path';

// ── 类型 ────────────────────────────────────────────

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  /** DeepSeek 返回的缓存命中/未命中明细 */
  prompt_tokens_details?: { cached_tokens: number };
  completion_tokens_details?: { reasoning_tokens: number };
  prompt_cache_hit_tokens?: number;
  prompt_cache_miss_tokens?: number;
}

export interface StageCost {
  /** 输入费用 (USD) */
  inputCost: number;
  /** 输出费用 (USD) */
  outputCost: number;
  /** 总费用 (USD) */
  totalCost: number;
}

export interface StageLogEntry {
  startedAt: string;
  durationSec: number;
  model: string;
  retries: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  tokenUsage: TokenUsage;
  cost: StageCost;
}

interface ProcedureFile {
  jobId: string;
  startedAt: string;
  stages: Record<string, StageLogEntry>;
}

// ── 定价表 (USD / 1M tokens) ────────────────────────
// https://api-docs.deepseek.com/quick_start/pricing/

const PRICING: Record<string, { inputCacheMiss: number; inputCacheHit: number; output: number }> = {
  'deepseek-v4-flash': { inputCacheMiss: 0.14,  inputCacheHit: 0.0028,   output: 0.28  },
  'deepseek-v4-pro':   { inputCacheMiss: 0.435, inputCacheHit: 0.003625, output: 0.87  },
};

/** 默认价格（未知模型时使用） */
const DEFAULT_PRICING = { inputCacheMiss: 0.14, inputCacheHit: 0.0028, output: 0.28 };

// ── 日志目录 ────────────────────────────────────────

const LOG_DIR = path.resolve(process.cwd(), 'log', 'procedure');

// ── 工具函数 ────────────────────────────────────────

/** 计算单次调用的费用 (USD) */
export function calculateCost(model: string, usage: TokenUsage): StageCost {
  const price = PRICING[model] ?? DEFAULT_PRICING;

  const cacheMiss = usage.prompt_cache_miss_tokens ?? 0;
  const cacheHit = usage.prompt_cache_hit_tokens ?? 0;

  // 如果 API 没返回缓存明细，回退：prompt_tokens 全部按 cache miss 计
  const inputCost =
    cacheMiss + cacheHit > 0
      ? (cacheMiss * price.inputCacheMiss + cacheHit * price.inputCacheHit) / 1_000_000
      : (usage.prompt_tokens * price.inputCacheMiss) / 1_000_000;

  const outputCost = (usage.completion_tokens * price.output) / 1_000_000;

  return {
    inputCost: Math.round(inputCost * 1e8) / 1e8,
    outputCost: Math.round(outputCost * 1e8) / 1e8,
    totalCost: Math.round((inputCost + outputCost) * 1e8) / 1e8,
  };
}

/** 保留一位小数 */
export function formatDurationSec(ms: number): number {
  return Math.round(ms / 100) / 10;
}

/** 写入单个阶段的日志到 procedure.json（首次创建，后续追加） */
export function saveStageLog(
  jobId: string,
  stageName: string,
  entry: StageLogEntry,
): string {
  const dir = path.join(LOG_DIR, `job-${jobId}`);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'procedure.json');

  let doc: ProcedureFile;

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    doc = JSON.parse(raw) as ProcedureFile;
  } else {
    doc = {
      jobId,
      startedAt: new Date().toISOString(),
      stages: {},
    };
  }

  doc.stages[stageName] = entry;

  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), 'utf-8');
  return filePath;
}
