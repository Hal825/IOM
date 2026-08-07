/**
 * 对话线程存储 — 每任务一个 JSON 文件（storage/conversations/{jobId}/conversation.json）。
 *
 * 并发安全设计（修复 H：此前 append 是「read → mutate → writeFile」三段式，多个 SSE 事件并发
 * 追加时出现 丢失更新（后写覆盖先写）+ 截断 JSON（writeFile 先截断后写入，中断即半成品）。
 * 现在：
 *   1. 每 jobId 一个写队列，把 read-modify-write 串行化 —— 并发 append 不再丢消息；
 *   2. 原子写（同目录临时文件 + rename）—— 进程中断也不会留下截断的半成品 JSON。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { newId } from '@/lib/id';
import type { ConversationFile, ConversationMessage } from './types';

/** 对话存储根目录 */
export const CONVERSATIONS_DIR = path.resolve('./storage/conversations');
/** 单线程最大消息数（超出从最早截断） */
export const MAX_MESSAGES = 500;

export interface ConversationStore {
  read(jobId: string): Promise<ConversationFile | null>;
  append(jobId: string, message: ConversationMessage): Promise<ConversationFile>;
  remove(jobId: string): Promise<void>;
}

function conversationPath(jobId: string, baseDir: string): string {
  return path.join(baseDir, jobId, 'conversation.json');
}

/** 原子写：先写同目录唯一临时文件，再 rename 覆盖目标，避免截断的半成品 JSON */
async function writeFileAtomic(filePath: string, data: string): Promise<void> {
  const tmpPath = `${filePath}.${newId()}.tmp`;
  await fs.writeFile(tmpPath, data, 'utf-8');
  await fs.rename(tmpPath, filePath);
}

export function createConversationStore(baseDir: string = CONVERSATIONS_DIR): ConversationStore {
  // 每 jobId 一个写队列（promise 链）：串行化 append/remove 的 read-modify-write。
  const queues = new Map<string, Promise<unknown>>();

  const enqueue = <T>(jobId: string, fn: () => Promise<T>): Promise<T> => {
    const tail = queues.get(jobId) ?? Promise.resolve();
    const run = tail.then(fn, fn); // 尾链总是已 settle，fn 顺序执行
    // 存「吞掉错误」的尾链，保证后续任务照常排队；run 携带真实结果/错误返回给调用方
    queues.set(
      jobId,
      run.then(
        () => undefined,
        () => undefined
      )
    );
    return run;
  };

  const read = async (jobId: string): Promise<ConversationFile | null> => {
    try {
      const raw = await fs.readFile(conversationPath(jobId, baseDir), 'utf-8');
      return JSON.parse(raw) as ConversationFile;
    } catch {
      return null;
    }
  };

  const append = (jobId: string, message: ConversationMessage): Promise<ConversationFile> =>
    enqueue(jobId, async () => {
      const existing = await read(jobId);
      const now = new Date().toISOString();
      const conv: ConversationFile = existing ?? {
        jobId,
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      conv.messages.push(message);
      if (conv.messages.length > MAX_MESSAGES) {
        conv.messages = conv.messages.slice(-MAX_MESSAGES);
      }
      conv.updatedAt = now;
      const dir = path.join(baseDir, jobId);
      await fs.mkdir(dir, { recursive: true });
      await writeFileAtomic(conversationPath(jobId, baseDir), JSON.stringify(conv, null, 2));
      return conv;
    });

  const remove = (jobId: string): Promise<void> =>
    enqueue(jobId, async () => {
      await fs.rm(path.join(baseDir, jobId), { recursive: true, force: true });
    });

  return { read, append, remove };
}
