/**
 * Token 用量类型 — 供 tools 模块引用。
 */

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
