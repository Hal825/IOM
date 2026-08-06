/**
 * 共享 HTTP 工具 — 统一超时 + JSON 提取。
 *
 * 背景（审查 H2）：此前所有第三方 API 调用无超时，Worker 并发为 1，
 * 任一请求挂起会让整个队列永久阻塞。这里统一给 fetch 加 AbortController 超时，
 * 超时按零容错直接抛错（任务失败），而非挂死队列。
 */

/** 默认超时（毫秒）。LLM 长调用可用环境变量覆盖；默认 120s 足够宽裕。 */
export const DEFAULT_HTTP_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS ?? 120_000);

/**
 * 带超时的 fetch：超时抛 AbortError（调用方按零容错处理）。
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_HTTP_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 从 LLM 响应中稳健提取 JSON 对象：
 * 1) 优先取 ```json ... ``` 代码围栏内的内容；
 * 2) 否则逐候选花括号块做 brace 匹配（忽略字符串内的括号）并尝试 JSON.parse，
 *    返回第一个合法对象 —— 散文里嵌套花括号不会截错，也不需要"首 { 到末 }"的贪婪假设；
 * 3) 全部候选都不合法 → 抛错。
 */
export function extractJsonObject(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? raw;

  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] !== '{') continue;
    const end = matchBrace(candidate, i);
    if (end === -1) break;
    const slice = candidate.slice(i, end + 1);
    try {
      JSON.parse(slice);
      return slice;
    } catch {
      i = end; // 该候选不合法，跳到结尾继续找下一个 `{`
    }
  }
  throw new Error('响应中未找到合法 JSON 对象');
}

/** 从 start 起匹配花括号范围（忽略 JSON 字符串字面量内的括号），找不到返回 -1 */
function matchBrace(s: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
