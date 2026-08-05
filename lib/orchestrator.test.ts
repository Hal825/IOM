import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Job } from 'bullmq';
import type { TaskData } from './types';

// Mock videoGraph.stream：返回假 async iterable，不依赖真实 Redis/LangGraph
vi.mock('@/lib/agent/graph', () => ({
  videoGraph: {
    stream: vi.fn(async () => ({
      async *[Symbol.asyncIterator]() {
        yield { research: { researchReport: { ok: true } } };
        yield { generate_proposal: { proposal: {} } };
        yield { pause_gate_1: {} }; // 空 output → 应被过滤
        yield { video_merge: { mergedVideoUrl: '/storage/output/test.mp4', durationSec: 32 } };
      },
    })),
  },
}));

// Mock Redis 相关：暂停点与事件发布不碰真实 Redis
vi.mock('@/lib/pause', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pause')>();
  return {
    ...actual,
    pausePoint: vi.fn(async () => {}),
  };
});
vi.mock('@/lib/agent/events', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/agent/events')>();
  return {
    ...actual,
    publishPipelineEvent: vi.fn(async () => {}),
  };
});

import { videoGraph } from '@/lib/agent/graph';
import { publishPipelineEvent } from '@/lib/agent/events';

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

  it('调用 videoGraph.stream 并返回最终结果', async () => {
    const job = createFakeJob('你好世界。这是测试。');
    const result = await executeTask(job, STORAGE);

    expect(videoGraph.stream).toHaveBeenCalledOnce();
    expect(videoGraph.stream).toHaveBeenCalledWith(
      { userPrompt: '你好世界。这是测试。', jobId: '1' },
      { streamMode: 'updates' }
    );

    expect(result.videoPath).toBe('/storage/output/test.mp4');
    expect(result.durationSec).toBe(32);
  });

  it('逐节点发布事件，过滤空 output（暂停门）', async () => {
    const job = createFakeJob('你好世界。');
    await executeTask(job, STORAGE);

    const events = (publishPipelineEvent as ReturnType<typeof vi.fn>).mock.calls.map(
      (c) => (c[1] as { type: string; nodeName?: string }).type
    );
    // research / proposal / video_merge 三个节点事件 + 1 个完成状态事件
    expect(events).toContain('node');
    expect(events).toContain('status');
    const nodeEvents = (publishPipelineEvent as ReturnType<typeof vi.fn>).mock.calls
      .map((c) => c[1] as { type: string; nodeName?: string })
      .filter((e) => e.type === 'node')
      .map((e) => e.nodeName);
    expect(nodeEvents).toEqual(['research', 'generate_proposal', 'video_merge']);
  });

  it('进度按 10→100 推进', async () => {
    const job = createFakeJob('你好世界。');
    await executeTask(job, STORAGE);

    const calls = (job.updateProgress as ReturnType<typeof vi.fn>).mock.calls.map(
      (c) => c[0]
    );
    expect(calls).toEqual([10, 100]);
  });

  it('空文本抛错', async () => {
    const job = createFakeJob('   ');
    await expect(executeTask(job, STORAGE)).rejects.toThrow('任务文本为空');
    expect(videoGraph.stream).not.toHaveBeenCalled();
  });
});
