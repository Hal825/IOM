import { Annotation } from '@langchain/langgraph';
import type { ResearchReport, Proposal, AssetManifest } from '@/lib/types';

/**
 * LangGraph 工作流状态。
 *
 * 使用 Annotation.Root 定义状态通道，每个字段默认采用 LastValue 策略
 * （最新返回值覆盖旧值）。
 */

export const VideoGenState = Annotation.Root({
  // === 输入 ===
  userPrompt: Annotation<string>,
  /** 脚本风格（可选，透传给 LLM） */
  style: Annotation<string>,

  // === 调研 & 提案 ===
  /** 调研报告：文本分析结果（research 节点输出） */
  researchReport: Annotation<ResearchReport | null>,
  /** 制作提案：分镜脚本和风格指南（proposal 节点输出） */
  proposal: Annotation<Proposal | null>,

  // === 素材生成 ===
  /** 素材清单：角色视图 + 场景背景（asset_gen 节点输出） */
  assetManifest: Annotation<AssetManifest | null>,

  // === 语音合成 ===
  /** TTS 语音文件路径或 URL（tts 节点输出） */
  audioUrl: Annotation<string>,
  /** 语音时长（秒） */
  audioDuration: Annotation<number>,

  // === 视频生成 ===
  /** 最终视频 URL 或路径（video_gen 节点输出） */
  videoUrl: Annotation<string>,
  /** 视频时长（秒） */
  durationSec: Annotation<number>,
  /** 视频生成状态 */
  videoGenStatus: Annotation<string>,

  // === BullMQ 入队结果 ===
  jobId: Annotation<string>,

  // === 可观测性 ===
  /** 错误信息 */
  error: Annotation<string>,
  /** 全流程日志对象（ProcedureLog），随节点流转更新 */
  _procedureLog: Annotation<unknown>({
    reducer: (_current: unknown, update: unknown) => {
      // 深度合并 procedureLog（与旧版兼容）
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

/** 状态类型（供节点函数签名使用） */
export type VideoGenStateType = typeof VideoGenState.State;
/** 状态更新类型（供节点函数返回值使用） */
export type VideoGenStateUpdate = typeof VideoGenState.Update;
