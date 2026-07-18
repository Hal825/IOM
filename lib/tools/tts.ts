import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { parseFile } from 'music-metadata';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * TTS 工具 — 调用微软 Edge 在线语音合成（免费，需联网）。
 * MVP 策略：整段文本合成单个 MP3，返回文件路径和时长。
 */

const DEFAULT_VOICE = process.env.TTS_VOICE ?? 'zh-CN-XiaoxiaoNeural';

export interface TtsResult {
  /** 音频文件绝对路径 */
  audioPath: string;
  /** 音频时长（秒） */
  duration: number;
}

/**
 * 合成整段文本为 MP3。
 * msedge-tts 的 toFile 固定写 <dir>/audio.mp3，因此每个任务用独立子目录。
 *
 * @param text 要合成的文本
 * @param outputDir 输出目录（每个 job 一个，如 storage/audio/<jobId>）
 */
export async function synthesizeSpeech(text: string, outputDir: string): Promise<TtsResult> {
  await fs.mkdir(outputDir, { recursive: true });

  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(DEFAULT_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioFilePath } = await tts.toFile(outputDir, escapeSsml(text));

    const metadata = await parseFile(audioFilePath, { duration: true });
    const duration = metadata.format.duration;
    if (!duration || duration <= 0) {
      throw new Error(`无法读取音频时长: ${audioFilePath}`);
    }

    return { audioPath: path.resolve(audioFilePath), duration };
  } finally {
    tts.close();
  }
}

/** 转义 XML 特殊字符，避免用户输入破坏 SSML */
function escapeSsml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
