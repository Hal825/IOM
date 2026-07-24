import { RESEARCH_SYSTEM } from '@/lib/prompts/research';
import type { ResearchReport } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

/**
 * Research 工具 — 调用 LLM 进行文本内容分析与结构识别。
 *
 * 策略（与 ai-script-generator.ts 一致）：
 * 1. 调用 AI API，要求返回 ResearchReport JSON
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 * 3. 全部失败时回退到规则分析（fallbackResearch）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const RESEARCH_API_KEY = process.env.RESEARCH_API_KEY;
const RESEARCH_BASE_URL = process.env.RESEARCH_BASE_URL;
const RESEARCH_LLM_MODEL = process.env.RESEARCH_LLM_MODEL;

const MAX_RETRIES = 3;
const MAX_TOKENS = 2000;

// ── 类型 ────────────────────────────────────────────

export interface ResearchResult {
  report: ResearchReport;// 研究报告
  model: string;// 使用的模型名称（或回退标记）
  retries: number;// 重试次数（0 表示首次成功）
  tokenUsage?: TokenUsage;// 可选：LLM 调用的 token 使用情况
}

interface ChatResponse {
  choices: Array<{// 选择的回答
    message: { content: string };// 消息内容
  }>;
  usage?: TokenUsage;
}

// ── JSON 解析 + 结构校验 ───────────────────────────

// v: unknown：参数 v 被声明为 unknown 类型，表示它可以接收任何值，但使用前必须进行类型检查（类型安全）
// v is ResearchReport['contentSkeleton']['flow']：这是 类型谓词（type predicate），
// 告诉 TypeScript 编译器：如果函数返回 true，则参数 v 的类型就是 ResearchReport['contentSkeleton']['flow']
function isValidFlow(v: unknown): v is ResearchReport['contentSkeleton']['flow'] {// 检查 flow 是否为有效值
  return typeof v === 'string' &&
    ['chronological', 'cause-effect', 'problem-solution', 'narrative'].includes(v);
}

function isValidTone(v: unknown): v is ResearchReport['styleProfile']['tone'] {// 检查 tone 是否为有效值
  return typeof v === 'string' &&
    ['professional', 'lively', 'serious', 'inspirational', 'minimal'].includes(v);
}

function isValidPace(v: unknown): v is ResearchReport['styleProfile']['pace'] {// 检查 pace 是否为有效值
  return typeof v === 'string' &&
    ['slow', 'medium', 'fast'].includes(v);
}

function parseAndValidateResearch(raw: string): ResearchReport {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);// 尝试从原始字符串中匹配 JSON 对象
  if (!jsonMatch) {
    throw new Error('[research] 响应中未找到 JSON 对象');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);// 尝试解析 JSON 字符串（获取第一个完整的结果）
  } catch {
    throw new Error('[research] JSON 解析失败');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('[research] 输出不是有效对象');
  }

  const obj = parsed as Record<string, unknown>;// 将解析结果转换为 Record<string, unknown> 类型

  // ── metadata 校验 ──
  const metadata = obj.metadata as Record<string, unknown> | undefined;// 尝试获取 metadata 对象
  if (!metadata || typeof metadata.topic !== 'string' || !metadata.topic.trim()) {// 检查 metadata.topic 是否为有效字符串
    throw new Error('[research] metadata.topic 缺失或无效');
  }
  if (typeof metadata.wordCount !== 'number') {// 检查 metadata.wordCount 是否为数字
    throw new Error('[research] metadata.wordCount 缺失或非数字');
  }
  if (typeof metadata.language !== 'string' || !metadata.language.trim()) {// 检查 metadata.language 是否为有效字符串
    throw new Error('[research] metadata.language 缺失或无效');
  }

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

  return parsed as ResearchReport;
}

// ── LLM API 调用 ────────────────────────────────────

async function callResearchLLM(
  userPrompt: string
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
        { role: 'system', content: RESEARCH_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.5,
    }),
    signal: AbortSignal.timeout(30000),
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

      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.warn(
        `[research] 第 ${attempt + 1} 次失败: ${lastError.message}，` +
          `${delay / 1000}s 后重试...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error('[research] 未知错误');
}

// ── 规则兜底 ────────────────────────────────────────

/**
 * 基于规则的文本分析。
 * 不调用任何 API，纯本地处理。
 */
