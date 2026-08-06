import { afterEach, describe, expect, it, vi } from 'vitest';
import { extractJsonObject, fetchWithTimeout } from './http';

describe('extractJsonObject', () => {
  it('从纯 JSON 提取', () => {
    expect(extractJsonObject('{"a":1}')).toBe('{"a":1}');
  });

  it('从 ```json 代码围栏提取', () => {
    const raw = '好的，这是结果：\n```json\n{"a":1}\n```';
    expect(extractJsonObject(raw)).toBe('{"a":1}');
  });

  it('散文含花括号时只取对象（首个 { 到末个 }）', () => {
    const raw = '这里 {备注} 是 {"a":1} 输出';
    expect(extractJsonObject(raw)).toBe('{"a":1}');
  });

  it('对象后还有散文花括号时以末个 } 收尾', () => {
    const raw = '{"a":1} 之后的补充 {完毕}';
    expect(extractJsonObject(raw)).toBe('{"a":1}');
  });

  it('无对象 → 抛错', () => {
    expect(() => extractJsonObject('没有任何 JSON')).toThrow('未找到合法 JSON');
  });
});

describe('fetchWithTimeout', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('超时未返回 → 抛 AbortError（H2：不再无限挂起）', async () => {
    vi.useFakeTimers();
    // 模拟真实 fetch：signal 触发 abort 时 reject
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_input: unknown, init?: RequestInit) =>
          new Promise((_, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('The operation was aborted.', 'AbortError'))
            );
          })
      )
    );

    const p = fetchWithTimeout('http://example.com', {}, 100);
    const assertion = expect(p).rejects.toThrow(/abort/i);
    await vi.advanceTimersByTimeAsync(150);
    await assertion;
  });

  it('正常返回 → resolve 响应', async () => {
    const resp = new Response('ok');
    vi.stubGlobal('fetch', vi.fn(async () => resp));
    await expect(fetchWithTimeout('http://example.com', {}, 1000)).resolves.toBe(resp);
  });
});
