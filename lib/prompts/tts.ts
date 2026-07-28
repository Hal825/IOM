/**
 * AI 语音合成 — SSML 构建 + 情感映射。
 *
 * TTS 节点从 videoScript.sceneScripts[].audio 读取数据，
 * 按镜头构建 SSML 文档（含停顿、语速、情感标签），
 * 通过 DashScope qwen3-tts-flash 合成语音。
 */

// ── 情感 → 语音参数映射 ──────────────────────────────

interface EmotionProfile {
  rate: number;
  pitch: string;
  volume: string;
}

const EMOTION_TABLE: Record<string, EmotionProfile> = {
  'calm':       { rate: 0.90, pitch: 'default', volume: 'medium' },
  'informative':{ rate: 1.00, pitch: 'default', volume: 'medium' },
  'confident':  { rate: 1.00, pitch: 'default', volume: 'medium' },
  'reassuring': { rate: 0.90, pitch: 'default', volume: 'soft' },
  'inspiring':  { rate: 0.95, pitch: 'default', volume: 'medium' },
  'warm':       { rate: 0.90, pitch: 'default', volume: 'soft' },
  'amazed':     { rate: 1.05, pitch: 'high',   volume: 'medium' },
  'curious':    { rate: 1.00, pitch: 'default', volume: 'medium' },
  'excited':    { rate: 1.10, pitch: 'high',   volume: 'loud' },
  'serious':    { rate: 0.85, pitch: 'low',    volume: 'medium' },
  'hopeful':    { rate: 0.95, pitch: 'default', volume: 'medium' },
  'gentle':     { rate: 0.88, pitch: 'default', volume: 'soft' },
  'urgent':     { rate: 1.15, pitch: 'high',   volume: 'loud' },
  'sad':        { rate: 0.80, pitch: 'low',    volume: 'soft' },
  'neutral':    { rate: 1.00, pitch: 'default', volume: 'medium' },
};

const DEFAULT_PROFILE: EmotionProfile = { rate: 1.0, pitch: 'default', volume: 'medium' };

/**
 * 从自然语言情感描述中解析出语音参数。
 * emotion 如 "calm, informative"，按逗号拆分后匹配关键词。
 */
export function resolveEmotion(emotion: string): EmotionProfile {
  if (!emotion) return DEFAULT_PROFILE;

  const tokens = emotion.toLowerCase().split(/[,，、;\s]+/).filter(Boolean);

  for (const token of tokens) {
    if (EMOTION_TABLE[token]) return EMOTION_TABLE[token];
    for (const key of Object.keys(EMOTION_TABLE)) {
      if (token.includes(key)) return EMOTION_TABLE[key];
    }
  }

  return DEFAULT_PROFILE;
}

// ── SSML 构建 ────────────────────────────────────────

/**
 * 为单个镜头构建 SSML 文档。
 * @param narrationText  旁白文本
 * @param narrationEmotion 旁白情感标签
 * @param dialogues  角色对话列表
 * @param pauseAfterSec  读完后停顿秒数
 */
export function buildShotSSML(
  narrationText: string | null,
  narrationEmotion: string,
  dialogues: Array<{ characterId: string; text: string; emotion: string; speed: number }>,
  pauseAfterSec: number,
): string {
  const parts: string[] = [];
  const profile = resolveEmotion(narrationEmotion);

  if (narrationText?.trim()) {
    parts.push(
      `<prosody rate="${profile.rate.toFixed(2)}" pitch="${profile.pitch}" volume="${profile.volume}">` +
      `${escapeXml(narrationText.trim())}` +
      `</prosody>`
    );
    if (pauseAfterSec > 0) {
      parts.push(`<break time="${Math.round(pauseAfterSec * 1000)}ms"/>`);
    }
  }

  for (let i = 0; i < dialogues.length; i++) {
    const d = dialogues[i];
    if (!d.text.trim()) continue;

    const dp = resolveEmotion(d.emotion);
    if (i > 0 || parts.length > 0) {
      parts.push(`<break time="200ms"/>`);
    }

    parts.push(
      `<prosody rate="${(profile.rate * d.speed).toFixed(2)}" pitch="${dp.pitch}" volume="${dp.volume}">` +
      `${escapeXml(d.text.trim())}` +
      `</prosody>`
    );
  }

  if (parts.length === 0) return '';

  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">` +
    parts.join('\n') +
    `</speak>`
  );
}

// ── 工具函数 ──────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
