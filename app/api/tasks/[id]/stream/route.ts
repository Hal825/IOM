import { getCoordinator } from '@/lib/coordinator';
import { getSseHub } from '@/lib/sse/hub';
import { createConversationStore } from '@/lib/conversations/store';
import { formatEvent } from '@/lib/sse/hub';

export const dynamic = 'force-dynamic';

/**
 * SSE 流式端点 — 前端 EventSource 订阅节点结果/决策点/状态的实时通道。
 * 连接建立时：
 *   ① 确保该任务的事件订阅已建立（幂等）；
 *   ② 发 `hello` 事件重放既有对话历史（重连恢复）；
 *   ③ 之后由 coordinator 广播 card/gate/status/user/proceed 等事件；
 *   ④ 每 25s 发心跳注释行保活。
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const hub = getSseHub();
  const store = createConversationStore();

  let controllerRef: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controllerRef = controller;
      hub.add(id, controller);

      // 确保订阅已建立（POST /api/tasks 之后可能没走到，或协调器进程重启）
      await getCoordinator().subscribe(id);

      const conv = await store.read(id);
      const hello = {
        jobId: id,
        conversation: conv ?? {
          jobId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        },
      };
      controller.enqueue(new TextEncoder().encode(formatEvent('hello', hello)));

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': ping\n\n'));
        } catch {
          clearInterval(heartbeat);
        }
      }, 25000);
    },
    cancel() {
      if (controllerRef) hub.remove(id, controllerRef);
      controllerRef = null;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
