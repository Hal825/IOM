import { describe, expect, it, vi } from 'vitest';
import { drainGraphUpdates } from './orchestrator';

/** 构造假 async iterable（模拟 stream("updates") 产出） */
function fakeStream(updates: Array<Record<string, unknown>>): AsyncIterable<Record<string, unknown>> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const u of updates) yield u;
    },
  };
}

describe('drainGraphUpdates', () => {
  it('遍历每个节点，非空 output 回调 onNodeEvent', async () => {
    const onNodeEvent = vi.fn(async () => {});
    const stream = fakeStream([
      { research: { researchReport: { ok: true } } },
      { generate_proposal: { proposal: {} } },
    ]);
    const state = await drainGraphUpdates(stream, onNodeEvent);

    expect(onNodeEvent).toHaveBeenCalledTimes(2);
    expect(onNodeEvent).toHaveBeenCalledWith('research', { researchReport: { ok: true } });
    expect(state).toEqual({ mergedVideoUrl: null, durationSec: 0 });
  });

  it('过滤空 output（如暂停门返回 {}）', async () => {
    const onNodeEvent = vi.fn(async () => {});
    const stream = fakeStream([
      { research: { researchReport: {} } },
      { pause_gate_1: {} },
      { video_merge: { mergedVideoUrl: '/x.mp4', durationSec: 12 } },
    ]);
    const state = await drainGraphUpdates(stream, onNodeEvent);

    expect(onNodeEvent).toHaveBeenCalledTimes(2);
    expect(onNodeEvent).not.toHaveBeenCalledWith('pause_gate_1', {});
    expect(state).toEqual({ mergedVideoUrl: '/x.mp4', durationSec: 12 });
  });

  it('支持 Send fanout：一个 update 含多个并行节点', async () => {
    const onNodeEvent = vi.fn(async () => {});
    const stream = fakeStream([
      { asset_gen: { assetManifest: {} }, tts: { audioSegments: [] } },
    ]);
    await drainGraphUpdates(stream, onNodeEvent);

    expect(onNodeEvent).toHaveBeenCalledTimes(2);
    expect(onNodeEvent).toHaveBeenCalledWith('asset_gen', { assetManifest: {} });
    expect(onNodeEvent).toHaveBeenCalledWith('tts', { audioSegments: [] });
  });

  it('图内节点抛错 → 直接抛（零容错）', async () => {
    const onNodeEvent = vi.fn(async () => {});
    const stream = fakeStream([{ video_merge: { mergedVideoUrl: 'x' } }]);
    // 构造一个在迭代中途抛错的流
    const failing = {
      async *[Symbol.asyncIterator]() {
        yield { research: { researchReport: {} } };
        throw new Error('boom');
      },
    };
    await expect(drainGraphUpdates(failing as AsyncIterable<Record<string, unknown>>, onNodeEvent)).rejects.toThrow('boom');
    expect(stream).toBeDefined();
  });
});