function fallbackResearch(userPrompt: string): ResearchReport {
  // 按段落拆分（双换行）
  const paragraphs = userPrompt
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);

  // 如果段落太少，按句子拆分
  let rawSegments: string[];
  if (paragraphs.length <= 1) {
    rawSegments = userPrompt
      .split(/(?<=[。！？；.!?;])/)
      .filter((s) => s.trim().length > 0);
  } else {
    rawSegments = paragraphs;
  }

  // 限制最多 8 段
  if (rawSegments.length > 8) {
    // 合并相邻短段
    const merged: string[] = [];
    let acc = '';
    for (const seg of rawSegments) {
      if ((acc + seg).length < 120 && merged.length < 7) {
        acc += seg;
      } else {
        if (acc) merged.push(acc);
        acc = seg;
      }
    }
    if (acc) merged.push(acc);
    rawSegments = merged.slice(0, 8);
  }

  const segments = rawSegments.map((text, i) => {
    const trimmed = text.trim();
    // 提取关键词：取前 3 个较长的中文字符片段
    const chineseTokens = trimmed
      .replace(/[^一-鿿]+/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .slice(0, 3);

    return {
      id: `seg-${i + 1}`,
      title: trimmed.slice(0, 15).replace(/\n/g, ' '),
      originalText: trimmed,
      summary: trimmed.slice(0, 60).replace(/\n/g, ' '),
      keywords: chineseTokens.length > 0 ? chineseTokens : ['文本分析'],
    };
  });

  const wordCount = userPrompt.replace(/\s/g, '').length;

  return {
    metadata: {
      topic: segments[0]?.title ?? '未命名主题',
      wordCount,
      language: 'zh-CN',
    },
    contentSkeleton: {
      segments,
      flow: 'narrative',
    },
    styleProfile: {
      tone: 'professional',
      pace: 'medium',
      visualStyle: 'clean modern presentation with abstract elements',
      suggestedBGM: 'ambient instrumental',
    },
  };
}

// ── 公开 API ────────────────────────────────────────

/**
 * 分析用户文本，返回结构化的 ResearchReport。
 * - 已配置 API Key → 调用 LLM，失败回退规则分析
 * - 未配置 → 直接走规则分析
 */
export async function analyzeContent(
  userPrompt: string
): Promise<ResearchResult> {
  // 未配置 API Key → 静默回退
  if (!RESEARCH_API_KEY) {
    console.log('[research] 未配置 RESEARCH_API_KEY，使用规则分析');
    return {
      report: fallbackResearch(userPrompt),
      model: 'rule-based',
      retries: 0,
    };
  }

  try {
    const { result, retries } = await withRetry(async () => {
      const { content, usage } = await callResearchLLM(userPrompt);
      const report = parseAndValidateResearch(content);
      return { ...report, usage };
    });

    console.log(
      `[research] ${RESEARCH_LLM_MODEL} 分析完成：` +
        `${result.contentSkeleton.segments.length} 个段落` +
        (retries > 0 ? `（重试 ${retries} 次）` : '')
    );

    return {
      report: {
        metadata: result.metadata,
        contentSkeleton: result.contentSkeleton,
        styleProfile: result.styleProfile,
      },
      model: RESEARCH_LLM_MODEL!,
      retries,
      tokenUsage: result.usage,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[research] 失败，回退规则分析: ${message}`);

    return {
      report: fallbackResearch(userPrompt),
      model: `fallback(${RESEARCH_LLM_MODEL ?? 'unknown'})`,
      retries: MAX_RETRIES,
    };
  }
}
