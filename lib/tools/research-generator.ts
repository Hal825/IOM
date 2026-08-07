import { buildPipelineConversation } from '@/lib/prompts/pipeline';
import type { ResearchReport } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';
import { extractJsonObject } from './http';
import { callChatCompletion, withRetry } from './llm';

/**
 * Research 工具 — 调用 LLM 进行文本内容分析与结构识别。
 *
 * 策略：
 * 1. 用 buildPipelineConversation 构造追加式对话（[0..2]：system + 用户原文 + TASK_RESEARCH），
 *    前缀与后续 proposal/script 调用一致 → KV Cache 命中。
 * 2. 要求返回 ResearchReport JSON，轻量结构校验 → 不合法则重试（最多 3 次，指数退避）。
 */

// ── 配置（三文本节点共用 LLM_TEXT_*，前缀一致的前提）──

const LLM_TEXT_API_KEY = process.env.LLM_TEXT_API_KEY;
const LLM_TEXT_BASE_URL = process.env.LLM_TEXT_BASE_URL;
const LLM_TEXT_MODEL = process.env.LLM_TEXT_MODEL;

const MAX_TOKENS = 8000;

// ── 类型 ────────────────────────────────────────────

export interface ResearchResult {
  report: ResearchReport;
  model: string;
  retries: number;
  tokenUsage?: TokenUsage;
}

// ── JSON 解析 + 结构校验 ───────────────────────────

function isValidDemandCategory(v: unknown): v is ResearchReport['user_demand']['demands'][number]['category'] {
  return typeof v === 'string' &&
    ['duration', 'style', 'content', 'format', 'visual', 'audio', 'other'].includes(v);
}

function isValidLevel(v: unknown): v is ResearchReport['content_readiness_assessment']['level'] {
  return typeof v === 'string' &&
    ['ready', 'good', 'moderate', 'insufficient'].includes(v);
}

function isValidRecommendation(v: unknown): v is ResearchReport['content_readiness_assessment']['recommendation'] {
  return typeof v === 'string' &&
    ['ready', 'needs_polish', 'needs_enrichment', 'needs_restructure'].includes(v);
}

function parseAndValidateResearch(raw: string): ResearchReport {
  const jsonStr = extractJsonObject(raw); // 找不到对象时直接抛错

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error('[research] JSON 解析失败');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('[research] 输出不是有效对象');
  }

  const obj = parsed as Record<string, unknown>;

  // ── user_text 校验 ──
  const user_text = obj.user_text;
  if (typeof user_text !== 'string' || !user_text.trim()) {
    throw new Error('[research] user_text 缺失或无效');
  }

  // ── user_demand 校验 ──
  const user_demand = obj.user_demand as Record<string, unknown> | undefined;
  if (!user_demand || typeof user_demand !== 'object') {
    throw new Error('[research] user_demand 缺失');
  }
  if (typeof user_demand.hasExplicitDemand !== 'boolean') {
    throw new Error('[research] user_demand.hasExplicitDemand 缺失或非布尔');
  }

  const demandsRaw = Array.isArray(user_demand.demands) ? user_demand.demands : [];
  const demands = demandsRaw
    .map((d) => {
      const dd = d as Record<string, unknown>;
      if (!isValidDemandCategory(dd.category)) return null;
      if (typeof dd.description !== 'string') return null;
      return {
        category: dd.category as ResearchReport['user_demand']['demands'][number]['category'],
        description: dd.description as string,
        originalPhrase: (dd.originalPhrase as string) ?? '',
      };
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  const summary = typeof user_demand.summary === 'string'
    ? user_demand.summary
    : user_demand.hasExplicitDemand
      ? '用户提出了明确要求'
      : '用户未提出明确要求';

  // ── content_readiness_assessment 校验 ──
  const cra = obj.content_readiness_assessment as Record<string, unknown> | undefined;
  if (!cra || typeof cra !== 'object') {
    throw new Error('[research] content_readiness_assessment 缺失');
  }
  if (typeof cra.overallScore !== 'number') {
    throw new Error('[research] content_readiness_assessment.overallScore 缺失或非数字');
  }
  if (!isValidLevel(cra.level)) {
    throw new Error(`[research] content_readiness_assessment.level 无效: ${cra.level}`);
  }

  const dimensions: Record<string, { score: number; comment: string }> = {};
  if (cra.dimensions && typeof cra.dimensions === 'object') {
    for (const [key, val] of Object.entries(cra.dimensions as Record<string, unknown>)) {
      const dv = val as Record<string, unknown> | undefined;
      if (dv && typeof dv.score === 'number') {
        dimensions[key] = {
          score: Math.max(0, Math.min(100, dv.score)),
          comment: typeof dv.comment === 'string' ? dv.comment : '',
        };
      }
    }
  }
  if (Object.keys(dimensions).length === 0) {
    throw new Error('[research] content_readiness_assessment.dimensions 缺失或为空');
  }

  const strengths = Array.isArray(cra.strengths)
    ? cra.strengths.filter((s): s is string => typeof s === 'string')
    : [];
  const weaknesses = Array.isArray(cra.weaknesses)
    ? cra.weaknesses.filter((w): w is string => typeof w === 'string')
    : [];
  const recommendation = isValidRecommendation(cra.recommendation)
    ? (cra.recommendation as ResearchReport['content_readiness_assessment']['recommendation'])
    : 'needs_enrichment';

  return {
    user_text: user_text as string,
    user_demand: {
      hasExplicitDemand: user_demand.hasExplicitDemand as boolean,
      demands,
      summary,
    },
    content_readiness_assessment: {
      overallScore: Math.max(0, Math.min(100, cra.overallScore as number)),
      level: cra.level as ResearchReport['content_readiness_assessment']['level'],
      dimensions,
      strengths,
      weaknesses,
      recommendation,
    },
  };
}

// ── 公开 API ────────────────────────────────────────

/**
 * 分析用户文本，返回结构化的 ResearchReport。
 * 零容错：API Key 未配置或调用失败直接抛异常。
 */
export async function analyzeContent(userPrompt: string): Promise<ResearchResult> {
  if (!LLM_TEXT_API_KEY || !LLM_TEXT_BASE_URL || !LLM_TEXT_MODEL) {
    throw new Error('文本 LLM 环境变量未配置（LLM_TEXT_API_KEY / LLM_TEXT_BASE_URL / LLM_TEXT_MODEL）');
  }

  const messages = buildPipelineConversation({ userPrompt });

  const { result, retries } = await withRetry(
    async () => {
      const { content, usage } = await callChatCompletion({
        apiKey: LLM_TEXT_API_KEY,
        baseUrl: LLM_TEXT_BASE_URL,
        model: LLM_TEXT_MODEL,
        messages,
        maxTokens: MAX_TOKENS,
        temperature: 0.5,
        label: 'research',
      });
      const report = parseAndValidateResearch(content);
      return { ...report, usage };
    },
    { label: 'research' }
  );

  console.log(
    `[research] ${LLM_TEXT_MODEL} 分析完成：` +
      `需求提取: ${result.user_demand.hasExplicitDemand ? '是' : '否'}` +
      ` (${result.user_demand.demands.length} 条), ` +
      `就绪度: ${result.content_readiness_assessment.overallScore}` +
      ` (${result.content_readiness_assessment.level})` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    report: {
      user_text: result.user_text,
      user_demand: result.user_demand,
      content_readiness_assessment: result.content_readiness_assessment,
    },
    model: LLM_TEXT_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
