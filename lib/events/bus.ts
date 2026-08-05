/**
 * 事件总线 — Worker 发布 / 协调器订阅 的解耦层。
 * 生产实现 = ioredis pub/sub（即发即弃，订阅连接 duplicate 自共享连接）；
 * 测试实现 = 内存 EventEmitter。
 */
import IORedis from 'ioredis';
import { getRedisConnection } from '@/lib/queue';

export interface EventBus {
  publish(channel: string, event: unknown): Promise<void>;
  /** 返回取消订阅函数 */
  subscribe(channel: string, handler: (event: unknown) => void): Promise<() => void>;
}

/** ioredis pub/sub 实现：发布用共享连接，订阅用 duplicate 专属连接 */
export function createRedisEventBus(): EventBus {
  let sub: IORedis | null = null;
  const handlers = new Map<string, Set<(event: unknown) => void>>();

  return {
    async publish(channel, event) {
      await getRedisConnection().publish(channel, JSON.stringify(event));
    },
    async subscribe(channel, handler) {
      if (!sub) {
        sub = getRedisConnection().duplicate();
        sub.on('message', (ch, message) => {
          const set = handlers.get(ch);
          if (!set) return;
          let parsed: unknown;
          try {
            parsed = JSON.parse(message);
          } catch {
            return;
          }
          for (const h of Array.from(set)) {
            try {
              h(parsed);
            } catch {
              /* 隔离单个 handler 异常 */
            }
          }
        });
        sub.on('error', () => {
          /* 连接错误由 createRedisConnection 的 retryStrategy 兜底 */
        });
      }
      let set = handlers.get(channel);
      if (!set) {
        set = new Set();
        handlers.set(channel, set);
      }
      set.add(handler);
      await sub.subscribe(channel);
      return async () => {
        set?.delete(handler);
        if (sub) {
          await sub.unsubscribe(channel).catch(() => {});
        }
      };
    },
  };
}

/** 内存事件总线（测试用）：同步派发，保持 publish 顺序 */
export class MemoryEventBus implements EventBus {
  private handlers = new Map<string, Set<(event: unknown) => void>>();

  async publish(channel: string, event: unknown): Promise<void> {
    const set = this.handlers.get(channel);
    if (!set) return;
    for (const h of Array.from(set)) {
      h(event);
    }
  }

  async subscribe(channel: string, handler: (event: unknown) => void): Promise<() => void> {
    let set = this.handlers.get(channel);
    if (!set) {
      set = new Set();
      this.handlers.set(channel, set);
    }
    set.add(handler);
    return () => {
      set.delete(handler);
    };
  }
}
