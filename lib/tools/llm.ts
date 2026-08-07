/**
 * 共享 LLM 客户端 — research / proposal / script 三节点共用同一 OpenAI 兼容 chat/completions 调用。
 *
 * 背景（重构）：三个 generator 此前各自复制了一份 ChatResponse / callXLLM / withRetry。
 * 这里收敛为统一输入结构 ChatInput（messages）+ 单一 callChatCompletion + 共享 withRetry。
 * messages 由 lib/prompts/pipeline.ts 的 buildPipelineConversation 构造（追加式对话，前缀一致 → KV Cache 命中）；
 * 各节点只保留：env 读取（LLM_TEXT_*）、parseAndValidate* 校验器。
 * 零容错：失败直接抛错，最多 3 次指数退避重试。
 */

import { fetchWithTimeout } from './http';
import type { TokenUsage } from '@/lib/log/procedure';
import type { ChatMessage } from '@/lib/types';

// ── 统一输入结构 ────────────────────────────────────

export interface ChatInput {
  /** API Key（三文本节点共用的 LLM_TEXT_API_KEY） */
  apiKey: string;
  /** Base URL（LLM_TEXT_BASE_URL） */
  baseUrl: string;
  /** 模型名（LLM_TEXT_MODEL） */
  model: string;
  /**
   * 完整对话消息（追加式，前缀一致 → KV Cache 命中）。
   * 由 lib/prompts/pipeline.ts 的 buildPipelineConversation 构造。
   */
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** 错误/日志前缀（如 'research'） */
  label?: string;
  /** 覆盖默认超时（默认走 http.ts 的 DEFAULT_HTTP_TIMEOUT_MS） */
  timeoutMs?: number;
}

export interface ChatResult {
  content: string;
  usage?: TokenUsage;
}

interface ChatResponse {
  choices: Array<{
    message: { content: string };
  }>;
  usage?: TokenUsage;
}

// ── LLM API 调用 ────────────────────────────────────

/**
 * 调用 OpenAI 兼容的 chat/completions 端点。
 * 零容错：非 2xx / 空内容 / JSON 异常直接抛错（带 label 前缀，便于定位节点）。
 */
export async function callChatCompletion(input: ChatInput): Promise<ChatResult> {
  const label = input.label ?? 'llm';

  const resp = await fetchWithTimeout(
    `${input.baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.apiKey}`,
      },
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        max_tokens: input.maxTokens,
        temperature: input.temperature,
      }),
    },
    input.timeoutMs
  );

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`[${label}] API 返回 ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await resp.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error(`[${label}] API 返回空内容`);
  }

  return { content, usage: data.usage };
}

// ── 流式调用（前端 agent 用）──────────────────────────

/** 流式调用输入（与 ChatInput 同构；timeoutMs 缺省给 300s，长输出） */
export type StreamChatInput = ChatInput;

/** 解析 text/event-stream 的一行 `data: ...` → JSON；非 data 行 / `[DONE]` → null。 */
export function parseSSELine(line: string): Record<string, unknown> | null {
  if (!line.startsWith('data:')) return null;
  const payload = line.slice(5).trim();
  if (!payload || payload === '[DONE]') return null;
  try {
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** 从 text/event-stream 文本块提取所有 content delta（供测试直接喂模拟串）。 */
export function parseSSEDeltas(chunk: string): string[] {
  const deltas: string[] = [];
  for (const event of chunk.split('\n\n')) {
    for (const line of event.split('\n')) {
      const json = parseSSELine(line);
      if (!json) continue;
      const delta = (json as { choices?: Array<{ delta?: { content?: string } }> })
        .choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta.length > 0) deltas.push(delta);
    }
  }
  return deltas;
}

/**
 * 流式调用 OpenAI 兼容 chat/completions（`stream: true`），逐 token 调 onDelta，返回拼接全文。
 * 读取 resp.body（getReader）→ 按 `\n\n` 事件块切分 → 解析 `data:` 行 → 取 choices[0].delta.content。
 * 零容错：非 2xx / 空输出抛错（带 label 前缀）。
 */
export async function streamChatCompletion(
  input: StreamChatInput,
  onDelta: (delta: string) => void
): Promise<string> {
  const label = input.label ?? 'llm';

  const resp = await fetchWithTimeout(
    `${input.baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.apiKey}`,
      },
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        max_tokens: input.maxTokens,
        temperature: input.temperature,
        stream: true,
      }),
    },
    input.timeoutMs ?? 300_000 // 流式默认 300s（长输出）
  );

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`[${label}] API 返回 ${resp.status}: ${errText.slice(0, 200)}`);
  }
  if (!resp.body) throw new Error(`[${label}] API 无流式 body`);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        for (const delta of parseSSEDeltas(part)) {
          full += delta;
          onDelta(delta);
        }
      }
    }
    for (const delta of parseSSEDeltas(buffer)) {
      full += delta;
      onDelta(delta);
    }
  } finally {
    reader.releaseLock();
  }

  if (!full.trim()) throw new Error(`[${label}] API 流式返回空内容`);
  return full;
}

// ── 指数退避重试 ────────────────────────────────────

export interface RetryOptions {
  maxRetries?: number;
  /** 日志前缀（如 'research'） */
  label: string;
}

/** 指数退避重试（默认最多 3 次：attempt 0/1/2/3，延迟 1s/2s/4s），全部失败抛错。 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions
): Promise<{ result: T; retries: number }> {
  const maxRetries = opts.maxRetries ?? 3;
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
        `[${opts.label}] 第 ${attempt + 1} 次失败: ${lastError.message}，` +
          `${delay / 1000}s 后重试...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error(`[${opts.label}] 未知错误`);
}
