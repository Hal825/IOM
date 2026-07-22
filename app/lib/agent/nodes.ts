import path from 'node:path';
import crypto from 'node:crypto';
import { type VideoGenStateType, type VideoGenStateUpdate } from './state';
import { generateScript, assignFrames } from '@/lib/tools/script-generator';
import { generateScriptWithAI } from '@/lib/tools/ai-script-generator';
import { matchVisualsWithDetail } from '@/lib/tools/image-matcher';
import { synthesizeSpeech } from '@/lib/tools/tts';
import { getQueue } from '@/lib/queue';
import { STORAGE_DIR } from '@/lib/tasks';
import { VIDEO_FPS } from '@/lib/types';
import {
  type ProcedureLog,
  createProcedureLog,
  saveProcedureLog,
} from '@/lib/log/procedure';

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
  const start = Date.now();
  const prompt = state.userPrompt;
  if (!prompt?.trim()) {
    throw new Error('用户输入为空');
  }

  // 初始化日志（若尚未创建）
  const log: ProcedureLog =
    (state._procedureLog as ProcedureLog | null) ??
    createProcedureLog(state.jobId || 'unknown');
  log.stages.script_ai.input.userPrompt = prompt;

  try {
    const result = await generateScriptWithAI(prompt);

    if (result.scenes.length === 0) {
      throw new Error('AI 脚本生成结果为空');
    }

    log.stages.script_ai.output = {
      scenes: result.scenes,
      model: result.model,
      retries: result.retries,
      tokenUsage: result.tokenUsage,
    };

    console.log(
      `[agent] script_ai → ${result.scenes.length} 个场景 ` +
        `(model: ${result.model}, retries: ${result.retries})`
    );

    return {
      scriptSegments: result.scenes,
      aiModel: result.model,
      retryCount: result.retries,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.stages.script_ai.error = message;
    throw err;
  } finally {
    log.stages.script_ai.durationMs = Date.now() - start;
  }
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
  const start = Date.now();
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段，请先执行脚本生成');
  }

  const log = state._procedureLog as ProcedureLog | null;
  if (log) {
    log.stages.tts.input.scriptSegments = state.scriptSegments.map((s) => ({
      text: s.text,
    }));
  }

  try {
    const taskId = makeTaskId();
    const audioDir = path.join(STORAGE_DIR, 'audio', taskId);

    const fullText = state.scriptSegments.map((s) => s.text).join('');
    const { audioPath, duration } = await synthesizeSpeech(fullText, audioDir);

    const scriptWithFrames = assignFrames(
      state.scriptSegments,
      duration,
      VIDEO_FPS
    );

    if (log) {
      log.stages.tts.output = {
        audioPath,
        durationSec: duration,
      };
    }

    console.log(
      `[agent] tts → ${duration.toFixed(1)}s 音频 → ${audioPath}`
    );

    return {
      scriptSegments: scriptWithFrames,
      audioPath,
      duration,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.tts.error = message;
    throw err;
  } finally {
    if (log) log.stages.tts.durationMs = Date.now() - start;
  }
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
  const start = Date.now();
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段，请先执行脚本生成');
  }

  const log = state._procedureLog as ProcedureLog | null;
  if (log) {
    log.stages.match_visual.input.scenes = state.scriptSegments.map((s) => ({
      text: s.text,
    }));
  }

  try {
    const { visuals, tokenUsage, keywordDetails } =
      await matchVisualsWithDetail(state.scriptSegments);

    if (log) {
      log.stages.match_visual.output = {
        visuals: visuals.map((v) => ({
          sceneIndex: v.sceneIndex,
          type: v.type,
          source: v.source,
          url: v.url,
          photographer: v.photographer,
          duration: v.duration,
        })),
        stats: {
          total: visuals.length,
          unsplash: visuals.filter((v) => v.source === 'unsplash').length,
          pexels: visuals.filter((v) => v.source === 'pexels').length,
          solid: visuals.filter((v) => v.source === 'solid').length,
        },
        keywordExtraction: keywordDetails,
        tokenUsage,
      };
    }

    return { visuals, _procedureLog: log };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.match_visual.error = message;
    throw err;
  } finally {
    if (log) log.stages.match_visual.durationMs = Date.now() - start;
  }
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
  const start = Date.now();
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段');
  }
  if (!state.audioPath) {
    throw new Error('缺少音频路径');
  }

  const scenes = state.scriptSegments;
  const visuals = state.visuals ?? [];

  const log = state._procedureLog as ProcedureLog | null;
  if (log) {
    log.stages.compose_video.input = {
      scenes: scenes.map((s) => ({
        text: s.text,
        startFrame: s.startFrame,
        endFrame: s.endFrame,
      })),
      visuals: visuals.map((v) => ({
        sceneIndex: v.sceneIndex,
        duration: v.duration,
      })),
    };
  }

  try {
    const visualMap = new Map(visuals.map((v) => [v.sceneIndex, v]));

    const alignedVisuals = scenes.map((scene, i) => {
      const visual = visualMap.get(i);
      const durationSec =
        (scene.endFrame - scene.startFrame) / VIDEO_FPS;

      if (visual) {
        return { ...visual, duration: durationSec };
      }
      return {
        sceneIndex: i,
        type: 'solid' as const,
        url: `hsl(${(i * 47) % 360}, 55%, 30%)`,
        source: 'solid',
        duration: durationSec,
      };
    });

    if (log) {
      log.stages.compose_video.output = {
        visuals: alignedVisuals.map((v) => ({
          sceneIndex: v.sceneIndex,
          type: v.type,
          source: v.source,
          url: v.url,
          photographer: v.photographer,
          duration: v.duration,
        })),
      };
    }

    console.log(
      `[agent] compose → ${alignedVisuals.length} 个场景已对齐 ` +
        `(音频: ${state.duration?.toFixed(1)}s, ` +
        `画面: ${alignedVisuals.filter((v) => v.type === 'image').length} 图片 + ` +
        `${alignedVisuals.filter((v) => v.type === 'solid').length} 纯色)`
    );

    return { visuals: alignedVisuals, _procedureLog: log };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.compose_video.error = message;
    throw err;
  } finally {
    if (log) log.stages.compose_video.durationMs = Date.now() - start;
  }
}

// ── 节点 5：渲染入队 ─────────────────────────────────

/**
 * 把脚本、音频路径、画面素材推入 BullMQ 队列，由 Worker 消费渲染。
 */
export async function queueNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  if (!state.scriptSegments?.length) {
    throw new Error('缺少脚本分段');
  }
  if (!state.audioPath) {
    throw new Error('缺少音频路径');
  }

  const log = state._procedureLog as ProcedureLog | null;

  const jobData = {
    text: state.userPrompt,
    script: state.scriptSegments,
    audioPath: state.audioPath,
    visuals: state.visuals,
    aiModel: state.aiModel,
  };

  if (log) {
    log.stages.queue.input.jobData = jobData;
  }

  try {
    const queue = getQueue();
    const job = await queue.add('generate-video', jobData);

    const jobId = String(job.id);

    if (log) {
      log.stages.queue.output.jobId = jobId;
      log.jobId = jobId;
      // 入队后立即保存日志（不包含 render 阶段）
      await saveProcedureLog(log, jobId);
    }

    console.log(`[agent] queue → job #${jobId} 已入队`);

    return { jobId, _procedureLog: log };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.queue.error = message;
    throw err;
  } finally {
    if (log) log.stages.queue.durationMs = Date.now() - start;
  }
}
