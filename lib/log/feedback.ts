/**
 * 用户反馈落盘 — 决策点回复时，把「用户在哪个门、针对哪个节点产物、说了什么」记下来。
 * 每任务一个 JSON 数组文件（storage/feedback/{jobId}.json），供后续分析/重跑参考。
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/** 反馈存储目录 */
export const FEEDBACK_DIR = path.resolve('./storage/feedback');

export interface FeedbackEntry {
  jobId: string;
  /** 回复的决策点门 id（pause_gate_1..4） */
  gateId: string;
  /** 该门之前的节点名（反馈针对的产物） */
  nodeName: string;
  userText: string;
  /** 该节点产物的快照（feedback 时刻） */
  cardPayload: Record<string, unknown>;
  repliedAt: string;
}

/** 追加一条反馈记录，返回文件路径。dir 可注入（测试用临时目录）。 */
export async function saveFeedback(
  jobId: string,
  entry: Omit<FeedbackEntry, 'jobId' | 'repliedAt'>,
  dir: string = FEEDBACK_DIR
): Promise<string> {
  const filePath = path.join(dir, `${jobId}.json`);
  let existing: FeedbackEntry[] = [];
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) existing = parsed;
  } catch {
    /* 首次写入 */
  }
  const record: FeedbackEntry = {
    ...entry,
    jobId,
    repliedAt: new Date().toISOString(),
  };
  existing.push(record);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');
  return filePath;
}
