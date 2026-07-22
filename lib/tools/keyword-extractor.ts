/**
 * 语义关键词提取器 — 调用 AI 模型将中文场景文本转换为英文搜索关键词。
 *
 * 策略：
 * 1. 已配置 AI_KEYWORD_* 环境变量 → 调用 API，失败回退规则提取
 * 2. 未配置 → 直接走规则提取
 *
 * 支持任意兼容 OpenAI 接口的模型服务（DeepSeek / 火山引擎 Ark / GLM 等）。
 * 通过 AI_KEYWORD_MODEL 指定模型，AI_KEYWORD_API_KEY / AI_KEYWORD_BASE_URL 配置连接。
 */

import type { TokenUsage } from '@/lib/log/procedure';

// ── 配置（全部来自环境变量）─────────────────────────

const AI_KEYWORD_API_KEY = process.env.AI_KEYWORD_API_KEY;
const AI_KEYWORD_BASE_URL = process.env.AI_KEYWORD_BASE_URL;
const AI_KEYWORD_MODEL = process.env.AI_KEYWORD_MODEL;

// ── Prompt ──────────────────────────────────────────

const SYSTEM_PROMPT =
  '你是搜索关键词专家。从用户文本中提取1-3个英文关键词（名词或形容词+名词），用于图片搜索。只输出关键词，空格分隔，不要其他内容。';

/** 批量提取用系统提示词：要求返回 JSON 数组 */
const BATCH_SYSTEM_PROMPT = `你是搜索关键词专家。用户将提供多个场景文本（按数字编号）。
请为每个场景提取 1-3 个英文关键词（名词或形容词+名词），用于图片搜索。

**必须严格按顺序返回一个 JSON 数组**，格式如下：
["场景1关键词", "场景2关键词", "场景3关键词", ...]

只输出 JSON 数组，不要包含其他任何内容。`;

// ── 类型 ────────────────────────────────────────────

interface VolcChatResponse {
  choices: Array<{
    message: { content: string };
  }>;
  usage?: TokenUsage;
}

export interface KeywordResult {
  keyword: string;
  method: 'llm' | 'rule';
  tokenUsage?: TokenUsage;
}

// ── 规则提取（回退方案）────────────────────────────

/**
 * 从中文文本中提取搜索关键词（纯规则，不依赖 LLM）。
 * - 移除标点符号
 * - 保留有意义的中文字词
 * - 最多返回前 30 个字符
 */
