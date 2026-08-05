import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { NodeCardMessage } from '@/lib/conversations/types';
import { NodeCard } from './node-card';

function card(overrides: Partial<NodeCardMessage> = {}): NodeCardMessage {
  return {
    id: 'm1',
    jobId: '42',
    role: 'assistant',
    kind: 'card',
    cardType: 'research',
    nodeName: 'research',
    payload: {},
    status: 'done',
    createdAt: '2026-08-05T00:00:00Z',
    ...overrides,
  };
}

describe('NodeCard', () => {
  it('渲染调研卡：需求提取 + 就绪度 + 短板', () => {
    const m = card({
      payload: {
        researchReport: {
          user_text: 'x',
          user_demand: { hasExplicitDemand: true, demands: [], summary: '短时长科普' },
          content_readiness_assessment: {
            overallScore: 82,
            level: 'good',
            dimensions: {},
            strengths: [],
            weaknesses: ['缺少细节'],
            recommendation: 'ready',
          },
        },
      },
    });
    const html = renderToString(<NodeCard message={m} />);
    expect(html).toContain('调研');
    expect(html).toContain('短时长科普');
    expect(html).toContain('82');
    expect(html).toContain('缺少细节');
  });

  it('渲染成片卡：播放器地址 + 时长 + 下载', () => {
    const m = card({
      cardType: 'video',
      nodeName: 'video_merge',
      payload: { mergedVideoUrl: '/x.mp4', durationSec: 15.2, mergeLog: 'Merged 3' },
    });
    const html = renderToString(<NodeCard message={m} />);
    expect(html).toContain('成片');
    expect(html).toContain('时长 15.2s');
    expect(html).toContain('/api/tasks/42/download');
  });

  it('渲染 LLM 点评行', () => {
    const html = renderToString(<NodeCard message={card({ comment: '节奏紧凑' })} />);
    expect(html).toContain('节奏紧凑');
  });
});
