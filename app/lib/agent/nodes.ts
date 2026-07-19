import path from 'node:path';
import crypto from 'node:crypto';
import { VideoGenState, type VideoGenStateType, type VideoGenStateUpdate } from './state';
import { generateScript, assignFrames } from '@/lib/tools/script-generator';
import { synthesizeSpeech } from '@/lib/tools/tts';
import { getQueue } from '@/lib/queue';
import { STORAGE_DIR } from '@/lib/tasks';
import { VIDEO_FPS } from '@/lib/types';

// ── 工具函数 ────────────────────────────────────────

/** 在 BullMQ 分配 job.id 之前先生成一个唯一 ID，用于 TTS 输出目录 */
function makeTaskId(): string {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

// ── 节点 1：脚本切分（纯计算，无副作用）─────────────

/**
 * 把用户输入文本切分为字幕场景列表。
 * 复用原有的 generateScript，帧区间初始为 0，等待 ttsNode 回填。
 */
export async function scriptNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const scenes = generateScript(state.userPrompt);

  if (scenes.length === 0) {
    throw new Error('脚本生成结果为空');
  }

  return { scriptSegments: scenes };
}

// ── 节点 2：语音合成 + 帧区间回填（调用微软 Edge TTS）─

/**
 * 把脚本文本合成为 MP3，然后用音频时长回填各场景的帧区间。
 * TTS 输出目录沿用 storage/audio/<taskId> 约定。
 */
export async function ttsNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.scriptSegments || state.scriptSegments.length === 0) {
    throw new Error('缺少脚本分段，请先执行 scriptNode');
  }

  const taskId = makeTaskId();
  const audioDir = path.join(STORAGE_DIR, 'audio', taskId);

  // 合并所有场景文本为一段，传入 TTS
  const fullText = state.scriptSegments.map((s) => s.text).join('');
  const { audioPath, duration } = await synthesizeSpeech(fullText, audioDir);

  // 用实际音频时长回填帧区间
  const scriptWithFrames = assignFrames(
    state.scriptSegments,
    duration,
    VIDEO_FPS
  );

  return {
    scriptSegments: scriptWithFrames,
    audioPath,
    duration,
  };
}

// ── 节点 3：渲染入队（只推 Redis，秒级返回）─────────

/**
 * 把带帧区间的脚本和音频路径推入 BullMQ 队列，由 Worker 消费渲染。
 * Payload 同时保留 text 字段以兼容旧 jobToSummary。
 */
export async function queueNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.scriptSegments || state.scriptSegments.length === 0) {
    throw new Error('缺少脚本分段');
  }
  if (!state.audioPath) {
    throw new Error('缺少音频路径');
  }

  const queue = getQueue();

  const job = await queue.add('generate-video', {
    text: state.userPrompt,
    script: state.scriptSegments,
    audioPath: state.audioPath,
  });

  return { jobId: String(job.id) };
}
