/**
 * AI 图片生成 — Prompt 模板
 *
 * 在图片下载失败或仅有纯色兜底时，调用 AI 模型生成背景画面。
 * 通过 AI_IMAGE_MODEL / AI_IMAGE_API_KEY / AI_IMAGE_BASE_URL 配置。
 */

/** 将场景文本包装为图片生成提示词（追加画质/构图限定词） */
export function buildImageGenPrompt(sceneText: string): string {
  return `cinematic landscape, 16:9 wide angle, high quality, photorealistic — ${sceneText}`;
}
