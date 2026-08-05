/**
 * 管线事件模型 — Worker 纯执行者与 API 进程 agent 协调器之间的契约。
 * Worker 逐节点发布原始事件到 Redis pub/sub；协调器订阅后决定呈现。
 */
import type { CardType } from '@/lib/conversations/types';
import { createRedisEventBus } from '@/lib/events/bus';
import { getRedisConnection } from '@/lib/queue';

/** 节点事件：LangGraph 某节点产生非空 output */
export interface NodeEvent {
  type: 'node';
  jobId: string;
  nodeName: string;
  /** 节点 update 的非空 output（Partial state） */
  output: Record<string, unknown>;
  seq: number;
}

/** 决策点事件：管线已停在暂停门，等用户回复 */
export interface GateEvent {
  type: 'gate';
  jobId: string;
  gateId: string;
  /** 人类可读阶段名（如「调研完成」） */
  stage: string;
  seq: number;
}

/** 管线错误事件（图内抛错时发布，随后任务失败） */
export interface ErrorEvent {
  type: 'error';
  jobId: string;
  message: string;
  seq: number;
}

/** 任务状态事件（Worker 收尾时发布） */
export interface StatusEvent {
  type: 'status';
  jobId: string;
  status: 'completed' | 'failed';
  result?: { videoPath: string; durationSec: number };
  failedReason?: string;
  seq: number;
}

export type PipelineEvent = NodeEvent | GateEvent | ErrorEvent | StatusEvent;

/** Redis pub/sub 通道：om:events:<jobId> */
export const eventChannel = (jobId: string): string => `om:events:${jobId}`;
const seqKey = (jobId: string): string => `om:evseq:${jobId}`;

/** 取下一个事件序号（Redis INCR，Worker 跨模块共享） */
export async function nextEventSeq(jobId: string): Promise<number> {
  return getRedisConnection().incr(seqKey(jobId));
}

const bus = createRedisEventBus();

/** Worker 发布管线事件（自动补 jobId + 单调 seq）；参数按 type 判别保留各事件字段 */
export async function publishPipelineEvent(
  jobId: string,
  event:
    | Omit<NodeEvent, 'jobId' | 'seq'>
    | Omit<GateEvent, 'jobId' | 'seq'>
    | Omit<ErrorEvent, 'jobId' | 'seq'>
    | Omit<StatusEvent, 'jobId' | 'seq'>
): Promise<void> {
  const seq = await nextEventSeq(jobId);
  const full = { ...event, jobId, seq };
  await bus.publish(eventChannel(jobId), full as unknown as PipelineEvent);
}

/** 节点名 → 卡片类型（无卡片映射的节点返回 null，如暂停门） */
const NODE_CARD_MAP: Record<string, CardType> = {
  research: 'research',
  generate_proposal: 'proposal',
  script_generation: 'script',
  asset_gen: 'assets',
  tts: 'audio',
  scene_json_assembler: 'scenes',
  shot_video_gen: 'shots',
  video_merge: 'video',
};

export function nodeToCardType(nodeName: string): CardType | null {
  return NODE_CARD_MAP[nodeName] ?? null;
}

/** 4 个决策点暂停门 → 人类可读阶段名 */
export const GATE_STAGES: Record<string, string> = {
  pause_gate_1: '调研完成',
  pause_gate_2: '脚本就绪',
  pause_gate_3: '场景规格已组装',
  pause_gate_4: '镜头已生成',
};

/** 4 个决策点暂停门 → 提问文案（M2 模板，M3 可 LLM 润色） */
export const GATE_QUESTIONS: Record<string, string> = {
  pause_gate_1: '已确认需求，开始设计提案？',
  pause_gate_2: '提案与脚本就绪，开始生成素材与配音？',
  pause_gate_3: '场景规格已组装，开始逐镜头生成视频？',
  pause_gate_4: '镜头已全部生成，确认开始拼接？',
};

/** 流水线节点顺序（前端 pipeline 组件按真实节点事件逐节点着色） */
export const NODE_SEQUENCE: ReadonlyArray<{ node: string; cardType: CardType | null }> = [
  { node: 'research', cardType: 'research' },
  { node: 'generate_proposal', cardType: 'proposal' },
  { node: 'script_generation', cardType: 'script' },
  { node: 'asset_gen', cardType: 'assets' },
  { node: 'tts', cardType: 'audio' },
  { node: 'scene_json_assembler', cardType: 'scenes' },
  { node: 'shot_video_gen', cardType: 'shots' },
  { node: 'video_merge', cardType: 'video' },
];
