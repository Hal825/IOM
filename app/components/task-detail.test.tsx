import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { TaskSummary } from '@/lib/types';
import { TaskDetail } from './task-detail';

/**
 * 回归：队列中早期完成的任务，其 Worker returnvalue 没有 durationSec 字段
 * （旧版 Worker 只写 videoPath）。前端必须容错，不能崩在 toFixed 上。
 */
const legacyCompleted = {
  id: '34',
  status: 'completed',
  progress: 100,
  text: '骤雨初歇，竹叶尖上还悬着水珠。',
  createdAt: 1785600000000,
  result: { videoPath: 'output/34.mp4' }, // 缺 durationSec
} as unknown as TaskSummary;

describe('TaskDetail', () => {
  it('渲染缺少 durationSec 的历史完成任务（不崩溃、不显示时长）', () => {
    const html = renderToString(<TaskDetail task={legacyCompleted} />);
    expect(html).toContain('下载 MP4');
    expect(html).not.toContain('时长');
  });

  it('有 durationSec 时显示时长', () => {
    const html = renderToString(
      <TaskDetail
        task={{
          ...legacyCompleted,
          result: { videoPath: 'output/34.mp4', durationSec: 15.2 },
        }}
      />
    );
    expect(html).toContain('时长 15.2s');
  });

  it('未选中任务时渲染占位态', () => {
    const html = renderToString(<TaskDetail task={null} />);
    expect(html).toContain('选择左侧任务查看详情');
  });
});
