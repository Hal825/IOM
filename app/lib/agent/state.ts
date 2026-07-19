import { Annotation } from '@langchain/langgraph';
import type { ScriptScene } from '@/lib/types';

/**
 * LangGraph 工作流状态 — 第一期纯确定性节点，不使用 MessagesAnnotation。
 *
 * 使用 Annotation.Root 定义状态通道，每个字段默认采用 LastValue 策略
 * （最新返回值覆盖旧值），符合线性流水线的语义。
 */
export const VideoGenState = Annotation.Root({
  // === 输入 ===
  userPrompt: Annotation<string>,

  // === 中间产物（对应 orchestrator 的产出） ===
  /** 切分后的字幕场景列表（TTS 前不含帧区间，TTS 后由 assignFrames 回填） */
  scriptSegments: Annotation<ScriptScene[]>,
  /** TTS 合成的音频文件绝对路径 */
  audioPath: Annotation<string>,
  /** 音频时长（秒） */
  duration: Annotation<number>,

  // === 渲染入队结果 ===
  jobId: Annotation<string>,

  // === 状态追踪 ===
  error: Annotation<string>,
});

/** 状态类型（供节点函数签名使用） */
export type VideoGenStateType = typeof VideoGenState.State;
/** 状态更新类型（供节点函数返回值使用） */
export type VideoGenStateUpdate = typeof VideoGenState.Update;
