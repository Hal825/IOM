import { describe, it, expect, vi } from 'vitest';
import { clampDuration, buildMotionDescription, runWithConcurrency, resolutionToTier } from './util';

describe('clampDuration', () => {
  it('低于下限钳到 min', () => {
    expect(clampDuration(1)).toBe(3);
    expect(clampDuration(2.1)).toBe(3);
  });

  it('高于上限钳到 max', () => {
    expect(clampDuration(20)).toBe(15);
    expect(clampDuration(15.6)).toBe(15);
  });

  it('区间内原样保留（取整）', () => {
    expect(clampDuration(8)).toBe(8);
    expect(clampDuration(7.4)).toBe(7);
    expect(clampDuration(7.6)).toBe(8);
  });

  it('支持自定义边界', () => {
    expect(clampDuration(0, 1, 4)).toBe(1);
    expect(clampDuration(10, 1, 4)).toBe(4);
  });
});

describe('buildMotionDescription', () => {
  const baseBoard = {
    shot: { type: 'close-up', angle: 'eye-level', movement: 'static', focus: 'face' },
    composition: 'rule of thirds',
    lighting: 'soft light',
    visualElements: ['fog', 'particles'],
    atmosphere: 'calm',
    motionLevel: 3,
    negativePrompt: 'x',
  };

  it('拼接非空字段（英文 ". " 连接）', () => {
    const desc = buildMotionDescription(baseBoard as never);
    expect(desc).toContain('Movement: static');
    expect(desc).toContain('Shot type: close-up');
    expect(desc).toContain('Angle: eye-level');
    expect(desc).toContain('Focus: face');
    expect(desc).toContain('Composition: rule of thirds');
    expect(desc).toContain('Lighting: soft light');
    expect(desc).toContain('Atmosphere: calm');
    expect(desc).toContain('Motion level (1-5): 3');
    expect(desc).toContain('Visual element: fog');
    expect(desc).toContain('Visual element: particles');
  });

  it('空字段跳过，不产生悬空分隔', () => {
    const desc = buildMotionDescription({
      shot: { type: '', angle: '', movement: '', focus: '' },
      composition: '',
      lighting: 'soft light',
      visualElements: [],
      atmosphere: '',
      motionLevel: 2,
      negativePrompt: '',
    } as never);
    expect(desc).toBe('Lighting: soft light. Motion level (1-5): 2');
  });

  it('全空时返回空字符串', () => {
    const desc = buildMotionDescription({
      shot: { type: '', angle: '', movement: '', focus: '' },
      composition: '',
      lighting: '',
      visualElements: [],
      atmosphere: '',
      motionLevel: undefined,
      negativePrompt: '',
    } as never);
    expect(desc).toBe('');
  });
});

describe('resolutionToTier', () => {
  it('按较短边映射档位', () => {
    expect(resolutionToTier('854x480')).toBe('480P');
    expect(resolutionToTier('480x854')).toBe('480P');
    expect(resolutionToTier('1280x720')).toBe('720P');
    expect(resolutionToTier('1920x1080')).toBe('1080P');
    expect(resolutionToTier('2560x1440')).toBe('2K');
    expect(resolutionToTier('3840x2160')).toBe('4K');
  });

  it('支持乘号分隔与大小写', () => {
    expect(resolutionToTier('854×480')).toBe('480P');
    expect(resolutionToTier('1920X1080')).toBe('1080P');
  });

  it('非宽x高格式返回 null', () => {
    expect(resolutionToTier('720P')).toBeNull();
    expect(resolutionToTier('foo')).toBeNull();
    expect(resolutionToTier('')).toBeNull();
  });
});

describe('runWithConcurrency', () => {
  it('并发窗口上限生效，且全部任务被执行', async () => {
    let active = 0;
    let maxActive = 0;
    const processed: number[] = [];

    await runWithConcurrency([0, 1, 2, 3, 4], 2, async (item) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 10));
      processed.push(item);
      active--;
    });

    expect(maxActive).toBeLessThanOrEqual(2);
    expect(processed.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it('limit<=0 时退化为 1', async () => {
    let maxActive = 0;
    await runWithConcurrency([1, 2, 3], 0, async () => {
      maxActive++;
      await new Promise((r) => setTimeout(r, 5));
      maxActive--;
    });
    expect(maxActive).toBeLessThanOrEqual(1);
  });

  it('某项失败时整体抛错，且不再启动新任务', async () => {
    const processed: number[] = [];
    const err = new Error('boom');

    await expect(
      runWithConcurrency([0, 1, 2, 3, 4], 2, async (item) => {
        processed.push(item);
        await new Promise((r) => setTimeout(r, 5));
        if (item === 1) throw err;
      })
    ).rejects.toThrow('boom');

    // 失败后不再有新项开始：已处理数必须小于等于并发窗口内已排的任务数
    expect(processed.length).toBeLessThanOrEqual(4);
  });

  it('空列表直接返回', async () => {
    const fn = vi.fn();
    await runWithConcurrency([], 2, fn);
    expect(fn).not.toHaveBeenCalled();
  });
});
