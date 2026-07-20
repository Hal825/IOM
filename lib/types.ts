/**
 * 公共类型定义 — 前端、API、Worker 共用
 */

/** 队列名称（Queue 与 Worker 必须一致） */
// export const QUEUE_NAME = 'video-generation';
export const QUEUE_NAME = 'video-generation';

/** 提交到队列的任务数据 */
export interface TaskData {
  /** 用户输入的原始文本 */
  text: string;
  /**
   * LangGraph 模式下预计算好的字幕脚本（含帧区间）。
   * 如果存在，Worker 可跳过脚本生成阶段直接渲染。
   */
  script?: ScriptScene[];
  /**
   * LangGraph 模式下预合成的 TTS 音频绝对路径。
   * 如果存在，Worker 可跳过 TTS 阶段直接渲染。
   */
  audioPath?: string;
  /** Phase 2: 画面素材列表（与脚本场景一一对应） */
  visuals?: VisualAsset[];
  /** Phase 2: 使用的 AI 模型名称（可观测性） */
  aiModel?: string;
}

/** 脚本场景：一条字幕及其在视频中的帧区间 */
export interface ScriptScene {
  text: string;//字幕文本
  startFrame: number;//字幕开始帧
  endFrame: number;//字幕结束帧
}

/** 任务完成后的返回值（存于 BullMQ job.returnvalue） */
export interface TaskResult {
  /** 最终 MP4 相对 storage/ 的路径，如 output/12.mp4 */
  videoPath: string;
  /** TTS 音频相对 storage/ 的路径，如 audio/12.mp3 */
  audioPath: string;
  /** 带帧区间的字幕脚本 */
  script: ScriptScene[];
}

/** 任务阶段（映射 progress 百分比：pending=0, script=10, speech=30, render=50, done=100） */
export type TaskStage =
  | 'pending'
  | 'generating_script'
  | 'synthesizing_speech'
  | 'rendering_video'
  | 'done'
  | 'failed';

/** API 返回给前端的任务摘要 */
export interface TaskSummary {
  id: string;
  /** BullMQ job state: waiting | active | completed | failed | delayed | ... */
  status: string;
  /** 0-100 */
  progress: number;
  /** 输入文本（截断展示用） */
  text: string;
  createdAt: number;
  result?: TaskResult;
  failedReason?: string;
}

// ── Phase 2: 画面素材 ──────────────────────────────

/** 画面素材类型 */
export type VisualType = 'image' | 'solid';

/** 画面素材：为每个场景匹配的视觉资源 */
export interface VisualAsset {
  /** 对应的场景索引（从 0 开始） */
  sceneIndex: number;
  /** 素材类型 */
  type: VisualType;
  /** 图片 URL（type === 'image' 时有效） */
  url: string;
  /** 图片来源（用于署名，如 'unsplash', 'pexels', 'solid'） */
  source: string;
  /** 摄影师/作者名（用于署名，可选） */
  photographer?: string;
  /** 该画面展示时长（秒），等于对应场景的时长 */
  duration: number;
}

// ── 视频渲染参数 ────────────────────────────────────

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;

/** Remotion composition 的 inputProps */
export interface VideoCompositionProps {
  script: ScriptScene[];
  /** 音频文件的可访问 URL 或绝对路径 */
  audioUrl: string;
  /** Phase 2: 每个场景的背景画面素材（与 script 一一对应） */
  visuals?: VisualAsset[];
  [key: string]: unknown;
}
