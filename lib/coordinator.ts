/**
 * agent 协调器 — 悬浮在图之上的「呈现 + 协商」层（方案 B）。
 *
 * 订阅 Worker 发布的管线事件（Redis pub/sub），按类型转为对话消息：
 *   node 事件 → 确定性卡片 + 可选 LLM 点评 → 追加对话 → 广播 SSE；
 *   gate 事件 → 决策点提问消息 + 置「待回复」标志 → 广播 SSE；
 *   status/error → 系统状态消息 → 广播 SSE。
 * 用户回复（submitReply）→ 追加用户消息 + 反馈落盘 + 清暂停/待回复标志（Worker 放行）。
 *
 * 依赖全部可注入（bus/store/provider/hub/flags），网络层为零的纯逻辑便于单测。
 */
import type { ConversationStore } from './conversations/store';
import { createConversationStore } from './conversations/store';
import type { CommentaryProvider } from './agent/commentary';
import { createCommentaryProvider } from './agent/commentary';
import type { EventBus } from './events/bus';
import { createRedisEventBus } from './events/bus';
import { getSseHub, type SseHub } from './sse/hub';
import { setJobAwaitingReply, setJobPaused } from './pause';
import { saveFeedback } from './log/feedback';
import { newId } from './id';
import {
  eventChannel,
  nodeToCardType,
  GATE_QUESTIONS,
  type PipelineEvent,
  type NodeEvent,
  type GateEvent,
  type ErrorEvent,
  type StatusEvent,
} from './agent/events';
import type {
  ConversationFile,
  NodeCardMessage,
  GateQuestionMessage,
  UserMessage,
  SystemMessage,
} from './conversations/types';

export interface CoordinatorDeps {
  bus: EventBus;
  provider: CommentaryProvider;
  store: ConversationStore;
  hub: SseHub;
  /** 测试注入内存标志；缺省走 Redis（pause.ts） */
  flags?: {
    setAwaiting(jobId: string, v: boolean): Promise<void>;
    setPaused(jobId: string, v: boolean): Promise<void>;
  };
  /** 反馈落盘目录（测试注入临时目录；缺省 storage/feedback） */
  feedbackDir?: string;
}

export interface Coordinator {
  subscribe(jobId: string): Promise<void>;
  unsubscribe(jobId: string): Promise<void>;
  handleEvent(jobId: string, event: PipelineEvent): Promise<void>;
  submitReply(jobId: string, text: string): Promise<ConversationFile>;
}

