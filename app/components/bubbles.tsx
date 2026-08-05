'use client';

import type { GateQuestionMessage } from '@/lib/conversations/types';

/** 用户气泡：右侧靛蓝；original = 任务初始描述。 */
export function UserBubble({ text, original }: { text: string; original?: boolean }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-accent px-4 py-2.5 text-sm text-white shadow-sm">
        {original ? (
          <p className="mb-0.5 text-[10px] opacity-70">你的描述</p>
        ) : null}
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}

/** 决策点提问气泡：青色描边，等用户回复。 */
export function QuestionBubble({ message }: { message: GateQuestionMessage }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-info/40 bg-info/5 p-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-info/15 text-[11px] text-info">
        ?
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-info">{message.stage}</p>
        <p className="mt-0.5 text-sm text-foreground/90">{message.question}</p>
        <p className="mt-1 text-[10px] text-muted">等待你的回复后继续 →</p>
      </div>
    </div>
  );
}

/** 系统状态行：居中灰字。 */
export function SystemLine({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-border bg-panel px-3 py-2 text-center text-xs text-muted">
      {text}
    </p>
  );
}
