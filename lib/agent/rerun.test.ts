import { describe, expect, it } from 'vitest';
import type { ConversationMessage, NodeCardMessage } from '@/lib/conversations/types';
import { buildResumeState, shouldFireGate } from './rerun';

function card(nodeName: string, payload: Record<string, unknown>): ConversationMessage {
  return {
    id: `c-${nodeName}`,
    jobId: '1',
    role: 'assistant',
    kind: 'card',
    cardType: 'research', // buildResumeState 只读 kind/nodeName/payload，cardType 无关
    nodeName,
    payload,
    status: 'done',
    createdAt: '2026-01-01T00:00:00.000Z',
  } as NodeCardMessage;
}

const FULL = [
  card('research', { researchReport: { a: 1 } }),
  card('generate_proposal', { proposal: { b: 2 } }),
  card('script_generation', { videoScript: { c: 3 } }),
  card('asset_gen', { assetManifest: { d: 4 } }),
  card('tts', { audioSegments: [{ sceneId: 's1' }] }),
  card('scene_json_assembler', { sceneSpecs: [{ sceneId: 's1' }] }),
  card('shot_video_gen', { sceneVideos: [{ sceneId: 's1' }] }),
  card('video_merge', { mergedVideoUrl: 'x.mp4' }),
];

describe('buildResumeState', () => {
  it('保留上游卡，丢弃 X 及下游', () => {
    const state = buildResumeState(FULL, 'script_generation');
    expect(state).toEqual({
      researchReport: { a: 1 },
      proposal: { b: 2 },
    });
  });

  it('asset_gen 重跑保留并行兄弟 tts 输出', () => {
    const state = buildResumeState(FULL, 'asset_gen');
    expect(state.assetManifest).toBeUndefined(); // X 丢弃
    expect(state.audioSegments).toEqual([{ sceneId: 's1' }]); // 兄弟保留
    expect(state.sceneSpecs).toBeUndefined(); // 下游丢弃
  });

  it('tts 重跑保留并行兄弟 asset_gen 输出', () => {
    const state = buildResumeState(FULL, 'tts');
    expect(state.assetManifest).toEqual({ d: 4 }); // 兄弟保留
    expect(state.audioSegments).toBeUndefined(); // X 丢弃
  });

  it('读 agent kind 消息（新 NL 对话）同样能重建状态', () => {
    const msgs = [
      { ...card('research', { researchReport: { a: 1 } }), kind: 'agent', text: '调研完成' },
      { ...card('generate_proposal', { proposal: { b: 2 } }), kind: 'agent', text: '提案完成' },
    ] as ConversationMessage[];
    const state = buildResumeState(msgs, 'script_generation');
    expect(state).toEqual({ researchReport: { a: 1 }, proposal: { b: 2 } });
  });

  it('重跑后二次重跑取最新上游（后到覆盖先到）', () => {
    const msgs = [
      card('research', { researchReport: { v: 1 } }),
      card('generate_proposal', { proposal: { v: 1 } }),
      card('script_generation', { videoScript: { v: 1 } }),
      card('asset_gen', { assetManifest: { v: 1 } }),
      card('tts', { audioSegments: [{ sceneId: 's1', v: 1 }] }),
      card('scene_json_assembler', { sceneSpecs: [{ sceneId: 's1', v: 1 }] }),
      // 第一次重跑 script 后的新卡
      card('script_generation', { videoScript: { v: 2 } }),
      card('asset_gen', { assetManifest: { v: 2 } }),
      card('tts', { audioSegments: [{ sceneId: 's1', v: 2 }] }),
      card('scene_json_assembler', { sceneSpecs: [{ sceneId: 's1', v: 2 }] }),
      card('shot_video_gen', { sceneVideos: [{ sceneId: 's1', v: 2 }] }),
      card('video_merge', { mergedVideoUrl: 'v2.mp4' }),
    ];
    const state = buildResumeState(msgs, 'asset_gen');
    expect(state.videoScript).toEqual({ v: 2 }); // 最新胜
    expect(state.audioSegments).toEqual([{ sceneId: 's1', v: 2 }]);
    expect(state.assetManifest).toBeUndefined();
    expect(state.sceneSpecs).toBeUndefined();
  });
});

describe('shouldFireGate', () => {
  const GATES = ['pause_gate_1', 'pause_gate_2', 'pause_gate_3', 'pause_gate_4'];

  it('无 rerunFrom → 全问', () => {
    for (const g of GATES) expect(shouldFireGate(g)).toBe(true);
  });

  it('rerunFrom=script_generation → 门1跳、门2-4问', () => {
    expect(shouldFireGate('pause_gate_1', 'script_generation')).toBe(false);
    expect(shouldFireGate('pause_gate_2', 'script_generation')).toBe(true);
    expect(shouldFireGate('pause_gate_3', 'script_generation')).toBe(true);
    expect(shouldFireGate('pause_gate_4', 'script_generation')).toBe(true);
  });

  it('rerunFrom=asset_gen → 门1/2跳、门3/4问', () => {
    expect(shouldFireGate('pause_gate_1', 'asset_gen')).toBe(false);
    expect(shouldFireGate('pause_gate_2', 'asset_gen')).toBe(false);
    expect(shouldFireGate('pause_gate_3', 'asset_gen')).toBe(true);
    expect(shouldFireGate('pause_gate_4', 'asset_gen')).toBe(true);
  });

  it('rerunFrom=video_merge → 全跳（仅重跑拼接）', () => {
    for (const g of GATES) expect(shouldFireGate(g, 'video_merge')).toBe(false);
  });
});
