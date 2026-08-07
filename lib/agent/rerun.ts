/**
 * 重跑节点工具 — 从节点 X 重跑（X 及之后重新生成，上游保留）。
 *
 * 复用同一张全图：以「上游产出 + rerunFrom」为初始状态跑 videoGraph，上游节点因产出已存在而跳过。
 * 本文件只放纯函数（可单测）：节点/门位置表 + 门是否提问 + 从对话消息重建重跑初始状态。
 */
import type { ConversationMessage } from '@/lib/conversations/types';

/** 节点在管线中的逻辑位置（并行兄弟同位；数值越大越靠后） */
export const NODE_POSITION: Record<string, number> = {
  research: 0,
  generate_proposal: 1,
  script_generation: 2,
  asset_gen: 3,
  tts: 3, // 与 asset_gen 并行，同位
  scene_json_assembler: 4,
  shot_video_gen: 5,
  video_merge: 6,
};

/** 暂停门位置（位于相邻节点之间） */
export const GATE_POSITION: Record<string, number> = {
  pause_gate_1: 0.5,
  pause_gate_2: 2.5,
  pause_gate_3: 4.5,
  pause_gate_4: 5.5,
};

/** 节点中文名（重跑标记消息用） */
export const NODE_LABELS: Record<string, string> = {
  research: '调研',
  generate_proposal: '提案',
  script_generation: '脚本',
  asset_gen: '素材',
  tts: '配音',
  scene_json_assembler: '组装',
  shot_video_gen: '逐镜头视频',
  video_merge: '拼接',
};

/** 可重跑的节点（全部 8 个生产节点） */
export const RERUNNABLE_NODES = Object.keys(NODE_POSITION);

/**
 * 暂停门在重跑中是否应提问：
 * 无 rerunFrom → 全问；rerunFrom 位置 <= 门位置 → 问（上游门跳过，避免重复确认）。
 * 未知节点/门 → 保守提问。
 */
export function shouldFireGate(gateId: string, rerunFrom?: string): boolean {
  if (!rerunFrom) return true;
  const rp = NODE_POSITION[rerunFrom];
  const gp = GATE_POSITION[gateId];
  if (rp === undefined || gp === undefined) return true;
  return rp <= gp;
}

/**
 * 从对话消息重建重跑初始状态：
 * 保留 position < X 的卡（上游）+ 与 X 同位置的非 X 兄弟卡（并行分支保留，如 asset_gen 重跑保留 tts）；
 * X 及下游丢弃。后到覆盖先到（最新胜，支持连续重跑时取到最新上游）。
 */
export function buildResumeState(
  messages: ConversationMessage[],
  rerunFrom: string
): Record<string, unknown> {
  const rp = NODE_POSITION[rerunFrom];
  const state: Record<string, unknown> = {};
  if (rp === undefined) return state;
  for (const m of messages) {
    // card（旧对话）与 agent（新 NL 消息）都携带 nodeName + payload
    if (m.kind !== 'card' && m.kind !== 'agent') continue;
    const p = NODE_POSITION[m.nodeName];
    if (p === undefined) continue;
    if (p < rp || (p === rp && m.nodeName !== rerunFrom)) {
      Object.assign(state, m.payload);
    }
  }
  return state;
}
