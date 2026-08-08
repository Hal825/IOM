import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { TaskSummary } from '@/lib/types';
import { ProductionRail } from './production-rail';

function makeTask(overrides: Partial<TaskSummary> = {}): TaskSummary {
  return {
    id: '1',
    status: 'completed',
    progress: 100,
    text: '城市宣传片',
    createdAt: 0,
    result: { videoPath: 'output/1.mp4', durationSec: 8.5 },
    ...overrides,
  };
}

/** React SSR 会在静态文本与动态表达式间插入 `<!-- -->`，断言前剥掉。 */
function renderClean(node: React.ReactNode): string {
  return renderToString(node).replace(/<!-- -->/g, '');
}

describe('ProductionRail', () => {
  it('只渲染已完成任务：#id + 标题 + 时长 + 下载', () => {
    const html = renderClean(
      <ProductionRail
        tasks={[
          makeTask(),
          makeTask({ id: '2', status: 'active', text: '进行中任务' }),
          makeTask({ id: '3', status: 'failed', text: '失败任务' }),
        ]}
        selectedId="1"
        onSelect={() => {}}
      />
    );
    expect(html).toContain('#1');
    expect(html).toContain('城市宣传片');
    expect(html).toContain('8.5s');
    expect(html).toContain('/api/tasks/1/download');
    expect(html).not.toContain('进行中任务');
    expect(html).not.toContain('失败任务');
  });

  it('没有已完成任务时显示空态', () => {
    const html = renderClean(
      <ProductionRail
        tasks={[makeTask({ status: 'active' })]}
        selectedId={null}
        onSelect={() => {}}
      />
    );
    expect(html).toContain('暂无已完成任务');
  });

  it('收起态渲染窄条：展开按钮 + 标签，不渲染成品列表', () => {
    const html = renderClean(
      <ProductionRail
        tasks={[makeTask()]}
        selectedId="1"
        onSelect={() => {}}
        collapsed
        onToggleCollapse={() => {}}
      />
    );
    expect(html).toContain('展开成品库');
    expect(html).toContain('成品库');
    expect(html).not.toContain('城市宣传片');
    expect(html).not.toContain('/api/tasks/1/download');
  });
});
