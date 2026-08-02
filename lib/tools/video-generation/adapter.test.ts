import { describe, it, expect } from 'vitest';
import { createVideoAdapter } from './adapter';
import './adapters/happyhorse-r2v'; // 注册内置模型

describe('createVideoAdapter', () => {
  it('返回 happyhorse-1.1-r2v 适配器', () => {
    const adapter = createVideoAdapter('happyhorse-1.1-r2v');
    expect(adapter.model).toBe('happyhorse-1.1-r2v');
    expect(typeof adapter.generateVideo).toBe('function');
  });

  it('容忍模型名两端空白', () => {
    expect(createVideoAdapter('  happyhorse-1.1-r2v  ').model).toBe('happyhorse-1.1-r2v');
  });

  it('未知模型零容错抛错，且信息含已知模型列表', () => {
    expect(() => createVideoAdapter('unknown-model')).toThrowError(/未知视频模型/);
    expect(() => createVideoAdapter('unknown-model')).toThrowError(/happyhorse-1.1-r2v/);
  });
});
