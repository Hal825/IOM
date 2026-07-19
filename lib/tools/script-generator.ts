import type { ScriptScene } from '../types';

/**
 * 脚本生成工具 — 把用户输入文本切分为字幕场景（模板规则，不依赖 AI）。
 * 帧区间在 TTS 得到音频总时长后由 assignFrames 回填。
 */

/** 句子切分：中英文句末标点 + 换行 */
const SENTENCE_DELIMITER = /(?<=[。！？；.!?;\n])/;

/** 少于该字符数的片段合并到上一句 */
const MIN_SCENE_LENGTH = 2;

/** 单条字幕最大长度，超出按逗号再切 */
const MAX_SCENE_LENGTH = 40;

/**
 * 把整段文本切分为字幕场景列表。
 * 帧区间初始为 0，等待 assignFrames 回填。
 */
export function generateScript(text: string): ScriptScene[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const rawParts = trimmed
    .split(SENTENCE_DELIMITER)// Step 1: 按标点切分（可能含空白和空串）
    .map((s) => s.trim())// Step 2: 去除每段首尾空白（"  。" → "。"）
    .filter((s) => s.length > 0);// Step 3: 剔除纯空白/空串

  // 过长的句子按逗号/顿号再切
  const parts: string[] = [];
  for (const part of rawParts) {
    if (part.length <= MAX_SCENE_LENGTH) {
      parts.push(part);
      continue;
    }
    const subParts = part.split(/(?<=[，、,])/).map((s) => s.trim()).filter(Boolean);// Step 4: 按逗号/顿号切分，去除空串(细切)
    let buffer = '';
    for (const sub of subParts) {
      if (buffer && buffer.length + sub.length > MAX_SCENE_LENGTH) {
        parts.push(buffer);
        buffer = sub;
      } else {
        buffer += sub;
      }
    }
    if (buffer) parts.push(buffer);
  }

  // 过短的片段（如孤立标点）合并到上一句
  const merged: string[] = [];
  for (const part of parts) {
    const stripped = part.replace(/[。！？；.!?;，、,\s]/g, '');
    if (stripped.length < MIN_SCENE_LENGTH && merged.length > 0) {
      merged[merged.length - 1] += part;
    } else {
      merged.push(part);
    }
  }

  return merged.map((text) => ({ text, startFrame: 0, endFrame: 0 }));
}

/**
 * 按音频总时长把帧区间分配给各场景。
 * 每个场景按其文字长度占比分配时长（比均分更贴近语音节奏）。
 */
export function assignFrames(
  scenes: ScriptScene[],
  audioDurationSec: number,
  fps: number
): ScriptScene[] {
  if (scenes.length === 0) return [];
  const totalFrames = Math.max(1, Math.round(audioDurationSec * fps));
  const totalChars = scenes.reduce((sum, s) => sum + s.text.length, 0);

  let cursor = 0;
  return scenes.map((scene, i) => {
    const isLast = i === scenes.length - 1;
    const frames = isLast
      ? totalFrames - cursor // 最后一段吃掉剩余帧，保证总和精确
      : Math.round((scene.text.length / totalChars) * totalFrames);
    const startFrame = cursor;
    const endFrame = cursor + Math.max(1, frames);
    cursor = endFrame;
    return { ...scene, startFrame, endFrame };
  });
}
