import { describe, expect, it } from 'vitest';
import { parseSSEDeltas, parseSSELine } from './llm';

describe('parseSSELine / parseSSEDeltas（text/event-stream 解析）', () => {
  it('解析多个 data 事件，逐 token 提取 content', () => {
    const chunk = [
      'data: {"choices":[{"delta":{"content":"你好"}}]}',
      '',
      'data: {"choices":[{"delta":{"content":"世界"}}]}',
      '',
      'data: [DONE]',
    ].join('\n');
    expect(parseSSEDeltas(chunk)).toEqual(['你好', '世界']);
  });

  it('忽略非 data 行、空 delta 与 [DONE]', () => {
    const chunk =
      'event: ping\n' +
      'data: {"choices":[{"delta":{}}]}\n' +
      '\n' +
      'data: {"choices":[{"delta":{"content":"x"}}]}\n' +
      '\n' +
      'data: [DONE]';
    expect(parseSSEDeltas(chunk)).toEqual(['x']);
  });

  it('同一事件块内多行 data（少见）也能提取', () => {
    const chunk =
      'data: {"choices":[{"delta":{"content":"a"}}]}\n' +
      'data: {"choices":[{"delta":{"content":"b"}}]}\n' +
      '\n';
    expect(parseSSEDeltas(chunk)).toEqual(['a', 'b']);
  });

  it('parseSSELine 对非 data 行返回 null', () => {
    expect(parseSSELine('id: 1')).toBeNull();
    expect(parseSSELine('data: [DONE]')).toBeNull();
    expect(parseSSELine('data: {"choices":[]}')).toEqual({ choices: [] });
  });
});
