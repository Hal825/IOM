/**
 * AI 语音合成 — Prompt 模板（最小化，以配置驱动为主）。
 *
 * 通过 AI_TTS_API_KEY / AI_TTS_BASE_URL / AI_TTS_MODEL 环境变量配置。
 * 支持任意兼容 OpenAI TTS 接口的服务（OpenAI TTS / 火山引擎 Ark / DeepSeek 等）。
 */

/** TTS 语音合成系统提示词（仅在 API 需要时使用） */
export const TTS_SYSTEM = `You are a professional voice narrator. Convert the provided text into natural, expressive speech suitable for video narration.`;

/** 默认语音角色 */
export const DEFAULT_TTS_VOICE = 'zh-CN-XiaoxiaoNeural';

/** 默认语速 (0.25 - 4.0) */
export const DEFAULT_TTS_SPEED = 1.0;

/** 构建 TTS 文本：将 shotScript 串联为叙述文本 */
export function buildTTSText(
  shotScript: Array<{ subtitleText?: string; videoPrompt?: string }>
): string {
  return shotScript
    .map((shot) => shot.subtitleText ?? '')
    .filter(Boolean)
    .join('。\n');
}
