import { describe, expect, it } from 'vitest';
import { fallbackSummary } from './frontend-agent';

describe('fallbackSummary（确定性模板兜底，不调付费 API）', () => {
  it('research：就绪度 + 需求条数', () => {
    const text = fallbackSummary('research', {
      researchReport: {
        user_demand: { demands: [{}, {}] },
        content_readiness_assessment: { overallScore: 68 },
      },
    });
    expect(text).toContain('2 条');
    expect(text).toContain('68');
  });

  it('proposal：标题 / 空间 / 镜头 / 时长', () => {
    const text = fallbackSummary('generate_proposal', {
      proposal: {
        blueprint: { title: 'AI医疗', totalDuration: 30 },
        sceneVisuals: [{ scenes: [{}, {}, {}] }, { scenes: [{}] }],
      },
    });
    expect(text).toContain('AI医疗');
    expect(text).toContain('2 个空间');
    expect(text).toContain('4 个镜头');
    expect(text).toContain('30s');
  });

  it('script / asset / audio / scenes / shots / merge 各自正确', () => {
    expect(
      fallbackSummary('script_generation', { videoScript: { storyboardScript: { scenes: [{}] } } })
    ).toContain('1 个镜头');
    expect(
      fallbackSummary('asset_gen', { assetManifest: { characters: { a: {} }, scenes: { s: {} } } })
    ).toContain('1 个角色');
    expect(fallbackSummary('tts', { audioSegments: [{}] })).toContain('1 个音频片段');
    expect(fallbackSummary('scene_json_assembler', { sceneSpecs: [{}, {}] })).toContain('2 个镜头');
    expect(fallbackSummary('shot_video_gen', { sceneVideos: [{}] })).toContain('1 个镜头');
    expect(fallbackSummary('video_merge', { durationSec: 12.5 })).toContain('12.5');
  });

  it('未知节点：兜底返回节点名', () => {
    expect(fallbackSummary('pause_gate_1', {})).toContain('pause_gate_1');
  });
});
