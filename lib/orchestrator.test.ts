import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Job } from 'bullmq';
import type { TaskData } from './types';

// Mock videoGraph.invoke：不依赖真实 Redis/LangGraph，验证编排逻辑
vi.mock('@/lib/agent/graph', () => ({
  videoGraph: {
    invoke: vi.fn(async () => ({
      videoUrl: '/storage/output/test.mp4',
      durationSec: 32,
      jobId: 'test-1',
    })),
  },
}));

import { videoGraph } from '@/lib/agent/graph';

// 延迟导入 executeTask（确保 mock 先生效）
const { executeTask } = await import('./orchestrator');

function createFakeJob(text: string): Job<TaskData> {
  return {
    id: '1',
    data: { text },
    updateProgress: vi.fn(async () => {}),
    log: vi.fn(async () => {}),
  } as unknown as Job<TaskData>;
}

const STORAGE = '/fake/storage';

describe('executeTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('调用 videoGraph.invoke 并返回结果', async () => {
    const job = createFakeJob('你好世界。这是测试。');
    const result = await executeTask(job, STORAGE);

    expect(videoGraph.invoke).toHaveBeenCalledOnce();
    expect(videoGraph.invoke).toHaveBeenCalledWith({
      userPrompt: '你好世界。这是测试。',
      jobId: '1',
    });

    expect(result.videoPath).toBe('/storage/output/test.mp4');
    expect(result.durationSec).toBe(32);
  });

  it('进度按 10→90→100 推进', async () => {
    const job = createFakeJob('你好世界。');
    await executeTask(job, STORAGE);

    const calls = (job.updateProgress as ReturnType<typeof vi.fn>).mock.calls.map(
      (c) => c[0]
    );
    expect(calls).toEqual([10, 90, 100]);
  });

  it('空文本抛错', async () => {
    const job = createFakeJob('   ');
    await expect(executeTask(job, STORAGE)).rejects.toThrow('任务文本为空');
    expect(videoGraph.invoke).not.toHaveBeenCalled();
  });
});
