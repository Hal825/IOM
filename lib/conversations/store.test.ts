import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createConversationStore } from './store';
import type { ConversationFile, SystemMessage } from './types';

/**
 * 回归测试：append 此前是「read → mutate → writeFile」三段式，并发追加会
 * 丢失更新（后写覆盖先写）+ 截断 JSON（writeFile 先截断后写入）。
 * 修复后：每 jobId 串行化 read-modify-write + 原子写。
 */

function msg(jobId: string, i: number): SystemMessage {
  return {
    id: `m-${i}`,
    jobId,
    role: 'system',
    kind: 'status',
    text: `消息 ${i}`,
    createdAt: new Date().toISOString(),
  };
}

describe('ConversationStore 并发安全', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'om-store-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('并发 append 不丢消息，文件保持合法 JSON（修复丢失更新 + 截断）', async () => {
    const store = createConversationStore(tmpDir);
    const jobId = '99';
    const N = 30;

    await Promise.all(
      Array.from({ length: N }, (_, i) => store.append(jobId, msg(jobId, i)))
    );

    // 文件必须是完整合法 JSON（非截断半成品）
    const raw = fs.readFileSync(path.join(tmpDir, jobId, 'conversation.json'), 'utf-8');
    const conv = JSON.parse(raw) as ConversationFile;
    expect(conv.messages).toHaveLength(N); // 无丢失更新
    const texts = conv.messages.map((m) => (m as SystemMessage).text);
    expect(new Set(texts).size).toBe(N); // 每条唯一，无重复追加
  });

  it('remove 排队于已提交 append 之后：删除后不残留（确定性顺序）', async () => {
    const store = createConversationStore(tmpDir);
    const jobId = '100';

    const appends = [
      store.append(jobId, msg(jobId, 0)),
      store.append(jobId, msg(jobId, 1)),
    ];
    const rm = store.remove(jobId);
    await Promise.all([...appends, rm]);

    expect(fs.existsSync(path.join(tmpDir, jobId))).toBe(false);
  });
});
