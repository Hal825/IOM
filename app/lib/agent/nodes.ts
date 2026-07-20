import path from 'node:path';
import crypto from 'node:crypto';
import { type VideoGenStateType, type VideoGenStateUpdate } from './state';
import { generateScript, assignFrames } from '@/lib/tools/script-generator';
import { generateScriptWithAI } from '@/lib/tools/ai-script-generator';
import { matchVisuals } from '@/lib/tools/image-matcher';
import { synthesizeSpeech } from '@/lib/tools/tts';
import { getQueue } from '@/lib/queue';
import { STORAGE_DIR } from '@/lib/tasks';
import { VIDEO_FPS } from '@/lib/types';

// ── 工具函数 ────────────────────────────────────────

function makeTaskId(): string {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

// ── 节点 1：AI 脚本生成（DeepSeek + 规则回退）────────

/**
 * 使用 AI（DeepSeek）生成字幕脚本，失败时自动回退到规则切句。
 * 输出 scriptSegments（帧区间初始为 0，由 ttsNode 回填）。
 */
export async function scriptAiNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const prompt = state.userPrompt;
  if (!prompt?.trim()) {
    throw new Error('用户输入为空');
  }

  const result = await generateScriptWithAI(prompt);

  if (result.scenes.length === 0) {
    throw new Error('AI 脚本生成结果为空');
  }

  console.log(
    `[agent] script_ai → ${result.scenes.length} 个场景 ` +
      `(model: ${result.model}, retries: ${result.retries})`
  );

  return {
    scriptSegments: result.scenes,
    aiModel: result.model,
    retryCount: result.retries,
  };
}

// ── 节点 1b（保留）：规则脚本生成 ────────────────────

/**
 * 纯规则切句（Phase 1 行为，作为显式回退选项保留）。
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

// ── 节点 2：语音合成 + 帧区间回填 ────────────────────

/**
 * 把脚本文本合成为 MP3，用音频时长回填各场景的帧区间。
 * 与 matchVisualNode 并行执行（无依赖关系）。
 */
export async function ttsNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段，请先执行脚本生成');
  }

  const taskId = makeTaskId();
  const audioDir = path.join(STORAGE_DIR, 'audio', taskId);

  const fullText = state.scriptSegments.map((s) => s.text).join('');
  const { audioPath, duration } = await synthesizeSpeech(fullText, audioDir);

  // 用实际音频时长回填帧区间
  const scriptWithFrames = assignFrames(
    state.scriptSegments,
    duration,
    VIDEO_FPS
  );

  console.log(
    `[agent] tts → ${duration.toFixed(1)}s 音频 → ${audioPath}`
  );

  return {
    scriptSegments: scriptWithFrames,
    audioPath,
    duration,
  };
}

// ── 节点 3：画面匹配（Unsplash → Pexels → 纯色）─────

/**
 * 为每个脚本场景匹配画面素材。
 * 与 ttsNode 并行执行（无依赖关系）。
 * 返回的 visuals 不含 duration，由 composeVideoNode 从帧区间回填。
 */
export async function matchVisualNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段，请先执行脚本生成');
  }

  const visuals = await matchVisuals(state.scriptSegments);

  return { visuals };
}

// ── 节点 4：合并结果（同步点）────────────────────────

/**
 * TTS 与画面匹配的同步点。
 * 将帧区间信息回填到 visuals 的 duration 字段，确保两者按 sceneIndex 对齐。
 *
 * 关键：使用 sceneIndex 做 Map 合并，不依赖数组顺序。
 */
export async function composeVideoNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段');
  }
  if (!state.audioPath) {
    throw new Error('缺少音频路径');
  }

  const scenes = state.scriptSegments;
  const visuals = state.visuals ?? [];

  // 按 sceneIndex 建立 visual 查找表，确保对齐（不依赖数组顺序）
  const visualMap = new Map(visuals.map((v) => [v.sceneIndex, v]));

  // 回填 duration：每个场景的展示时长 = (endFrame - startFrame) / fps
  const alignedVisuals = scenes.map((scene, i) => {
    const visual = visualMap.get(i);
    const durationSec =
      (scene.endFrame - scene.startFrame) / VIDEO_FPS;

    if (visual) {
      return { ...visual, duration: durationSec };
    }
    // 极端情况：该场景没有 visual → 生成纯色兜底
    return {
      sceneIndex: i,
      type: 'solid' as const,
      url: `hsl(${(i * 47) % 360}, 55%, 30%)`,
      source: 'solid',
      duration: durationSec,
    };
  });

  console.log(
    `[agent] compose → ${alignedVisuals.length} 个场景已对齐 ` +
      `(音频: ${state.duration?.toFixed(1)}s, ` +
      `画面: ${alignedVisuals.filter((v) => v.type === 'image').length} 图片 + ` +
      `${alignedVisuals.filter((v) => v.type === 'solid').length} 纯色)`
  );

  return { visuals: alignedVisuals };
}

// ── 节点 5：渲染入队 ─────────────────────────────────

/**
 * 把脚本、音频路径、画面素材推入 BullMQ 队列，由 Worker 消费渲染。
 */
export async function queueNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.scriptSegments?.length) {
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
    visuals: state.visuals, // Phase 2: 画面素材
    aiModel: state.aiModel, // 可观测性
  });

  console.log(`[agent] queue → job #${job.id} 已入队`);

  return { jobId: String(job.id) };
}