function extractKeywordByRule(text: string): string {
  const cleaned = text.replace(
    /[，。！？；、""''《》（）【】…—\s,.!?;:'"()\[\]{}<>@#$%^&*+=~`|\\/\-]/g,
    ''
  );
  return cleaned.slice(0, 30) || text.slice(0, 30);
}

// ── 火山引擎 API 调用 ──────────────────────────────

/**
 * 调用火山引擎模型提取英文关键词。
 * 返回 1-3 个英文关键词数组，失败时返回空数组（触发上游回退）。
 */
async function callVolcEngine(
  text: string
): Promise<{ keywords: string[]; usage?: TokenUsage }> {
  if (!AI_KEYWORD_API_KEY || !AI_KEYWORD_BASE_URL || !AI_KEYWORD_MODEL) {
    return { keywords: [] };
  }

  try {
    const resp = await fetch(`${AI_KEYWORD_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_KEYWORD_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_KEYWORD_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        max_tokens: 20,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(
        `[keyword] 火山引擎返回 ${resp.status}: ${errText.slice(0, 200)}`
      );
      return { keywords: [] };
    }

    const data = (await resp.json()) as VolcChatResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn('[keyword] 火山引擎返回空内容');
      return { keywords: [] };
    }

    // 清洗：只保留字母、空格、连字符（英文关键词）
    const cleaned = content.replace(/[^a-zA-Z\s-]/g, '');
    const keywords = cleaned.split(/\s+/).filter((k) => k.length > 0);
    return { keywords: keywords.slice(0, 3), usage: data.usage };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[keyword] 火山引擎调用异常: ${message}`);
    return { keywords: [] };
  }
}

// ── 批量调用（一次请求处理所有场景）────────────────

/**
 * 批量调用 LLM：将所有场景文本合并为一次请求。
 * 成功时返回与 texts 等长的关键词数组；失败返回空数组（触发上游全部回退规则提取）。
 */
async function batchCallVolcEngine(
  texts: string[]
): Promise<{ keywordsList: string[][]; usage?: TokenUsage }> {
  if (!AI_KEYWORD_API_KEY || !AI_KEYWORD_BASE_URL || !AI_KEYWORD_MODEL) {
    return { keywordsList: [] };
  }

  // 构建用户消息：把所有场景按编号拼接
  const userContent = texts
    .map((t, i) => `场景${i + 1}: ${t}`)
    .join('\n');

  try {
    const resp = await fetch(`${AI_KEYWORD_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_KEYWORD_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_KEYWORD_MODEL,
        messages: [
          { role: 'system', content: BATCH_SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        max_tokens: 100, // 足够容纳 6-10 个场景的关键词
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(
        `[keyword] 批量调用返回 ${resp.status}: ${errText.slice(0, 200)}`
      );
      return { keywordsList: [] };
    }

    const data = (await resp.json()) as VolcChatResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn('[keyword] 批量调用返回空内容');
      return { keywordsList: [] };
    }

    // 解析 JSON 数组
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length === texts.length) {
      const keywordsList = parsed.map((item: string) => {
        const cleaned = String(item).replace(/[^a-zA-Z\s-]/g, '');
        return cleaned.split(/\s+/).filter((k) => k.length > 0);
      });
      return { keywordsList, usage: data.usage };
    }

    console.warn(
      `[keyword] 批量调用返回格式不符: 期望 ${texts.length} 项数组`
    );
    return { keywordsList: [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[keyword] 批量调用异常: ${message}`);
    return { keywordsList: [] };
  }
}

// ── 公开 API ────────────────────────────────────────

/**
 * 从场景文本中提取英文搜索关键词（简单版，兼容旧调用）。
 */
export async function extractKeywords(text: string): Promise<string> {
  const result = await extractKeywordsWithDetail(text);
  return result.keyword;
}

/**
 * 从场景文本中提取英文搜索关键词（详细版，包含 token 消耗和提取方式）。
 */
export async function extractKeywordsWithDetail(
  text: string
): Promise<KeywordResult> {
  // 尝试火山引擎
  const { keywords, usage } = await callVolcEngine(text);
  if (keywords.length > 0) {
    const joined = keywords.join(' ');
    console.log(`[keyword] LLM: "${text.slice(0, 20)}..." → "${joined}"`);
    return { keyword: joined, method: 'llm', tokenUsage: usage };
  }

  // 回退规则提取
  const fallback = extractKeywordByRule(text);
  console.log(`[keyword] 规则回退: "${text.slice(0, 20)}..." → "${fallback}"`);
  return { keyword: fallback, method: 'rule' };
}

/**
 * 批量提取关键词（一次 LLM 调用处理所有场景）。
 *
 * 策略：
 * 1. 将所有场景文本合并为一次请求 → 成功则全部使用 LLM 结果
 * 2. 请求失败（网络/解析/超时）→ 全部回退规则提取
 *
 * 相比逐个调用：N 个场景从 N 次请求减少到 1 次，超时风险大幅降低，
 * 且系统提示词只发送一次，Token 消耗显著减少。
 */
export async function batchExtractKeywords(
  texts: string[]
): Promise<KeywordResult[]> {
  if (!texts.length) return [];

  // 1. 尝试批量 LLM
  const { keywordsList, usage } = await batchCallVolcEngine(texts);
  if (keywordsList.length === texts.length) {
    console.log(
      `[keyword] 批量 LLM 成功: ${texts.length} 个场景, ` +
        `tokens=${usage?.total_tokens ?? '?'}`
    );
    return keywordsList.map((kwArr, i) => {
      const joined = kwArr.slice(0, 3).join(' ') || 'nature';
      return {
        keyword: joined,
        method: 'llm' as const,
        tokenUsage: i === 0 ? usage : undefined, // 仅首项携带总量
      };
    });
  }

  // 2. 全部回退规则提取
  console.log(`[keyword] 批量 LLM 失败，${texts.length} 个场景全部回退规则提取`);
  return texts.map((text) => ({
    keyword: extractKeywordByRule(text),
    method: 'rule' as const,
  }));
}
