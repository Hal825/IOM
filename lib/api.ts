/**
 * 前端共用的任务 API 客户端。
 * 统一从非 2xx 响应中提取服务端 `{ error }` 消息，避免各组件重复样板代码。
 */
import type { TaskSummary } from '@/lib/types';

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
