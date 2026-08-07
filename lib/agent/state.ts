import { Annotation } from '@langchain/langgraph';
import type { ResearchReport, Proposal, VideoScript, SceneVideoSpec, AssetManifest } from '@/lib/types';

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
  /** generating=生成中 / done=真实视频已生成 / failed=失败 / received=脚本已交接（未真正生成） */
  status: 'generating' | 'done' | 'failed' | 'received';
}

// ── LangGraph 状态定义 ──────────────────────────────

export const VideoGenState = Annotation.Root({
  // === 输入 ===
  userPrompt: Annotation<string>,
  style: Annotation<string>,

  // === 重跑 ===
  /** 重跑起点节点（如 'script_generation'）；缺省 = 正常全跑。上游节点因产出已存在而跳过。 */
  rerunFrom: Annotation<string | undefined>,

  // === 调研 & 提案 ===
  researchReport: Annotation<ResearchReport | null>,
  proposal: Annotation<Proposal | null>,

  // === 脚本生成 ===
  videoScript: Annotation<VideoScript | null>,

  // === 素材生成 ===
  /** 素材清单（asset_gen 节点输出，含角色四视图 + 场景图 + sceneId→ref 映射） */
  assetManifest: Annotation<AssetManifest | null>,

  // === 单镜头视频生成完整规格（scene_json_assembler 节点输出）===
  /** 每镜头的完整视频生成 JSON（含素材/音频产物），可直接交付视频引擎 */
  sceneSpecs: Annotation<SceneVideoSpec[]>({
    reducer: (_current: SceneVideoSpec[], update: SceneVideoSpec[]): SceneVideoSpec[] =>
      update ?? [],
    default: () => [],
  }),

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
});

export type VideoGenStateType = typeof VideoGenState.State;
export type VideoGenStateUpdate = typeof VideoGenState.Update;