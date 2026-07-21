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

// ── 配置（全部来自环境变量）─────────────────────────

const AI_KEYWORD_API_KEY = process.env.AI_KEYWORD_API_KEY;
const AI_KEYWORD_BASE_URL = process.env.AI_KEYWORD_BASE_URL;
const AI_KEYWORD_MODEL = process.env.AI_KEYWORD_MODEL;

// ── Prompt ──────────────────────────────────────────

const SYSTEM_PROMPT =
  '你是搜索关键词专家。从用户文本中提取1-3个英文关键词（名词或形容词+名词），用于图片搜索。只输出关键词，空格分隔，不要其他内容。';

// ── 类型 ────────────────────────────────────────────

interface VolcChatResponse {
  choices: Array<{
    message: { content: string };
  }>;
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
async function callVolcEngine(text: string): Promise<string[]> {
  if (!AI_KEYWORD_API_KEY || !AI_KEYWORD_BASE_URL || !AI_KEYWORD_MODEL) {
    return [];
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
      signal: AbortSignal.timeout(10000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(
        `[keyword] 火山引擎返回 ${resp.status}: ${errText.slice(0, 200)}`
      );
      return [];
    }

    const data = (await resp.json()) as VolcChatResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn('[keyword] 火山引擎返回空内容');
      return [];
    }

    // 清洗：只保留字母、空格、连字符（英文关键词）
    const cleaned = content.replace(/[^a-zA-Z\s-]/g, '');
    const keywords = cleaned.split(/\s+/).filter((k) => k.length > 0);
    return keywords.slice(0, 3);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[keyword] 火山引擎调用异常: ${message}`);
    return [];
  }
}

// ── 公开 API ────────────────────────────────────────

/**
 * 从场景文本中提取英文搜索关键词。
 * - 火山引擎已配置 → 调用 API 翻译为英文关键词
 * - 失败/未配置 → 回退到规则提取（中文原文截取）
 *
 * @returns 用于图库搜索的关键词字符串（可能是英文或中文）
 */
export async function extractKeywords(text: string): Promise<string> {
  // 尝试火山引擎
  const keywords = await callVolcEngine(text);
  if (keywords.length > 0) {
    const joined = keywords.join(' ');
    console.log(`[keyword] 火山引擎: "${text.slice(0, 20)}..." → "${joined}"`);
    return joined;
  }

  // 回退规则提取
  const fallback = extractKeywordByRule(text);
  console.log(`[keyword] 规则回退: "${text.slice(0, 20)}..." → "${fallback}"`);
  return fallback;
}
