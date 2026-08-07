import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ThinkingCard } from './thinking-card';

describe('ThinkingCard', () => {
  it('渲染转圈 + 首条趣味对话行（SSR 首帧）', () => {
    const html = renderToString(<ThinkingCard />);
    expect(html).toContain('animate-spin'); // 转圈
    expect(html).toContain('研究节点'); // 首行 speaker
    expect(html).toContain('让我先读懂你的文本'); // 首行文本
    expect(html).toContain('思考中');
  });
});
