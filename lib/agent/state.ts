import { Annotation } from '@langchain/langgraph';
import type { ResearchReport, Proposal, VideoScript, AssetManifest } from '@/lib/types';

// ── 新增辅助类型 ────────────────────────────────────

/** 单个镜头的音频片段 */
export interface SceneAudioSegment {
  sceneId: string;
  audioUrl: string;
  durationSec: number;
}

/** 单个镜头的视频生成结果 */
export interface SceneVideoResult {
  sceneId: string;
  videoUrl: string;
  durationSec: number;
  status: 'generating' | 'done' | 'failed';
}

// ── LangGraph 状态定义 ──────────────────────────────

export const VideoGenState = Annotation.Root({
  // === 输入 ===
  userPrompt: Annotation<string>,
  style: Annotation<string>,

  // === 调研 & 提案 ===
  researchReport: Annotation<ResearchReport | null>,
  proposal: Annotation<Proposal | null>,

  // === 脚本生成 ===
  videoScript: Annotation<VideoScript | null>,

  // === 素材生成 ===
  assetManifest: Annotation<AssetManifest | null>,

  // === 视频输出 ===
  /** 最终视频时长（秒），由 video_merge 节点写入 */
  durationSec: Annotation<number>,

  // === 分段音频 ===
  /** 每个镜头的音频片段列表（tts 节点输出） */
  audioSegments: Annotation<SceneAudioSegment[]>({
    reducer: (_current: SceneAudioSegment[], update: SceneAudioSegment[]): SceneAudioSegment[] =>
      update ?? [],
    default: () => [],
  }),

  // === 分段视频 ===
  /** 每个镜头的视频片段列表（shot_video_gen 节点输出），按 sceneId 合并 */
  sceneVideos: Annotation<SceneVideoResult[]>({
    reducer: (
      current: SceneVideoResult[],
      update: SceneVideoResult[] | SceneVideoResult
    ): SceneVideoResult[] => {
      const list = current ?? [];
      if (!update) return list;
      const items = Array.isArray(update) ? update : [update];
      const merged = new Map(list.map((s) => [s.sceneId, s]));
      for (const item of items) {
        if (item?.sceneId) merged.set(item.sceneId, item);
      }
      return Array.from(merged.values());
    },
    default: () => [],
  }),

  // === 最终输出 ===
  /** FFmpeg 拼接后的最终视频路径 */
  mergedVideoUrl: Annotation<string | null>({
    reducer: (_current: string | null, update: string | null): string | null => update ?? null,
    default: () => null,
  }),
  /** 拼接日志 */
  mergeLog: Annotation<string | null>({
    reducer: (_current: string | null, update: string | null): string | null => update ?? null,
    default: () => null,
  }),

  // === 脚本文本快照 ===
  /** script_generation 输出关键文本的 JSON 快照 */
  scriptTextSnapshot: Annotation<string | null>({
    reducer: (_current: string | null, update: string | null): string | null => update ?? null,
    default: () => null,
  }),

  // === BullMQ ===
  jobId: Annotation<string>,

  // === 可观测性 ===
  error: Annotation<string>,
  _procedureLog: Annotation<unknown>({
    reducer: (_current: unknown, update: unknown) => {
      if (!update) return _current;
      if (!_current) return update;
      if (
        typeof _current === 'object' &&
        typeof update === 'object' &&
        !Array.isArray(_current) &&
        !Array.isArray(update)
      ) {
        const merged: Record<string, unknown> = {
          ...(_current as Record<string, unknown>),
        };
        for (const key of Object.keys(update as Record<string, unknown>)) {
          const updateVal = (update as Record<string, unknown>)[key];
          if (updateVal !== null && updateVal !== undefined) {
            if (
              key === 'stages' &&
              typeof merged[key] === 'object' &&
              typeof updateVal === 'object'
            ) {
              merged[key] = {
                ...((merged[key] as Record<string, unknown>) ?? {}),
                ...((updateVal as Record<string, unknown>) ?? {}),
              };
            } else {
              merged[key] = updateVal;
            }
          }
        }
        return merged;
      }
      return update;
    },
    default: () => null,
  }),
});

export type VideoGenStateType = typeof VideoGenState.State;
export type VideoGenStateUpdate = typeof VideoGenState.Update;