export function createCoordinator(deps: CoordinatorDeps): Coordinator {
  const flags = deps.flags ?? {
    setAwaiting: setJobAwaitingReply,
    setPaused: setJobPaused,
  };
  const subscriptions = new Map<string, () => void>();

  const handleNodeEvent = async (event: NodeEvent): Promise<void> => {
    const cardType = nodeToCardType(event.nodeName);
    const output = event.output;
    if (!cardType || !output || typeof output !== 'object' || Object.keys(output).length === 0) {
      return; // 无卡片映射或空 output（如暂停门）→ 不渲染
    }
    let comment = '';
    try {
      comment = await deps.provider.comment({ cardType, nodeName: event.nodeName, output });
    } catch {
      /* 点评软失败：卡片照常渲染 */
    }
    const msg: NodeCardMessage = {
      id: newId(),
      jobId: event.jobId,
      role: 'assistant',
      kind: 'card',
      cardType,
      nodeName: event.nodeName,
      payload: output,
      status: 'done',
      createdAt: new Date().toISOString(),
      ...(comment ? { comment } : {}),
    };
    await deps.store.append(event.jobId, msg);
    deps.hub.broadcast(event.jobId, { event: 'card', data: { message: msg } });
  };

  const handleGateEvent = async (event: GateEvent): Promise<void> => {
    const msg: GateQuestionMessage = {
      id: newId(),
      jobId: event.jobId,
      role: 'assistant',
      kind: 'gate',
      gateId: event.gateId,
      stage: event.stage,
      question: GATE_QUESTIONS[event.gateId] ?? `已到「${event.stage}」，继续吗？`,
      awaitingReply: true,
      createdAt: new Date().toISOString(),
    };
    await flags.setAwaiting(event.jobId, true);
    await deps.store.append(event.jobId, msg);
    deps.hub.broadcast(event.jobId, { event: 'gate', data: { message: msg } });
  };

  const handleStatusEvent = async (event: StatusEvent): Promise<void> => {
    const text =
      event.status === 'completed'
        ? '视频生成完成'
        : `任务失败：${event.failedReason ?? '未知错误'}`;
    const msg: SystemMessage = {
      id: newId(),
      jobId: event.jobId,
      role: 'system',
      kind: 'status',
      text,
      createdAt: new Date().toISOString(),
    };
    await deps.store.append(event.jobId, msg);
    deps.hub.broadcast(event.jobId, {
      event: 'status',
      data: { status: event.status, failedReason: event.failedReason, result: event.result },
    });
  };

  const handleErrorEvent = async (event: ErrorEvent): Promise<void> => {
    const msg: SystemMessage = {
      id: newId(),
      jobId: event.jobId,
      role: 'system',
      kind: 'status',
      text: `任务失败：${event.message}`,
      createdAt: new Date().toISOString(),
    };
    await deps.store.append(event.jobId, msg);
    deps.hub.broadcast(event.jobId, {
      event: 'status',
      data: { status: 'failed', failedReason: event.message },
    });
  };

  const handleEvent = async (jobId: string, event: PipelineEvent): Promise<void> => {
    switch (event.type) {
      case 'node':
        return handleNodeEvent(event);
      case 'gate':
        return handleGateEvent(event);
      case 'status':
        return handleStatusEvent(event);
      case 'error':
        return handleErrorEvent(event);
      default:
        return;
    }
  };

  const subscribe = async (jobId: string): Promise<void> => {
    if (subscriptions.has(jobId)) return;
    const unsubscribe = await deps.bus.subscribe(eventChannel(jobId), (raw) => {
      const event = raw as PipelineEvent;
      if (!event || typeof event !== 'object' || event.jobId !== jobId) return;
      void handleEvent(jobId, event).catch((err) => {
        console.error(`[coordinator] handleEvent ${jobId}`, err);
      });
    });
    subscriptions.set(jobId, unsubscribe);
  };

  const unsubscribe = async (jobId: string): Promise<void> => {
    const unsub = subscriptions.get(jobId);
    if (!unsub) return;
    subscriptions.delete(jobId);
    await unsub();
  };

  const submitReply = async (jobId: string, text: string): Promise<ConversationFile> => {
    const existing = await deps.store.read(jobId);
    const now = new Date().toISOString();
    const conv: ConversationFile = existing ?? {
      jobId,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };

    // 找最近一个决策点门 + 其前面最近的卡片（反馈上下文）
    let gateId = '';
    let nodeName = '';
    let cardPayload: Record<string, unknown> = {};
    for (let i = conv.messages.length - 1; i >= 0; i--) {
      const m = conv.messages[i];
      if (m.kind === 'gate') {
        gateId = m.gateId;
        for (let j = i - 1; j >= 0; j--) {
          const card = conv.messages[j];
          if (card.kind === 'card') {
            nodeName = card.nodeName;
            cardPayload = card.payload;
            break;
          }
        }
        break;
      }
    }

    const msg: UserMessage = {
      id: newId(),
      jobId,
      role: 'user',
      kind: 'text',
      text,
      feedback: { gateId, nodeName },
      createdAt: now,
    };
    const updated = await deps.store.append(jobId, msg);
    await saveFeedback(jobId, { gateId, nodeName, userText: text, cardPayload }, deps.feedbackDir);
    await flags.setPaused(jobId, false);
    await flags.setAwaiting(jobId, false);
    deps.hub.broadcast(jobId, { event: 'user', data: { message: msg } });
    deps.hub.broadcast(jobId, { event: 'proceed', data: { gateId, resumedAt: now } });
    return updated;
  };

  return { subscribe, unsubscribe, handleEvent, submitReply };
}

/** API 进程内 coordinator 单例（Next.js dev 热重载用 globalThis 缓存） */
const globalForCoordinator = globalThis as unknown as { __omCoordinator?: Coordinator };
export function getCoordinator(): Coordinator {
  if (!globalForCoordinator.__omCoordinator) {
    globalForCoordinator.__omCoordinator = createCoordinator({
      bus: createRedisEventBus(),
      provider: createCommentaryProvider(),
      store: createConversationStore(),
      hub: getSseHub(),
    });
  }
  return globalForCoordinator.__omCoordinator;
}
