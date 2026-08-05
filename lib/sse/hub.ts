/**
 * SSE 订阅集（内存扇出）— API 进程内单例。
 * 一个 jobId 一个订阅集、N 个浏览器标签页共享；broadcast 把同一份消息推给所有连接。
 * 连接关闭（enqueue 抛错）时自动移除。
 */
export interface SseOutboundEvent {
  event: string;
  data: unknown;
}

type Controller = ReadableStreamDefaultController;

/** 把事件序列化为 SSE 帧 */
export function formatEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export class SseHub {
  private subscribers = new Map<string, Set<Controller>>();

  add(jobId: string, controller: Controller): void {
    let set = this.subscribers.get(jobId);
    if (!set) {
      set = new Set();
      this.subscribers.set(jobId, set);
    }
    set.add(controller);
  }

  remove(jobId: string, controller: Controller): void {
    const set = this.subscribers.get(jobId);
    if (!set) return;
    set.delete(controller);
    if (set.size === 0) this.subscribers.delete(jobId);
  }

  count(jobId: string): number {
    return this.subscribers.get(jobId)?.size ?? 0;
  }

  broadcast(jobId: string, outbound: SseOutboundEvent): void {
    const set = this.subscribers.get(jobId);
    if (!set || set.size === 0) return;
    const frame = formatEvent(outbound.event, outbound.data);
    this.broadcastRaw(jobId, frame);
  }

  broadcastRaw(jobId: string, frame: string): void {
    const set = this.subscribers.get(jobId);
    if (!set || set.size === 0) return;
    for (const controller of Array.from(set)) {
      try {
        controller.enqueue(frame);
      } catch {
        this.remove(jobId, controller);
      }
    }
  }
}

/** API 进程内 SseHub 单例（Next.js dev 热重载用 globalThis 缓存） */
const globalForHub = globalThis as unknown as { __omSseHub?: SseHub };
export function getSseHub(): SseHub {
  if (!globalForHub.__omSseHub) {
    globalForHub.__omSseHub = new SseHub();
  }
  return globalForHub.__omSseHub;
}
