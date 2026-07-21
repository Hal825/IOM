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
  scenes: ScriptScene[],//字幕场景列表
  audioDurationSec: number,//音频总时长（秒）
  fps: number//视频帧率（帧/秒）
): ScriptScene[] {
  if (scenes.length === 0) return [];
  const totalFrames = Math.max(1, Math.round(audioDurationSec * fps));//计算总帧数，至少为 1 帧
  const totalChars = scenes.reduce((sum, s) => sum + s.text.length, 0);//计算总字符数

  let cursor = 0;//初始化帧游标，从第 0 帧开始
  return scenes.map((scene, i) => {//遍历每个字幕场景，分配帧区间
    const isLast = i === scenes.length - 1;//判断是否为最后一个场景
    const frames = isLast
      ? totalFrames - cursor // 最后一段吃掉剩余帧，保证总和精确
      : Math.round((scene.text.length / totalChars) * totalFrames);//按字符占比分配帧数，四舍五入
    const startFrame = cursor;//记录当前帧游标为开始帧
    const endFrame = cursor + Math.max(1, frames);//计算结束帧，至少为开始帧 + 1
    cursor = endFrame;//更新帧游标到下一段的开始帧
    return { ...scene, startFrame, endFrame };//返回新的字幕场景对象，包含分配好的帧区间
  });
}
