import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Job } from 'bullmq';
import { executeTask } from './orchestrator.old';
import type { TaskData } from './types';

// Mock 掉三个工具模块，只验证编排逻辑
vi.mock('./tools/tts', () => ({
  synthesizeSpeech: vi.fn(async () => ({
    audioPath: 'D:\\fake\\storage\\audio\\1\\audio.mp3',
    duration: 6,
  })),
}));

vi.mock('./tools/renderer', () => ({
  renderVideo: vi.fn(async () => 'D:\\fake\\storage\\output\\1.mp4'),
}));

import { synthesizeSpeech } from './tools/tts';
import { renderVideo } from './tools/renderer';

function createFakeJob(text: string): Job<TaskData> {
  return {
    id: '1',
    data: { text },
    updateProgress: vi.fn(async () => {}),
    log: vi.fn(async () => {}),
  } as unknown as Job<TaskData>;
}

const STORAGE = 'D:\\fake\\storage';

describe('executeTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('按顺序执行 脚本→TTS→渲染 并返回结果', async () => {
    const job = createFakeJob('你好世界。这是测试。');
    const result = await executeTask(job, STORAGE);

    expect(synthesizeSpeech).toHaveBeenCalledOnce();
    expect(renderVideo).toHaveBeenCalledOnce();

    // 返回相对 storage 的正斜杠路径
    expect(result.videoPath).toBe('output/1.mp4');
    expect(result.audioPath).toBe('audio/1/audio.mp3');
    // 脚本带回填的帧区间：6 秒 * 30fps = 180 帧
    expect(result.script.length).toBe(2);
    expect(result.script[result.script.length - 1].endFrame).toBe(180);
  });

  it('进度按 10→30→50→100 推进', async () => {
    const job = createFakeJob('你好世界。');
    await executeTask(job, STORAGE);

    const calls = (job.updateProgress as ReturnType<typeof vi.fn>).mock.calls.map(
      (c) => c[0]
    );
    expect(calls).toEqual([10, 30, 50, 100]);
  });

  it('渲染进度回调映射到 50~95', async () => {
    const job = createFakeJob('你好世界。');
    vi.mocked(renderVideo).mockImplementationOnce(async (options) => {
      options.onProgress?.(0.5);
      return 'D:\\fake\\storage\\output\\1.mp4';
    });
    await executeTask(job, STORAGE);

    const calls = (job.updateProgress as ReturnType<typeof vi.fn>).mock.calls.map(
      (c) => c[0]
    );
    expect(calls).toContain(50 + Math.round(0.5 * 45)); // 73
  });

  it('空文本抛错', async () => {
    const job = createFakeJob('   ');
    await expect(executeTask(job, STORAGE)).rejects.toThrow('任务文本为空');
    expect(synthesizeSpeech).not.toHaveBeenCalled();
  });

  it('TTS 失败时错误向上传播，不调用渲染', async () => {
    vi.mocked(synthesizeSpeech).mockRejectedValueOnce(new Error('TTS 网络错误'));
    const job = createFakeJob('你好世界。');
    await expect(executeTask(job, STORAGE)).rejects.toThrow('TTS 网络错误');
    expect(renderVideo).not.toHaveBeenCalled();
  });
});
