/**
 * AI 素材生成 — Prompt 模板（仅场景背景）。
 *
 * 角色图已改用预设素材（storage/assets/char_userd_1/），
 * 不再通过 AI 生成。
 */

/** 构建场景背景图 prompt */
export function buildSceneBackgroundPrompt(visualDescription: string): string {
  return `cinematic landscape, 16:9 wide angle, high quality, photorealistic, no characters, no people, empty scene — ${visualDescription}`;
}
