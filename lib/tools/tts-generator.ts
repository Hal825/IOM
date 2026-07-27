/**
 * AI TTS 语音合成工具 — DashScope 多模态生成 / 豆包 Seed-Audio。
 *
 * 将 Proposal.shotScript 中的字幕文本合成为音频文件。
 *
 * DashScope 模式（当前）：POST {AI_TTS_BASE_URL}
 *   请求体：{ model, input: { messages }, parameters }
 * 豆包模式：POST https://openspeech.bytedance.com/api/v3/tts/create
 *
 * 配置通过 AI_TTS_API_KEY / AI_TTS_BASE_URL / AI_TTS_MODEL 环境变量管理。
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import type { Proposal } from '@/lib/types';
import { buildTTSText } from '@/lib/prompts/tts';

// ── 配置（全部来自环境变量）─────────────────────────

const AI_TTS_API_KEY = process.env.AI_TTS_API_KEY;
const AI_TTS_BASE_URL = process.env.AI_TTS_BASE_URL;
const AI_TTS_MODEL = process.env.AI_TTS_MODEL;

/** 音频本地存储根目录 */
export const TTS_STORE_DIR = path.resolve('./storage/audio');

// ── 类型 ────────────────────────────────────────────

export interface TtsResult {
  audioPath: string;
  durationSec: number;
  model: string;
}

/** DashScope 多模态生成响应（含 TTS） */
interface TtsApiResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{
          audio?: string;   // base64 或 URL
          text?: string;
        }>;
      };
    }>;
  };
  usage?: {
    total_tokens?: number;
  };
}

// ── API 调用 ─────────────────────────────────────────

/**
 * 调用 DashScope 多模态生成 API 合成语音。
 *
 * 请求：{ model, input: { text }, parameters: { voice, format, ... } }
 * 鉴权：Bearer Token
 * 响应：output.choices[].message.content[].audio | output.audio
 */
