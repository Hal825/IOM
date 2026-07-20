import { generateScript } from './script-generator';
import { SCRIPT_GENERATION_SYSTEM } from '@/lib/prompts/script-generation';
import type { ScriptScene } from '@/lib/types';

/**
 * AI 脚本生成器 — 调用 DeepSeek（兼容 OpenAI 格式）生成字幕脚本。
 *
 * 策略：
 * 1. 调用 DeepSeek API，要求返回结构化 JSON
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 * 3. 全部失败时回退到规则切句（generateScript）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL;

const MAX_RETRIES = 3;
const MAX_TOKENS = 2000;

// ── 类型 ────────────────────────────────────────────

export interface AiScriptResult {
  scenes: ScriptScene[];
  /** 使用的模型（可观测性） */
  model: string;
  /** 实际重试次数 */
  retries: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

interface ParsedScene {
  text: string;
}

interface ParsedScriptOutput {
  scenes: ParsedScene[];
}

// ── 轻量 JSON 解析 + 结构校验 ─────────────────────

function parseAndValidate(raw: string): ParsedScriptOutput {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('[ai-script] 响应中未找到 JSON 对象');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('[ai-script] JSON 解析失败');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('[ai-script] 输出不是有效对象');
  }

  const obj = parsed as Record<string, unknown>;

  if (!Array.isArray(obj.scenes)) {
    throw new Error('[ai-script] 缺少 scenes 数组');
  }
  if (obj.scenes.length === 0) {
    throw new Error('[ai-script] scenes 数组为空');
  }

  const scenes: ParsedScene[] = [];
  for (let i = 0; i < obj.scenes.length; i++) {
    const scene = obj.scenes[i];
    if (!scene || typeof scene !== 'object') {
      throw new Error(`[ai-script] scenes[${i}] 不是有效对象`);
    }
    const text = (scene as Record<string, unknown>).text;
    if (typeof text !== 'string' || text.trim().length === 0) {
      throw new Error(`[ai-script] scenes[${i}].text 缺失或为空`);
    }
    scenes.push({ text: text.trim() });
  }

  return { scenes };
}

// ── DeepSeek API 调用 ───────────────────────────────

async function callDeepSeek(userPrompt: string): Promise<string> {
  if (!DEEPSEEK_API_KEY || !DEEPSEEK_BASE_URL || !DEEPSEEK_MODEL) {
    throw new Error(
      'DeepSeek 环境变量未配置（DEEPSEEK_API_KEY / DEEPSEEK_BASE_URL / DEEPSEEK_MODEL）'
    );
  }

  const resp = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: SCRIPT_GENERATION_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(
      `DeepSeek API 返回 ${resp.status}: ${errText.slice(0, 200)}`
    );
  }

  const data = (await resp.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('DeepSeek 返回空内容');
  }

  return content;
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
        `[ai-script] 第 ${attempt + 1} 次失败: ${lastError.message}，` +
          `${delay / 1000}s 后重试...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error('[ai-script] 未知错误');
}

// ── 公开 API ────────────────────────────────────────

/**
 * 使用 AI 生成字幕脚本。
 * - 已配置 DeepSeek → 调用 API，失败回退规则切句
 * - 未配置 → 直接走规则切句
 */
export async function generateScriptWithAI(
  userPrompt: string
): Promise<AiScriptResult> {
  // 未配置 API Key → 静默回退
  if (!DEEPSEEK_API_KEY) {
    console.log('[ai-script] 未配置 DEEPSEEK_API_KEY，使用规则切句');
    return {
      scenes: generateScript(userPrompt),
      model: 'rule-based',
      retries: 0,
    };
  }

  try {
    const { result, retries } = await withRetry(async () => {
      const content = await callDeepSeek(userPrompt);
      return parseAndValidate(content);
    });

    const scenes = result.scenes.map((s) => ({
      text: s.text,
      startFrame: 0,
      endFrame: 0,
    }));

    console.log(
      `[ai-script] ${DEEPSEEK_MODEL} 生成 ${scenes.length} 个场景` +
        (retries > 0 ? `（重试 ${retries} 次）` : '')
    );

    return { scenes, model: DEEPSEEK_MODEL!, retries };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ai-script] 失败，回退规则切句: ${message}`);

    return {
      scenes: generateScript(userPrompt),
      model: `fallback(${DEEPSEEK_MODEL ?? 'unknown'})`,
      retries: MAX_RETRIES,
    };
  }
}
