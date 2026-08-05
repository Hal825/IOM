/**
 * 对话消息模型 — agent 与用户在单个任务（=一条对话线程）内的全部消息。
 * 由 API 进程的 coordinator 维护（追加写入 + 广播），前端按 kind 渲染。
 */

/** 节点结果卡片类型（对应前端渲染组件） */
export type CardType =
  | 'research'
  | 'proposal'
  | 'script'
  | 'assets'
  | 'audio'
  | 'scenes'
  | 'shots'
  | 'video';

interface BaseMsg {
  id: string;
  jobId: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
}

/** 节点结果卡（assistant 消息，确定性卡片 + 可选 LLM 点评） */
export interface NodeCardMessage extends BaseMsg {
  role: 'assistant';
  kind: 'card';
  cardType: CardType;
  /** LangGraph 节点名（research / generate_proposal / …） */
  nodeName: string;
  /** 节点 update 的非空 output（Partial state），前端按 cardType 渲染 */
  payload: Record<string, unknown>;
  /** LLM 一句话中文点评（可选，失败/未启用时省略，卡片照常渲染） */
  comment?: string;
  status: 'done' | 'failed';
}

/** 决策点提问（assistant 消息，等用户回复） */
export interface GateQuestionMessage extends BaseMsg {
  role: 'assistant';
  kind: 'gate';
  gateId: string;
  /** 人类可读阶段名（如「调研完成」） */
  stage: string;
  question: string;
  awaitingReply: true;
}

/** 用户消息（回复决策点 / 追加对话） */
export interface UserMessage extends BaseMsg {
  role: 'user';
  kind: 'text';
  text: string;
  /** 回复决策点时的反馈上下文（完整 cardPayload 记入 feedback 文件，不重复塞进对话） */
  feedback: {
    gateId: string;
    nodeName: string;
  };
}

/** 系统状态消息（完成/失败/提示） */
export interface SystemMessage extends BaseMsg {
  role: 'system';
  kind: 'status';
  text: string;
}

export type ConversationMessage =
  | NodeCardMessage
  | GateQuestionMessage
  | UserMessage
  | SystemMessage;

/** 单个任务的对话线程文件（storage/conversations/{jobId}/conversation.json） */
export interface ConversationFile {
  jobId: string;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
}
