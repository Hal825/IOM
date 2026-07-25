import { Annotation } from '@langchain/langgraph';
import type { ScriptScene, VisualAsset, ResearchReport, Proposal } from '@/lib/types';

/**
 * LangGraph 工作流状态 — Phase 2 扩展字段。
 *
 * 使用 Annotation.Root 定义状态通道，每个字段默认采用 LastValue 策略
 * （最新返回值覆盖旧值）。并发节点修改不同 key 因此不会冲突。
 *
 * _procedureLog 使用自定义 MergeReducer：并行分支（tts ∥ match_visual）
 * 各自修改日志的不同 stage，汇合时深度合并而非覆盖。
 */

// ── _procedureLog 自定义 reducer ─────────────────

/** 判断值是否"有意义"（非空字符串、非零数字、非空数组、非纯默认对象） */
function isMeaningful(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.length > 0;
  if (typeof value === 'number') return value !== 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return true;
}

/**
 * 深度合并两个 ProcedureLog 对象。
 * 策略：对 stages 下的每个阶段做递归合并；
 * 叶子节点优先保留有意义的值（update 覆盖 current 当且仅当 update 有意义）。
 */
function mergeProcedureLogs(current: unknown, update: unknown): unknown {
  if (!isMeaningful(update)) return current;
  if (!isMeaningful(current)) return update;

  if (
    typeof current === 'object' &&
    typeof update === 'object' &&
    !Array.isArray(current) &&
    !Array.isArray(update)
  ) {
    const merged: Record<string, unknown> = { ...(current as Record<string, unknown>) };

    for (const key of Object.keys(update as Record<string, unknown>)) {
      const updateVal = (update as Record<string, unknown>)[key];
      const currentVal = (current as Record<string, unknown>)[key];

      if (key === 'stages') {
        // stages 需要逐阶段合并
        merged[key] = mergeProcedureLogs(currentVal, updateVal);
      } else if (
        typeof updateVal === 'object' &&
        !Array.isArray(updateVal) &&
        updateVal !== null
      ) {
        // 嵌套对象（如 output / input）：递归合并
        merged[key] = mergeProcedureLogs(currentVal, updateVal);
      } else if (isMeaningful(updateVal)) {
        // 叶子节点（字符串/数字/数组）：update 覆盖 current
        merged[key] = updateVal;
      }
      // update 为空 → 保持 current 值不变
    }

    return merged;
  }

  return update;
}

// ── 状态定义 ─────────────────────────────────────

export const VideoGenState = Annotation.Root({
  // === 输入 ===
  userPrompt: Annotation<string>,
  /** 脚本风格（可选，透传给 LLM） */
  style: Annotation<string>,

  // === Phase 3: 调研 & 提案 ===
  /** 调研报告：文本分析结果（research 节点输出） */
  researchReport: Annotation<ResearchReport | null>,
  /** 制作提案：分镜脚本和风格指南（proposal 节点输出） */
  proposal: Annotation<Proposal | null>,

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

  // === 可观测性日志 ===
  /**
   * 全流程日志对象（ProcedureLog），随节点流转更新。
   *
   * 使用自定义 MergeReducer：并行分支（tts ∥ match_visual）各自修改
   * 日志的不同 stage 后，在 compose_video 汇合时深度合并，而非覆盖。
   * 叶子节点规则：update 有值 → 覆盖；update 为空 → 保留 current。
   */
  _procedureLog: Annotation<unknown>({
    reducer: mergeProcedureLogs,
    default: () => null,
  }),
});

/** 状态类型（供节点函数签名使用） */
export type VideoGenStateType = typeof VideoGenState.State;
/** 状态更新类型（供节点函数返回值使用） */
export type VideoGenStateUpdate = typeof VideoGenState.Update;
