import { afterEach, describe, expect, it, vi } from 'vitest';
import { QUEUE_NAME } from './types';

// Mock bullmq / ioredis：不依赖真实 Redis，只验证我们的单例与配置逻辑
// 注意用 function 声明（箭头函数不能被 new 调用）
vi.mock('bullmq', () => ({
  Queue: vi.fn(function (this: Record<string, unknown>, name: string, opts: unknown) {
    this.name = name;
    this.opts = opts;
  }),
}));

vi.mock('ioredis', () => ({
  default: vi.fn(function (this: Record<string, unknown>, opts: unknown) {
    this.options = opts;
    this.on = vi.fn();
    this.disconnect = vi.fn();
  }),
}));

/** vi.resetModules 会重建 mock 实例，因此每个用例内动态 import 以保证拿到同一实例 */
async function loadModules() {
  const queueModule = await import('./queue');
  const { Queue } = await import('bullmq');
  const IORedis = (await import('ioredis')).default;
  return { ...queueModule, Queue: vi.mocked(Queue), IORedis: vi.mocked(IORedis) };
}

describe('lib/queue', () => {
  afterEach(() => {
    // 清理模块级与 globalThis 缓存，让每个用例独立
    vi.resetModules();
    const g = globalThis as Record<string, unknown>;
    delete g.__omRedis;
    delete g.__omQueue;
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('getQueue 使用正确的队列名和保留策略', async () => {
    const { getQueue, Queue } = await loadModules();
    getQueue();

    expect(Queue).toHaveBeenCalledOnce();
    const [name, opts] = Queue.mock.calls[0] as unknown as [
      string,
      { defaultJobOptions: Record<string, unknown> },
    ];
    expect(name).toBe(QUEUE_NAME);
    expect(opts.defaultJobOptions).toMatchObject({
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
      attempts: 1,
    });
  });

  it('getQueue 重复调用返回同一实例（单例）', async () => {
    const { getQueue, Queue } = await loadModules();
    const q1 = getQueue();
    const q2 = getQueue();
    expect(q1).toBe(q2);
    expect(Queue).toHaveBeenCalledOnce();
  });

  it('Redis 连接设置 maxRetriesPerRequest: null（BullMQ 要求）', async () => {
    const { createRedisConnection, IORedis } = await loadModules();
    createRedisConnection();

    const opts = (IORedis.mock.calls[0] as unknown as [Record<string, unknown>])[0];
    expect(opts.maxRetriesPerRequest).toBeNull();
  });

  it('Redis 连接读取环境变量', async () => {
    vi.stubEnv('REDIS_HOST', 'redis.example.com');
    vi.stubEnv('REDIS_PORT', '6380');
    const { createRedisConnection, IORedis } = await loadModules();
    createRedisConnection();

    const opts = (IORedis.mock.calls[0] as unknown as [Record<string, unknown>])[0];
    expect(opts.host).toBe('redis.example.com');
    expect(opts.port).toBe(6380);
  });
});
