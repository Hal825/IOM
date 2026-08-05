import { describe, expect, it, vi } from 'vitest';
import { SseHub, formatEvent } from './hub';

function fakeController() {
  const enqueue = vi.fn();
  const controller = { enqueue } as unknown as ReadableStreamDefaultController;
  return { controller, enqueue };
}

describe('SseHub', () => {
  it('add + broadcast 推给订阅者（SSE 帧格式）', () => {
    const hub = new SseHub();
    const { controller, enqueue } = fakeController();
    hub.add('42', controller);
    hub.broadcast('42', { event: 'card', data: { ok: true } });
    expect(enqueue).toHaveBeenCalledWith('event: card\ndata: {"ok":true}\n\n');
  });

  it('无订阅者时不抛错', () => {
    const hub = new SseHub();
    hub.broadcast('42', { event: 'card', data: {} });
  });

  it('连接关闭的 controller 自动移除，其余仍收到', () => {
    const hub = new SseHub();
    const { controller, enqueue } = fakeController();
    const closed = {
      enqueue: vi.fn(() => {
        throw new Error('closed');
      }),
    } as unknown as ReadableStreamDefaultController;

    hub.add('42', controller);
    hub.add('42', closed);
    hub.broadcast('42', { event: 'card', data: {} });

    expect(enqueue).toHaveBeenCalled();
    expect(hub.count('42')).toBe(1); // closed 被移除
    hub.remove('42', controller);
    expect(hub.count('42')).toBe(0);
  });

  it('formatEvent 序列化为标准 SSE 帧', () => {
    expect(formatEvent('gate', { gateId: 'g1' })).toBe('event: gate\ndata: {"gateId":"g1"}\n\n');
  });
});
