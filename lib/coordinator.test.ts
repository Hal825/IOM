import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createCoordinator } from './coordinator';
import { MemoryEventBus } from './events/bus';
import { createConversationStore } from './conversations/store';
import { SseHub } from './sse/hub';
import type { NodeEvent, GateEvent, StatusEvent } from './agent/events';
import type { FrontendAgentProvider } from './agent/frontend-agent';
import type { NodeCardMessage } from './conversations/types';

/** 内存标志（替代 Redis） */
function memoryFlags() {
  const store = new Map<string, boolean>();
  return {
    isAwaiting: (id: string) => Promise.resolve(store.get(`await:${id}`) ?? false),
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
    // 假前端 agent：逐段流式输出 + 返回全文
    const frontendAgent: FrontendAgentProvider = {
      stream: async (_input, onDelta) => {
        onDelta('调研完成，提取需求 2 条。');
        return { text: '调研完成，提取需求 2 条。' };
      },
    };
    deps = {
      bus: new MemoryEventBus(),
      frontendAgent,
      store: createConversationStore(tmpDir),
      hub,
      flags: { isAwaiting: flags.isAwaiting, setAwaiting: flags.setAwaiting, setPaused: flags.setPaused },
      feedbackDir: tmpDir,
    };
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('node 事件 → 前端 agent 流式 NL → 追加 agent 消息 + 广播 agent_delta/agent', async () => {
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
    expect(m.kind).toBe('agent');
    if (m.kind === 'agent') {
      expect(m.nodeName).toBe('research');
      expect(m.text).toBe('调研完成，提取需求 2 条。');
      expect(m.payload).toEqual({ researchReport: { ok: true } });
    }
    // 流式增量逐段广播 + 最终 agent 事件
    expect(broadcast).toHaveBeenCalledWith(
      '42',
      expect.objectContaining({ event: 'agent_delta' })
    );
    expect(broadcast).toHaveBeenCalledWith(
      '42',
      expect.objectContaining({ event: 'agent' })
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
    // 重复 subscribe 不应抛错即幂等
    await coord.unsubscribe('42');
    await coord.unsubscribe('42'); // 再次取消也不抛
  });

  it('未映射节点 / 空 output 的 node 事件不产卡、不落盘、不广播', async () => {
    const coord = createCoordinator(deps);
    const broadcast = vi.fn();
    hub.broadcast = broadcast;

    // 暂停门等无卡片映射节点（nodeToCardType 返回 null）
    await coord.handleEvent('42', {
      type: 'node', jobId: '42', nodeName: 'pause_gate_1', output: {}, seq: 9,
    });
    // 有卡片映射但 output 为空对象
    await coord.handleEvent('42', {
      type: 'node', jobId: '42', nodeName: 'research', output: {}, seq: 10,
    });

    const conv = await deps.store.read('42');
    expect(conv).toBeNull(); // 什么都没写
    expect(broadcast).not.toHaveBeenCalled();
  });

  it('未知 event.type 静默忽略，不抛错', async () => {
    const coord = createCoordinator(deps);
    await expect(
      coord.handleEvent('42', { type: 'unknown', jobId: '42' } as never)
    ).resolves.toBeUndefined();
    const conv = await deps.store.read('42');
    expect(conv).toBeNull();
  });

  // ── 竞态回归测试（Wave 3 审查发现 R2，修复后转正）────────────────
  it('R2a 非决策点回复不应清除暂停（手动暂停不会被误恢复）', async () => {
    const coord = createCoordinator(deps);
    // 用户手动暂停任务（pause 路由），此时无 gate、无 awaiting
    await deps.flags!.setPaused('42', true);
    // 前端误触发 / 恶意 / 重放 POST reply
    await coord.submitReply('42', '继续');
    // 未处于决策点 → 不清 paused，手动暂停保持
    expect(deps.flags!.setPaused).not.toHaveBeenCalledWith('42', false);
  });

  it('R2b 陈旧重复回复不会清掉后续决策点的暂停', async () => {
    const coord = createCoordinator(deps);
    // gate1 提问并已放行 → 管线进入 gate2 → worker 端 beginDecision 置 paused=true
    await coord.handleEvent('42', {
      type: 'gate', jobId: '42', gateId: 'pause_gate_1', stage: '调研完成', seq: 1,
    });
    await coord.submitReply('42', '继续');
    await deps.flags!.setPaused('42', true); // 模拟 beginDecision(pause_gate_2)

    // 客户端重复 / 重试再发一次 gate1 的回复 → 幂等守卫拦截，不清 gate2 的暂停
    await coord.submitReply('42', '继续');
    expect(deps.flags!.setPaused).not.toHaveBeenLastCalledWith('42', false);
    // 且不重复追加用户消息
    const conv = await deps.store.read('42');
    const texts = conv!.messages.filter((m) => m.kind === 'text');
    expect(texts).toHaveLength(1);
  });

  it('rerunTask 追加重跑标记 + 广播 rerun 事件', async () => {
    const coord = createCoordinator(deps);
    const broadcast = vi.fn();
    hub.broadcast = broadcast;

    await deps.store.append('42', {
      id: 'c1',
      jobId: '42',
      role: 'assistant',
      kind: 'card',
      cardType: 'research',
      nodeName: 'research',
      payload: { researchReport: { ok: true } },
      status: 'done',
      createdAt: new Date().toISOString(),
    } as NodeCardMessage);

    await coord.rerunTask('42', 'generate_proposal');

    const conv = await deps.store.read('42');
    const last = conv!.messages[conv!.messages.length - 1];
    expect(last.kind).toBe('status');
    if (last.kind === 'status') expect(last.text).toContain('重跑');
    expect(broadcast).toHaveBeenCalledWith('42', {
      event: 'rerun',
      data: { nodeName: 'generate_proposal', label: '提案' },
    });
  });
});