async function callTtsAPI(ttsText: string): Promise<{ audioUrl: string; durationSec: number } | null> {
  if (!AI_TTS_API_KEY || !AI_TTS_BASE_URL || !AI_TTS_MODEL) {
    console.log('[tts] AI 语音合成未配置，跳过');
    return null;
  }

  try {
    console.log(`[tts] 合成中: "${ttsText.slice(0, 60)}..."`);

    // 从环境变量读取音色和语速，提供默认值
    const voice = process.env.AI_TTS_VOICE || 'Cherry';
    const rate = parseFloat(process.env.AI_TTS_SPEED || '1.0');

    // DashScope TTS 请求格式：input.text（文本）+ parameters（配置）
    const body: Record<string, unknown> = {
      model: AI_TTS_MODEL, // 应为 'qwen3-tts-flash'
      input: {
        text: ttsText,
      },
      parameters: {
        voice,
        format: 'mp3',
        sample_rate: 24000,
        rate,
      },
    };

    const resp = await fetch(AI_TTS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_TTS_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.warn(`[tts] API 返回 ${resp.status}: ${errText.slice(0, 300)}`);
      return null;
    }

    const data = (await resp.json()) as TtsApiResponse & {
      output?: { audio?: string; duration?: number };
    };

    // 兼容两种响应格式：
    // 1. 多模态格式: output.choices[].message.content[].audio
    // 2. TTS 专有格式: output.audio
    const audioData =
      data.output?.choices?.[0]?.message?.content?.[0]?.audio ??
      data.output?.audio;

    if (!audioData) {
      console.warn('[tts] 响应中未找到音频数据', JSON.stringify(data).slice(0, 300));
      return null;
    }

    const audioBuffer = await resolveAudio(audioData);
    if (!audioBuffer) return null;

    await fs.mkdir(TTS_STORE_DIR, { recursive: true });
    const audioPath = path.join(TTS_STORE_DIR, `tts-${Date.now()}.mp3`);
    await fs.writeFile(audioPath, audioBuffer);

    console.log(`[tts] 合成完成 → ${audioPath}`);
    return { audioUrl: audioPath, durationSec: 0 };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[tts] API 异常: ${message}`);
    return null;
  }
}

/**
 * 从 audio 字段解析 Buffer。
 * audio 可能是：
 *   1. 字符串 URL（http/https）→ 下载
 *   2. 字符串 Base64 → 直接解码
 *   3. 字符串 data URI（data:audio/mp3;base64,...）→ 解码
 *   4. 对象 { url, data, ... } → 取 url 或 data 字段
 */
async function resolveAudio(audio: unknown): Promise<Buffer | null> {
  // 对象 → 尝试提取 url 或 data 字段
  if (typeof audio === 'object' && audio !== null) {
    const obj = audio as Record<string, unknown>;
    if (typeof obj.url === 'string' && (obj.url.startsWith('http://') || obj.url.startsWith('https://'))) {
      try {
        const resp = await fetch(obj.url, { signal: AbortSignal.timeout(30_000) });
        if (resp.ok) return Buffer.from(await resp.arrayBuffer());
        console.warn(`[tts] 下载音频 URL 失败: HTTP ${resp.status}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[tts] 下载音频 URL 异常: ${message}`);
      }
      return null;
    }
    if (typeof obj.data === 'string') {
      return resolveAudio(obj.data); // 递归处理 data 字段
    }
    console.warn(`[tts] 无法解析 audio 对象: ${JSON.stringify(Object.keys(obj))}`);
    return null;
  }

  if (typeof audio !== 'string') {
    console.warn(`[tts] audio 类型异常: ${typeof audio}`);
    return null;
  }

  // data URI → 解码
  if (audio.startsWith('data:')) {
    const base64 = audio.split(',')[1] ?? audio;
    try { return Buffer.from(base64, 'base64'); } catch { /* fall through */ }
  }

  // URL → 下载
  if (audio.startsWith('http://') || audio.startsWith('https://')) {
    try {
      const resp = await fetch(audio, { signal: AbortSignal.timeout(30_000) });
      if (resp.ok) return Buffer.from(await resp.arrayBuffer());
      console.warn(`[tts] 下载音频 URL 失败: HTTP ${resp.status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[tts] 下载音频 URL 异常: ${message}`);
    }
    return null;
  }

  // Base64 → 解码
  try {
    return Buffer.from(audio, 'base64');
  } catch {
    console.warn('[tts] Base64 解码失败');
    return null;
  }
}

// ── 公开 API ────────────────────────────────────────

/**
 * 为 Proposal 中的分镜脚本合成完整语音。
 *
 * @param proposal 视频制作提案
 * @param jobId 任务 ID，用于本地存储目录隔离
 */
export async function synthesizeSpeech(
  proposal: Proposal,
  jobId: string
): Promise<TtsResult> {
  const ttsText = buildTTSText(proposal.shotScript);
  if (!ttsText.trim()) {
    throw new Error('[tts] 字幕文本为空');
  }

  console.log(`[tts] 开始语音合成: ${proposal.shotScript.length} 个场景`);

  const apiResult = await callTtsAPI(ttsText);

  if (apiResult) {
    // 移动到任务子目录
    const jobDir = path.join(TTS_STORE_DIR, jobId);
    await fs.mkdir(jobDir, { recursive: true });
    const destPath = path.join(jobDir, 'audio.mp3');

    if (apiResult.audioUrl !== destPath) {
      await fs.rename(apiResult.audioUrl, destPath).catch(async () => {
        // rename 跨分区可能失败，改为复制
        const buf = await fs.readFile(apiResult.audioUrl);
        await fs.writeFile(destPath, buf);
      });
    }

    console.log(`[tts] 完成: ${apiResult.durationSec}s → ${destPath}`);
    return {
      audioPath: destPath,
      durationSec: apiResult.durationSec,
      model: AI_TTS_MODEL!,
    };
  }

  // 无 API 配置 → 占位
  console.log('[tts] 无可用 API，生成占位标记');
  return {
    audioPath: '',
    durationSec: proposal.blueprint.totalDuration,
    model: 'placeholder',
  };
}
