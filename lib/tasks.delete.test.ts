import { describe, expect, it, vi } from 'vitest';
import { removeJobWithRetry } from './tasks';

describe('removeJobWithRetry（删除运行中任务 · 方案 C）', () => {
  it('remove 一次成功 → 返回 true', async () => {
    const remove = vi.fn(async () => {});
    expect(await removeJobWithRetry({ remove })).toBe(true);
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('锁错误重试后成功 → 返回 true', async () => {
    const remove = vi
      .fn()
      .mockRejectedValueOnce(
        new Error('Job 1 could not be removed because it is locked by another worker')
      )
      .mockResolvedValueOnce(undefined);
    expect(await removeJobWithRetry({ remove })).toBe(true);
    expect(remove).toHaveBeenCalledTimes(2);
  });

  it('持续锁错误重试完 → 返回 false（不抛，靠 om:deleted 兜底）', async () => {
    const remove = vi.fn().mockRejectedValue(new Error('locked by another worker'));
    expect(await removeJobWithRetry({ remove }, 3, 1)).toBe(false);
    expect(remove).toHaveBeenCalledTimes(3);
  });

  it('非锁错误直接抛', async () => {
    const remove = vi.fn().mockRejectedValue(new Error('boom'));
    await expect(removeJobWithRetry({ remove }, 3, 1)).rejects.toThrow('boom');
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
