/**
 * 前端共用的任务 API 客户端。
 * 统一从非 2xx 响应中提取服务端 `{ error }` 消息，避免各组件重复样板代码。
 */
import type { TaskSummary } from '@/lib/types';
import type {
  ConversationFile,
  NodeCardMessage,
  GateQuestionMessage,
  UserMessage,
} from '@/lib/conversations/types';

async function toError(res: Response, fallback: string): Promise<Error> {
  const body = await res.text().catch(() => '');
  let message = `HTTP ${res.status}`;
  try {
    const parsed = JSON.parse(body) as { error?: unknown };
    if (typeof parsed.error === 'string' && parsed.error.length > 0) {
      message = parsed.error;
    }
  } catch {
    /* 非 JSON 响应（如 HTML 报错页），保留 HTTP 状态文案 */
  }
  return new Error(message || fallback);
}

/** 拉取最近的任务列表（最多 50 条，新→旧）。Redis 不可用时抛错。 */
export async function listTasks(): Promise<TaskSummary[]> {
  const res = await fetch('/api/tasks', { cache: 'no-store' });
  if (!res.ok) throw await toError(res, '获取任务列表失败');
  const data = (await res.json()) as { tasks: TaskSummary[] };
  return data.tasks;
}

/** 提交文本创建视频生成任务，返回队列分配的 jobId。 */
export async function createTask(
  text: string
): Promise<{ id: string; status: string }> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw await toError(res, '提交失败');
  return (await res.json()) as { id: string; status: string };
}

/** 删除任务：移除记录 + 清理该任务产物。 */
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await toError(res, '删除失败');
}

/** 逐任务暂停 / 恢复。 */
export async function setTaskPaused(id: string, paused: boolean): Promise<void> {
  const res = await fetch(`/api/tasks/${id}/pause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paused }),
  });
  if (!res.ok) throw await toError(res, paused ? '暂停失败' : '恢复失败');
}

// ── 对话 / 流式（human-in-loop）────────────────────────

export interface TaskStreamHandlers {
  /** 连接/重连时重放既有对话历史 */
  onHello?(conversation: ConversationFile): void;
  onCard?(message: NodeCardMessage): void;
  onGate?(message: GateQuestionMessage): void;
  onUser?(message: UserMessage): void;
  onProceed?(data: { gateId: string; resumedAt: string }): void;
  onStatus?(data: { status: string; failedReason?: string }): void;
}

/**
 * 打开任务 SSE 流（EventSource 自动重连），返回关闭函数。
 * 事件 payload 均为 JSON；hello 事件负责重连恢复。
 */
export function openTaskStream(id: string, handlers: TaskStreamHandlers): () => void {
  const es = new EventSource(`/api/tasks/${id}/stream`);
  const on = (event: string, fn?: (data: unknown) => void) => {
    if (!fn) return;
    es.addEventListener(event, (e) => {
      try {
        fn(JSON.parse((e as MessageEvent).data));
      } catch {
        /* 忽略坏帧（如连接级 error 空数据） */
      }
    });
  };
  on('hello', (d) => handlers.onHello?.((d as { conversation: ConversationFile }).conversation));
  on('card', (d) => handlers.onCard?.((d as { message: NodeCardMessage }).message));
  on('gate', (d) => handlers.onGate?.((d as { message: GateQuestionMessage }).message));
  on('user', (d) => handlers.onUser?.((d as { message: UserMessage }).message));
  on('proceed', (d) => handlers.onProceed?.(d as { gateId: string; resumedAt: string }));
  on('status', (d) =>
    handlers.onStatus?.(
      d as { status: string; failedReason?: string }
    )
  );
  return () => es.close();
}

/** 回复决策点：{ text } → 追加用户消息 + 反馈落盘 + 清标志放行。 */
export async function replyToTask(id: string, text: string): Promise<ConversationFile> {
  const res = await fetch(`/api/tasks/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw await toError(res, '回复失败');
  const data = (await res.json()) as { conversation: ConversationFile };
  return data.conversation;
}

/** 拉取任务对话历史（初始加载 / 轮询兜底）。 */
export async function fetchConversation(id: string): Promise<ConversationFile | null> {
  const res = await fetch(`/api/tasks/${id}/conversation`, { cache: 'no-store' });
  if (!res.ok) throw await toError(res, '获取对话失败');
  const data = (await res.json()) as { conversation: ConversationFile | null };
  return data.conversation;
}
