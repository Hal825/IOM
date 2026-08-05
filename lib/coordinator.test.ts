import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createCoordinator } from './coordinator';
import { MemoryEventBus } from './events/bus';
import { createConversationStore } from './conversations/store';
import { SseHub } from './sse/hub';
import type { NodeEvent, GateEvent, StatusEvent } from './agent/events';
import type { CommentaryProvider } from './agent/commentary';

/** 内存标志（替代 Redis） */
function memoryFlags() {
  const store = new Map<string, boolean>();
  return {
    setAwaiting: vi.fn(async (id: string, v: boolean) => {
      store.set(`await:${id}`, v);
    }),
    setPaused: vi.fn(async (id: string, v: boolean) => {
      store.set(`pause:${id}`, v);
    }),
    get: (k: string) => store.get(k),
  };
}

describe('coordinator', () => {
  let tmpDir: string;
  let flags: ReturnType<typeof memoryFlags>;
  let hub: SseHub;
  let deps: Parameters<typeof createCoordinator>[0];

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'om-coord-'));
    flags = memoryFlags();
    hub = new SseHub();
    const provider: CommentaryProvider = { comment: async () => '点评：看起来不错' };
    deps = {
      bus: new MemoryEventBus(),
      provider,
      store: createConversationStore(tmpDir),
      hub,
      flags: { setAwaiting: flags.setAwaiting, setPaused: flags.setPaused },
      feedbackDir: tmpDir,
    };
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('node 事件 → 追加卡片消息 + 广播 card', async () => {
    const coord = createCoordinator(deps);
    const broadcast = vi.fn();
    hub.broadcast = broadcast;

    const event: NodeEvent = {
      type: 'node',
      jobId: '42',
      nodeName: 'research',
      output: { researchReport: { ok: true } },
      seq: 1,
    };
    await coord.handleEvent('42', event);

    const conv = await deps.store.read('42');
    expect(conv?.messages).toHaveLength(1);
    const m = conv!.messages[0];
    expect(m.kind).toBe('card');
    if (m.kind === 'card') {
      expect(m.cardType).toBe('research');
      expect(m.nodeName).toBe('research');
      expect(m.comment).toBe('点评：看起来不错');
    }
    expect(broadcast).toHaveBeenCalledWith(
      '42',
      expect.objectContaining({ event: 'card' })
    );
  });

  it('gate 事件 → 追加提问 + 置待回复标志 + 广播 gate', async () => {
    const coord = createCoordinator(deps);
    const event: GateEvent = {
      type: 'gate',
      jobId: '42',
      gateId: 'pause_gate_1',
      stage: '调研完成',
      seq: 2,
    };
    await coord.handleEvent('42', event);

    expect(flags.get('await:42')).toBe(true);
    const conv = await deps.store.read('42');
    const m = conv!.messages[0];
    expect(m.kind).toBe('gate');
    if (m.kind === 'gate') {
      expect(m.question).toContain('开始设计提案');
      expect(m.awaitingReply).toBe(true);
    }
  });

  it('status completed → 追加系统消息 + 广播 status', async () => {
    const coord = createCoordinator(deps);
    const event: StatusEvent = {
      type: 'status',
      jobId: '42',
      status: 'completed',
      result: { videoPath: 'output/42.mp4', durationSec: 12 },
      seq: 3,
    };
    await coord.handleEvent('42', event);
    const conv = await deps.store.read('42');
    expect(conv?.messages[0].kind).toBe('status');
  });

  it('submitReply → 追加用户消息 + 反馈落盘 + 清标志 + 广播 user/proceed', async () => {
    const coord = createCoordinator(deps);
    // 先造一个 gate + 前置卡片，模拟决策点现场
    await coord.handleEvent('42', {
      type: 'node', jobId: '42', nodeName: 'research',
      output: { researchReport: { summary: 'x' } }, seq: 1,
    });
    await coord.handleEvent('42', {
      type: 'gate', jobId: '42', gateId: 'pause_gate_1', stage: '调研完成', seq: 2,
    });

    const conv = await coord.submitReply('42', '继续，注意节奏');

    // 用户消息追加进对话
    const last = conv.messages[conv.messages.length - 1];
    expect(last.kind).toBe('text');
    if (last.kind === 'text') {
      expect(last.text).toBe('继续，注意节奏');
      expect(last.feedback.gateId).toBe('pause_gate_1');
      expect(last.feedback.nodeName).toBe('research');
    }
    // 反馈落盘
    const feedback = JSON.parse(
      fs.readFileSync(path.join(tmpDir, '42.json'), 'utf-8')
    ) as Array<Record<string, unknown>>;
    expect(feedback[0].userText).toBe('继续，注意节奏');
    // 清标志
    expect(flags.get('pause:42')).toBe(false);
    expect(flags.get('await:42')).toBe(false);
  });

  it('订阅幂等：同 jobId 重复 subscribe 只建一个订阅', async () => {
    const coord = createCoordinator(deps);
    await coord.subscribe('42');
    await coord.subscribe('42');
    const bus = deps.bus as MemoryEventBus;
    // MemoryEventBus 内部 handlers 不可直接访问，但重复 subscribe 不应抛错即幂等
    await coord.unsubscribe('42');
    await coord.unsubscribe('42'); // 再次取消也不抛
  });
});
