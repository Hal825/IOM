'use client';

import type { NodeCardMessage } from '@/lib/conversations/types';
import { formatClock } from '../format';
import { CARD_LABELS, NodeCardBody } from './registry';

/**
 * 节点结果卡（对话时间线里 agent 决定呈现的卡片外壳）：
 * ① 头部：卡片标签 + 节点名 + 时间戳 → ② LLM 点评（可选）→ ③ 卡片主体。
 */
export function NodeCard({ message }: { message: NodeCardMessage }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">
          {CARD_LABELS[message.cardType]}
        </span>
        <span className="font-mono text-[10px] text-muted">{message.nodeName}</span>
        <span className="ml-auto font-mono text-[10px] text-muted">
          {formatClock(message.createdAt)}
        </span>
      </div>
      {message.comment ? (
        <p className="mt-1.5 text-xs italic text-muted">{message.comment}</p>
      ) : null}
      <div className="mt-2">
        <NodeCardBody cardType={message.cardType} payload={message.payload} jobId={message.jobId} />
      </div>
    </div>
  );
}
