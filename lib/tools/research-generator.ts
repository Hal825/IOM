import { RESEARCH_SYSTEM } from '@/lib/prompts/research';
import type { ResearchReport } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

/**
 * Research 工具 — 调用 LLM 进行文本内容分析与结构识别。
 *
 * 策略：
 * 1. 调用 AI API，要求返回 ResearchReport JSON
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 * 3. 全部失败时回退到规则分析（fallbackResearch）
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

function isValidFlow(v: unknown): v is ResearchReport['contentSkeleton']['flow'] {
  return typeof v === 'string' &&
    ['chronological', 'cause-effect', 'problem-solution', 'narrative'].includes(v);
}

function isValidTone(v: unknown): v is ResearchReport['styleProfile']['tone'] {
  return typeof v === 'string' &&
    ['professional', 'lively', 'serious', 'inspirational', 'minimal'].includes(v);
}

function isValidPace(v: unknown): v is ResearchReport['styleProfile']['pace'] {
  return typeof v === 'string' && ['slow', 'medium', 'fast'].includes(v);
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

  // ── metadata 校验 ──
  const metadata = obj.metadata as Record<string, unknown> | undefined;
  if (!metadata || typeof metadata.topic !== 'string' || !metadata.topic.trim()) {
    throw new Error('[research] metadata.topic 缺失或无效');
  }
  if (typeof metadata.wordCount !== 'number') {
    throw new Error('[research] metadata.wordCount 缺失或非数字');
  }
  if (typeof metadata.language !== 'string' || !metadata.language.trim()) {
    throw new Error('[research] metadata.language 缺失或无效');
  }
  // 新增字段（兼容旧格式）
  const contentType = typeof metadata.contentType === 'string' && metadata.contentType.trim()
    ? metadata.contentType
    : '未分类';
  const sceneTime = Array.isArray(metadata.sceneTime)
    ? metadata.sceneTime.filter((t): t is string => typeof t === 'string')
    : [];
  const sceneLocation = Array.isArray(metadata.sceneLocation)
    ? metadata.sceneLocation.filter((l): l is string => typeof l === 'string')
    : [];
  const userDemand = typeof metadata.userDemand === 'string' && metadata.userDemand.trim()
    ? metadata.userDemand
    : null;

  // ── contentSkeleton 校验 ──
  const contentSkeleton = obj.contentSkeleton as Record<string, unknown> | undefined;
  if (!contentSkeleton) {
    throw new Error('[research] contentSkeleton 缺失');
  }

  const segments = contentSkeleton.segments as unknown[];
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new Error('[research] contentSkeleton.segments 缺失或为空');
  }

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i] as Record<string, unknown> | undefined;
    if (!seg) throw new Error(`[research] segments[${i}] 无效`);
    if (typeof seg.id !== 'string' || !seg.id.trim()) {
      throw new Error(`[research] segments[${i}].id 缺失`);
    }
    if (typeof seg.title !== 'string' || !seg.title.trim()) {
      throw new Error(`[research] segments[${i}].title 缺失`);
    }
    if (typeof seg.originalText !== 'string' || !seg.originalText.trim()) {
      throw new Error(`[research] segments[${i}].originalText 缺失`);
    }
    if (typeof seg.summary !== 'string' || !seg.summary.trim()) {
      throw new Error(`[research] segments[${i}].summary 缺失`);
    }
    if (!Array.isArray(seg.keywords)) {
      throw new Error(`[research] segments[${i}].keywords 缺失或非数组`);
    }
  }

  if (!isValidFlow(contentSkeleton.flow)) {
    throw new Error(`[research] contentSkeleton.flow 无效: ${contentSkeleton.flow}`);
  }

  // ── styleProfile 校验 ──
  const styleProfile = obj.styleProfile as Record<string, unknown> | undefined;
  if (!styleProfile) {
    throw new Error('[research] styleProfile 缺失');
  }
  if (!isValidTone(styleProfile.tone)) {
    throw new Error(`[research] styleProfile.tone 无效: ${styleProfile.tone}`);
  }
  if (!isValidPace(styleProfile.pace)) {
    throw new Error(`[research] styleProfile.pace 无效: ${styleProfile.pace}`);
  }
  if (typeof styleProfile.visualStyle !== 'string' || !styleProfile.visualStyle.trim()) {
    throw new Error('[research] styleProfile.visualStyle 缺失');
  }
  if (typeof styleProfile.suggestedBGM !== 'string' || !styleProfile.suggestedBGM.trim()) {
    throw new Error('[research] styleProfile.suggestedBGM 缺失');
  }

  // ── characterAnalysis 校验（新增字段，兼容旧格式）──
  const characterAnalysis = obj.characterAnalysis as Record<string, unknown> | undefined;
  let hasCharacter = false;
  let characterHints: string[] = [];

  if (characterAnalysis) {
    hasCharacter = typeof characterAnalysis.hasCharacter === 'boolean'
      ? characterAnalysis.hasCharacter
      : false;
    characterHints = Array.isArray(characterAnalysis.characterHints)
      ? characterAnalysis.characterHints.filter((h): h is string => typeof h === 'string')
      : [];
  }

  // ── readiness 校验（新增字段，兼容旧格式）──
  const readiness = obj.readiness as Record<string, unknown> | undefined;
  let overallScore = 50;
  let dimensions = { information: 50, logic: 50, visual: 50, emotion: 50, completeness: 50 };
  let shortcomings: string[] = [];
  let expansionHints: string[] = [];
  let canProceedDirectly = false;

  if (readiness) {
    overallScore = typeof readiness.overallScore === 'number'
      ? Math.max(0, Math.min(100, readiness.overallScore))
      : 50;
    if (readiness.dimensions && typeof readiness.dimensions === 'object') {
      const dims = readiness.dimensions as Record<string, unknown>;
      dimensions = {
        information: typeof dims.information === 'number' ? Math.max(0, Math.min(100, dims.information)) : 50,
        logic: typeof dims.logic === 'number' ? Math.max(0, Math.min(100, dims.logic)) : 50,
        visual: typeof dims.visual === 'number' ? Math.max(0, Math.min(100, dims.visual)) : 50,
        emotion: typeof dims.emotion === 'number' ? Math.max(0, Math.min(100, dims.emotion)) : 50,
        completeness: typeof dims.completeness === 'number' ? Math.max(0, Math.min(100, dims.completeness)) : 50,
      };
    }
    shortcomings = Array.isArray(readiness.shortcomings)
      ? readiness.shortcomings.filter((s): s is string => typeof s === 'string')
      : [];
    expansionHints = Array.isArray(readiness.expansionHints)
      ? readiness.expansionHints.filter((h): h is string => typeof h === 'string')
      : [];
    canProceedDirectly = typeof readiness.canProceedDirectly === 'boolean'
      ? readiness.canProceedDirectly
      : overallScore >= 70;
  }

  return {
    metadata: {
      topic: metadata.topic as string,
      wordCount: metadata.wordCount as number,
      language: metadata.language as string,
      contentType,
      sceneTime,
      sceneLocation,
      userDemand,
    },
    contentSkeleton: {
      segments: segments as ResearchReport['contentSkeleton']['segments'],
      flow: contentSkeleton.flow as ResearchReport['contentSkeleton']['flow'],
    },
    styleProfile: {
      tone: styleProfile.tone as ResearchReport['styleProfile']['tone'],
      pace: styleProfile.pace as ResearchReport['styleProfile']['pace'],
      visualStyle: styleProfile.visualStyle as string,
      suggestedBGM: styleProfile.suggestedBGM as string,
    },
    characterAnalysis: { hasCharacter, characterHints },
    readiness: { overallScore, dimensions, shortcomings, expansionHints, canProceedDirectly },
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
      `${result.contentSkeleton.segments.length} 个段落, ` +
      `角色需求: ${result.characterAnalysis.hasCharacter ? '是' : '否'}` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    report: {
      metadata: result.metadata,
      contentSkeleton: result.contentSkeleton,
      styleProfile: result.styleProfile,
      characterAnalysis: result.characterAnalysis,
      readiness: result.readiness,
    },
    model: RESEARCH_LLM_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
