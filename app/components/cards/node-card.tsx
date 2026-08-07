'use client';

import type { NodeCardMessage } from '@/lib/conversations/types';
import { formatClock } from '../format';
import { CARD_LABELS, NodeCardBody } from './registry';

/**
 * 节点结果卡（对话时间线里 agent 决定呈现的卡片外壳）：
 * ① 头部：卡片标签 + 节点名 + [重跑] + 时间戳 → ② LLM 点评（可选）→ ③ 卡片主体。
 */
export function NodeCard({
  message,
  onRerun,
}: {
  message: NodeCardMessage;
  /** 重跑回调（传入时显示「重跑」按钮）：nodeName → 该节点及之后重新生成 */
  onRerun?: (nodeName: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">
          {CARD_LABELS[message.cardType]}
        </span>
        <span className="font-mono text-[10px] text-muted">{message.nodeName}</span>
        <span className="ml-auto flex items-center gap-2">
          {onRerun ? (
            <button
              type="button"
              onClick={() => onRerun(message.nodeName)}
              title="重新生成此节点及之后"
              className="rounded-lg border border-accent/50 px-2.5 py-0.5 text-[11px] font-medium text-accent transition hover:bg-accent/10"
            >
              ↻ 重跑
            </button>
          ) : null}
          <span className="font-mono text-[10px] text-muted">
            {formatClock(message.createdAt)}
          </span>
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
