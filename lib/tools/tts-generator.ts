/**
 * AI TTS 语音合成工具 — DashScope qwen3-tts-flash。
 *
 * 接收纯文本或 SSML 标记文本，返回音频 Buffer + 时长。
 * 自动检测 SSML（以 <speak 开头），设置 text_type='SSML'。
 * 零容错：任何异常直接抛出。
 */

import { fetchWithTimeout } from './http';

// ── 配置 ────────────────────────────────────────────

const AI_TTS_API_KEY = process.env.AI_TTS_API_KEY!;
const AI_TTS_BASE_URL = process.env.AI_TTS_BASE_URL!;
const AI_TTS_MODEL = process.env.AI_TTS_MODEL!;

// ── 类型 ────────────────────────────────────────────

export interface TtsResult {
  audioBuffer: Buffer;
  durationSec: number;
}

/** DashScope 多模态生成响应 */
interface TtsApiResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{
          audio?: string;
          text?: string;
        }>;
      };
    }>;
    audio?: string;
  };
}

// ── 音频解析 ────────────────────────────────────────

async function resolveAudio(audio: unknown): Promise<Buffer> {
  // 对象 → 提取 url 或 data 字段
  if (typeof audio === 'object' && audio !== null) {
    const obj = audio as Record<string, unknown>;
    if (typeof obj.url === 'string' && (obj.url.startsWith('http://') || obj.url.startsWith('https://'))) {
      const resp = await fetch(obj.url);
      if (!resp.ok) throw new Error(`下载音频 URL 失败: HTTP ${resp.status}`);
      return Buffer.from(await resp.arrayBuffer());
    }
    if (typeof obj.data === 'string') return resolveAudio(obj.data);
    throw new Error(`无法解析 audio 对象: ${JSON.stringify(Object.keys(obj))}`);
  }

  if (typeof audio !== 'string') {
    throw new Error(`audio 类型异常: ${typeof audio}`);
  }

  // data URI
  if (audio.startsWith('data:')) {
    const b64 = audio.split(',')[1] ?? audio;
    return Buffer.from(b64, 'base64');
  }

  // URL
  if (audio.startsWith('http://') || audio.startsWith('https://')) {
    const resp = await fetch(audio);
    if (!resp.ok) throw new Error(`下载音频 URL 失败: HTTP ${resp.status}`);
    return Buffer.from(await resp.arrayBuffer());
  }

  // Base64
  return Buffer.from(audio, 'base64');
}

// ── 公开 API ────────────────────────────────────────

/**
 * 为单段文本合成语音。
 * 零容错：API 失败或配置缺失直接抛异常。
 */
export async function synthesizeSpeech(text: string): Promise<TtsResult> {
  if (!AI_TTS_API_KEY || !AI_TTS_BASE_URL || !AI_TTS_MODEL) {
    throw new Error('TTS 环境变量未配置（AI_TTS_API_KEY / AI_TTS_BASE_URL / AI_TTS_MODEL）');
  }

  const isSSML = text.trim().startsWith('<speak');
  console.log(`[tts] 合成中 ${isSSML ? '(SSML) ' : ''}: "${text.replace(/<[^>]+>/g, '').slice(0, 60)}..."`);

  const voice = process.env.AI_TTS_VOICE || 'Cherry';
  const rate = parseFloat(process.env.AI_TTS_SPEED || '1.0');

  const body: Record<string, unknown> = {
    model: AI_TTS_MODEL,
    input: {
      text,
      ...(isSSML ? { text_type: 'SSML' } : {}),
    },
    parameters: {
      voice,
      format: 'mp3',
      sample_rate: 24000,
      ...(isSSML ? {} : { rate }),
    },
  };

  const resp = await fetchWithTimeout(AI_TTS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_TTS_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`TTS API 返回 ${resp.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await resp.json()) as TtsApiResponse;

  const audioData =
    data.output?.choices?.[0]?.message?.content?.[0]?.audio ??
    data.output?.audio;

  if (!audioData) {
    throw new Error(`TTS 响应中未找到音频数据: ${JSON.stringify(data).slice(0, 300)}`);
  }

  const audioBuffer = await resolveAudio(audioData);
  // DashScope TTS 不返回精确时长，调用方根据 shot.duration 对齐
  return { audioBuffer, durationSec: 0 };
}
