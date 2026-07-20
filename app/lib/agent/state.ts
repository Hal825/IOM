import { Annotation } from '@langchain/langgraph';
import type { ScriptScene, VisualAsset } from '@/lib/types';

/**
 * LangGraph 工作流状态 — Phase 2 扩展字段。
 *
 * 使用 Annotation.Root 定义状态通道，每个字段默认采用 LastValue 策略
 * （最新返回值覆盖旧值）。并发节点修改不同 key 因此不会冲突。
 */
export const VideoGenState = Annotation.Root({
  // === 输入 ===
  userPrompt: Annotation<string>,
  /** 脚本风格（可选，透传给 LLM） */
  style: Annotation<string>,

  // === 中间产物 ===
  /** 切分后的字幕场景列表（TTS 前不含帧区间，TTS 后由 assignFrames 回填） */
  scriptSegments: Annotation<ScriptScene[]>,
  /** TTS 合成的音频文件绝对路径 */
  audioPath: Annotation<string>,
  /** 音频时长（秒） */
  duration: Annotation<number>,

  // === Phase 2: 画面素材 ===
  /** 每个场景匹配的画面素材列表 */
  visuals: Annotation<VisualAsset[]>,

  // === 渲染入队结果 ===
  jobId: Annotation<string>,

  // === 可观测性 ===
  /** 使用的 AI 模型名称 */
  aiModel: Annotation<string>,
  /** AI 调用重试次数 */
  retryCount: Annotation<number>,
  /** 错误信息 */
  error: Annotation<string>,
});

/** 状态类型（供节点函数签名使用） */
export type VideoGenStateType = typeof VideoGenState.State;
/** 状态更新类型（供节点函数返回值使用） */
export type VideoGenStateUpdate = typeof VideoGenState.Update;
