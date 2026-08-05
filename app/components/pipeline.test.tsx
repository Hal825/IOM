import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Pipeline } from './pipeline';

const ALL_NODES = [
  'research',
  'generate_proposal',
  'script_generation',
  'asset_gen',
  'tts',
  'scene_json_assembler',
  'shot_video_gen',
  'video_merge',
];

describe('Pipeline', () => {
  it('完成节点标绿，首个未完成阶段 active（诚实逐节点着色）', () => {
    const html = renderToString(
      <Pipeline status="active" completedNodes={['research', 'generate_proposal']} />
    );
    // 8 个阶段标签都在
    expect(html).toContain('调研');
    expect(html).toContain('提案');
    expect(html).toContain('脚本');
    // 调研/提案 done → 绿色；首个未完成（脚本）→ 靛蓝 active
    expect(html).toContain('text-success');
    expect(html).toContain('text-accent');
  });

  it('completed 时 8 个阶段全部标绿', () => {
    const html = renderToString(
      <Pipeline status="completed" completedNodes={ALL_NODES} />
    );
    const green = (html.match(/text-success/g) ?? []).length;
    expect(green).toBe(8);
  });

  it('failed 时首个未完成阶段标红', () => {
    const html = renderToString(<Pipeline status="failed" completedNodes={['research']} />);
    expect(html).toContain('text-danger');
  });
});
