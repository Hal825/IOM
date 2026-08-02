import { describe, it, expect } from 'vitest';
import { extractResolutionDemand, applyPostProcess } from './script-generator';
import type { ResearchReport, Proposal, VideoScript } from '@/lib/types';

function makeResearch(demands: ResearchReport['user_demand']['demands']): ResearchReport {
  return {
    user_text: '测试',
    user_demand: { hasExplicitDemand: true, demands, summary: '' },
    content_readiness_assessment: {
      overallScore: 80,
      level: 'good',
      dimensions: {},
      strengths: [],
      weaknesses: [],
      recommendation: 'ready',
    },
  };
}

function makeProposal(aspectRatio: Proposal['blueprint']['aspectRatio'] = '16:9'): Proposal {
  return {
    characters: [],
    blueprint: { title: 't', totalDuration: 8, aspectRatio },
    sceneVisuals: [],
    styleProfile: { tone: 'minimal', visualStyle: '', suggestedBGM: '' },
  };
}

function makeScript(): VideoScript {
  return {
    storyScript: {
      scenes: [
        { sceneId: 'scene-1', sceneDescription: 'a', characters: [], narrative: '' },
        { sceneId: 'scene-2', sceneDescription: 'b', characters: [], narrative: '' },
      ],
    },
    storyboardScript: {
      scenes: [
        {
          sceneId: 'scene-1', visualSource: 'visual-1', appearCharId: [],
          resourceRefs: { sceneImageRef: 'scene_visual-1' },
          shot: { type: '', angle: '', movement: '', focus: '' },
          composition: '', lighting: '', visualElements: [], atmosphere: '',
          motionLevel: 2, negativePrompt: '', resolution: '1920x1080', fps: 24,
          engine: 'happyhorse-1.1-r2v', mode: 'text-to-video',
        },
        {
          sceneId: 'scene-2', visualSource: 'visual-1', appearCharId: [],
          resourceRefs: { sceneImageRef: 'scene_visual-1' },
          shot: { type: '', angle: '', movement: '', focus: '' },
          composition: '', lighting: '', visualElements: [], atmosphere: '',
          motionLevel: 2, negativePrompt: '', resolution: '1920x1080', fps: 24,
          engine: 'happyhorse-1.1-r2v', mode: 'text-to-video',
        },
      ],
    },
    audioScript: {
      scenes: [
        { sceneId: 'scene-1', dialogue: null, sfx: [], bgm: { style: '', mood: '', timing: '' } },
        { sceneId: 'scene-2', dialogue: null, sfx: [], bgm: { style: '', mood: '', timing: '' } },
      ],
    },
    pacingScript: {
      scenes: [
        {
          sceneId: 'scene-1', duration: 4,
          transitionIn: { type: 'fade-in', durationSec: 1 },
          transitionOut: { type: 'cut', durationSec: 0 }, keyMoments: [],
        },
        {
          sceneId: 'scene-2', duration: 4,
          transitionIn: { type: 'cut', durationSec: 0 },
          transitionOut: { type: 'fade-out', durationSec: 1 }, keyMoments: [],
        },
      ],
    },
  };
}

describe('extractResolutionDemand', () => {
  it('从 format 需求中提取 480p', () => {
    const r = makeResearch([{ category: 'format', description: '480p分辨率', originalPhrase: '480p' }]);
    expect(extractResolutionDemand(r)).toBe('480p');
  });

  it('无分辨率需求时返回 null', () => {
    const r = makeResearch([{ category: 'duration', description: '40秒', originalPhrase: '40 秒' }]);
    expect(extractResolutionDemand(r)).toBeNull();
  });

  it('researchReport 为 null 时返回 null', () => {
    expect(extractResolutionDemand(null)).toBeNull();
  });
});

describe('applyPostProcess', () => {
  it('分辨率需求按 aspectRatio 覆盖 storyboard（16:9 + 480p → 854x480）', () => {
    const script = applyPostProcess(makeScript(), makeProposal('16:9'),
      makeResearch([{ category: 'format', description: '480p', originalPhrase: '480p' }]));
    for (const b of script.storyboardScript.scenes) {
      expect(b.resolution).toBe('854x480');
    }
  });

  it('无分辨率需求时保留原 resolution', () => {
    const script = applyPostProcess(makeScript(), makeProposal('16:9'), null);
    for (const b of script.storyboardScript.scenes) {
      expect(b.resolution).toBe('1920x1080');
    }
  });

  it('取消边界 fade：首镜头 transitionIn、末镜头 transitionOut 改为 cut(0)', () => {
    const script = applyPostProcess(makeScript(), makeProposal('16:9'), null);
    const pacing = script.pacingScript.scenes;
    expect(pacing[0].transitionIn).toEqual({ type: 'cut', durationSec: 0 });
    expect(pacing[pacing.length - 1].transitionOut).toEqual({ type: 'cut', durationSec: 0 });
    // 中间镜头不受影响
    expect(pacing[0].transitionOut.type).toBe('cut');
  });
});
