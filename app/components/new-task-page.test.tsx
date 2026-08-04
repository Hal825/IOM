import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EmptyHero } from './new-task-page';

const props = {
  onSubmit: async () => {},
  submitting: false,
  error: null,
};

describe('EmptyHero（初始状态 / 新建任务视图）', () => {
  it('渲染占位文案与提交按钮', () => {
    const html = renderToString(<EmptyHero {...props} />);
    expect(html).toContain('描述你想生成的视频');
    expect(html).toContain('生成视频');
  });

  it('空输入时提交按钮 disabled', () => {
    const html = renderToString(<EmptyHero {...props} />);
    expect(html).toMatch(/disabled/);
  });

  it('渲染错误横幅', () => {
    const html = renderToString(<EmptyHero {...props} error="队列不可用" />);
    expect(html).toContain('队列不可用');
  });
});
