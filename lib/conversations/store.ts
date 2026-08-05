/**
 * 对话线程存储 — 每任务一个 JSON 文件（storage/conversations/{jobId}/conversation.json）。
 * 由 API 进程 coordinator 单写者追加；baseDir 可注入（测试用临时目录）。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
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

export function createConversationStore(baseDir: string = CONVERSATIONS_DIR): ConversationStore {
  const read = async (jobId: string): Promise<ConversationFile | null> => {
    try {
      const raw = await fs.readFile(conversationPath(jobId, baseDir), 'utf-8');
      return JSON.parse(raw) as ConversationFile;
    } catch {
      return null;
    }
  };

  const append = async (
    jobId: string,
    message: ConversationMessage
  ): Promise<ConversationFile> => {
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
    await fs.writeFile(
      conversationPath(jobId, baseDir),
      JSON.stringify(conv, null, 2),
      'utf-8'
    );
    return conv;
  };

  const remove = async (jobId: string): Promise<void> => {
    await fs.rm(path.join(baseDir, jobId), { recursive: true, force: true });
  };

  return { read, append, remove };
}
