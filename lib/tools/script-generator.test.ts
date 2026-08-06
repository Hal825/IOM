import { describe, expect, it } from 'vitest';
import { parseAndValidateScript } from './script-generator';

/**
 * C1 回归测试：旧 schema 的 resourceRefs.characterImageRefs 已被 appearCharId 取代
 * （asset-gen 重构），幽灵校验会让每次 script_generation 必失败。修复后：
 *   - 按文档 schema（含 appearCharId、无 characterImageRefs）应通过；
 *   - 缺 appearCharId 应抛错（真实契约）。
 */

/** 最小合法脚本（严格满足 parseAndValidateScript 全部检查） */
const VALID_SCRIPT = {
  storyScript: {
    scenes: [
      {
        sceneId: 'scene-1',
        sceneDescription: '测试场景',
        characters: [],
      },
    ],
  },
  storyboardScript: {
    scenes: [
      {
        sceneId: 'scene-1',
        visualSource: 'visual-1',
        appearCharId: [],
        resourceRefs: { sceneImageRef: 'scene_visual-1' },
        shot: { type: 'wide', angle: 'front', movement: 'static', focus: 'landscape' },
        composition: 'rule of thirds',
        lighting: 'natural',
        visualElements: [],
        atmosphere: 'calm',
        motionLevel: 2,
        negativePrompt: 'blur',
        resolution: '1920x1080',
        fps: 24,
        engine: 'happyhorse',
        mode: 'standard',
      },
    ],
  },
  audioScript: {
    scenes: [
      {
        sceneId: 'scene-1',
        dialogue: null,
        sfx: [],
        bgm: { style: 'ambient', mood: 'calm', timing: 'whole' },
      },
    ],
  },
  pacingScript: {
    scenes: [
      {
        sceneId: 'scene-1',
        duration: 5,
        transitionIn: { type: 'fade-in', durationSec: 0.5 },
        transitionOut: { type: 'cut', durationSec: 0 },
        keyMoments: [],
      },
    ],
  },
};

describe('parseAndValidateScript（C1 回归）', () => {
  it('按文档 schema 输出（appearCharId 存在、无 characterImageRefs）→ 通过', () => {
    const script = parseAndValidateScript(JSON.stringify(VALID_SCRIPT));
    expect(script.storyScript.scenes).toHaveLength(1);
    expect(script.storyboardScript.scenes[0].resourceRefs.sceneImageRef).toBe('scene_visual-1');
  });

  it('缺 appearCharId → 抛错（真实契约强制）', () => {
    const broken = structuredClone(VALID_SCRIPT) as unknown as {
      storyboardScript: { scenes: Array<Record<string, unknown>> };
    };
    delete broken.storyboardScript.scenes[0].appearCharId;
    expect(() => parseAndValidateScript(JSON.stringify(broken))).toThrow(/appearCharId 缺失/);
  });

  it('含幽灵字段 characterImageRefs 不影响通过（向后兼容旧输出）', () => {
    const withGhost = structuredClone(VALID_SCRIPT) as unknown as {
      storyboardScript: { scenes: Array<{ resourceRefs: Record<string, unknown> }> };
    };
    withGhost.storyboardScript.scenes[0].resourceRefs.characterImageRefs = ['char-1'];
    expect(() => parseAndValidateScript(JSON.stringify(withGhost))).not.toThrow();
  });
});
