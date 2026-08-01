import { RESEARCH_SYSTEM } from '@/lib/prompts/research';
import type { ResearchReport } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

/**
 * Research 工具 — 调用 LLM 进行文本内容分析与结构识别。
 *
 * 策略：
 * 1. 调用 AI API，要求返回 ResearchReport JSON（新版结构：user_text / user_demand / content_readiness_assessment）
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const RESEARCH_API_KEY = process.env.RESEARCH_API_KEY;
const RESEARCH_BASE_URL = process.env.RESEARCH_BASE_URL;
const RESEARCH_LLM_MODEL = process.env.RESEARCH_LLM_MODEL;

const MAX_RETRIES = 3;
const MAX_TOKENS = 8000;

// ── 类型 ────────────────────────────────────────────

export interface ResearchResult {
  report: ResearchReport;
  model: string;
  retries: number;
  tokenUsage?: TokenUsage;
}

interface ChatResponse {
  choices: Array<{
    message: { content: string };
  }>;
  usage?: TokenUsage;
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
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('[research] 响应中未找到 JSON 对象');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
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

// ── LLM API 调用 ────────────────────────────────────

async function callResearchLLM(
  userPrompt: string,
  systemPrompt?: string,
): Promise<{ content: string; usage?: TokenUsage }> {
  if (!RESEARCH_API_KEY || !RESEARCH_BASE_URL || !RESEARCH_LLM_MODEL) {
    throw new Error(
      'Research 环境变量未配置（RESEARCH_API_KEY / RESEARCH_BASE_URL / RESEARCH_LLM_MODEL）'
    );
  }

  const resp = await fetch(`${RESEARCH_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEARCH_API_KEY}`,
    },
    body: JSON.stringify({
      model: RESEARCH_LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt ?? RESEARCH_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.5,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(
      `Research API 返回 ${resp.status}: ${errText.slice(0, 200)}`
    );
  }

  const data = (await resp.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('Research API 返回空内容');
  }

  return { content, usage: data.usage };
}

// ── 指数退避重试 ────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<{ result: T; retries: number }> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { result, retries: attempt };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === maxRetries) break;

      const delay = Math.pow(2, attempt) * 1000;
      console.warn(
        `[research] 第 ${attempt + 1} 次失败: ${lastError.message}，` +
          `${delay / 1000}s 后重试...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error('[research] 未知错误');
}

// ── 公开 API ────────────────────────────────────────

/**
 * 分析用户文本，返回结构化的 ResearchReport。
 * 零容错：API Key 未配置或调用失败直接抛异常。
 */
export async function analyzeContent(
  userPrompt: string,
  systemPrompt?: string,
): Promise<ResearchResult> {
  if (!RESEARCH_API_KEY || !RESEARCH_BASE_URL || !RESEARCH_LLM_MODEL) {
    throw new Error('Research 环境变量未配置（RESEARCH_API_KEY / RESEARCH_BASE_URL / RESEARCH_LLM_MODEL）');
  }

  const { result, retries } = await withRetry(async () => {
    const { content, usage } = await callResearchLLM(userPrompt, systemPrompt);
    const report = parseAndValidateResearch(content);
    return { ...report, usage };
  });

  console.log(
    `[research] ${RESEARCH_LLM_MODEL} 分析完成：` +
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
    model: RESEARCH_LLM_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
