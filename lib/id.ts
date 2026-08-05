import { randomUUID } from 'node:crypto';

/** 生成消息/事件唯一 id（对话消息用） */
export const newId = (): string => randomUUID();
