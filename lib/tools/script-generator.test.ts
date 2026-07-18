import { describe, expect, it } from 'vitest';
import { assignFrames, generateScript } from './script-generator';

describe('generateScript', () => {
  it('按中文句末标点切分', () => {
    const scenes = generateScript('你好世界。这是一个测试视频！欢迎使用？');
    expect(scenes.map((s) => s.text)).toEqual([
      '你好世界。',
      '这是一个测试视频！',
      '欢迎使用？',
    ]);
  });

  it('英文标点也能切分', () => {
    const scenes = generateScript('Hello world. This is a test!');
    expect(scenes).toHaveLength(2);
    expect(scenes[0].text).toBe('Hello world.');
  });

  it('空文本返回空数组', () => {
    expect(generateScript('')).toEqual([]);
    expect(generateScript('   \n  ')).toEqual([]);
  });

  it('过短片段合并到上一句', () => {
    // "嗯。" 去掉标点后只剩 1 个字，应合并到前句
    const scenes = generateScript('这是完整的一句话。嗯。');
    expect(scenes).toHaveLength(1);
    expect(scenes[0].text).toBe('这是完整的一句话。嗯。');
  });

  it('无标点的整段文本作为单场景', () => {
    const scenes = generateScript('没有标点的一段文字');
    expect(scenes).toHaveLength(1);
    expect(scenes[0].text).toBe('没有标点的一段文字');
  });

  it('超长句子按逗号再切', () => {
    const longText =
      '这是第一个很长很长很长很长很长很长的部分，这是第二个很长很长很长很长很长很长的部分，这是第三个部分。';
    const scenes = generateScript(longText);
    expect(scenes.length).toBeGreaterThan(1);
    // 所有场景拼回去应包含原文字符（不丢字）
    expect(scenes.map((s) => s.text).join('')).toBe(longText);
  });

  it('初始帧区间为 0', () => {
    const scenes = generateScript('你好。世界。');
    for (const s of scenes) {
      expect(s.startFrame).toBe(0);
      expect(s.endFrame).toBe(0);
    }
  });
});

describe('assignFrames', () => {
  it('帧区间连续且覆盖全部时长', () => {
    const scenes = generateScript('短句。这是一个明显更长的句子内容。');
    const result = assignFrames(scenes, 10, 30); // 10 秒 * 30fps = 300 帧

    expect(result[0].startFrame).toBe(0);
    // 相邻场景无缝衔接
    for (let i = 1; i < result.length; i++) {
      expect(result[i].startFrame).toBe(result[i - 1].endFrame);
    }
    // 最后一帧恰好等于总帧数
    expect(result[result.length - 1].endFrame).toBe(300);
  });

  it('更长的文字获得更多帧', () => {
    const scenes = [
      { text: '短。', startFrame: 0, endFrame: 0 },
      { text: '这是一句非常非常非常长的字幕文本。', startFrame: 0, endFrame: 0 },
    ];
    const result = assignFrames(scenes, 10, 30);
    const len0 = result[0].endFrame - result[0].startFrame;
    const len1 = result[1].endFrame - result[1].startFrame;
    expect(len1).toBeGreaterThan(len0);
  });

  it('空场景列表返回空数组', () => {
    expect(assignFrames([], 10, 30)).toEqual([]);
  });

  it('每个场景至少 1 帧', () => {
    const scenes = [
      { text: '一', startFrame: 0, endFrame: 0 },
      { text: '很长很长很长很长很长很长的句子', startFrame: 0, endFrame: 0 },
    ];
    const result = assignFrames(scenes, 0.1, 30); // 极短音频
    for (const s of result) {
      expect(s.endFrame - s.startFrame).toBeGreaterThanOrEqual(1);
    }
  });
});
