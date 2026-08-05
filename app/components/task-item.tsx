import type { TaskSummary } from '@/lib/types';
import { formatRelativeTime } from './format';
import { StatusBadge } from './status-badge';

interface TaskItemProps {
  task: TaskSummary;
  selected: boolean;
  onSelect: (id: string) => void;
}

/** 侧栏任务行：#id + 截断文本 + 相对时间 + 状态芯片。 */
export function TaskItem({ task, selected, onSelect }: TaskItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(task.id)}
      aria-pressed={selected}
      className={`w-full border-l-2 px-3 py-2.5 text-left transition-colors ${
        selected
          ? 'border-accent bg-accent/8'
          : 'border-transparent hover:border-amber-200 hover:bg-amber-100'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">#{task.id}</span>
        <span className="flex items-center gap-1.5">
          {task.awaitingReply ? (
            <span className="rounded-full border border-info/40 bg-info/10 px-1.5 py-0.5 text-[10px] text-info">
              待回复
            </span>
          ) : null}
          <StatusBadge status={task.status} />
        </span>
      </div>
      <p className="mt-1 truncate text-[13px] text-foreground/90">{task.text}</p>
      <p className="mt-0.5 font-mono text-[10px] text-muted">
        {formatRelativeTime(task.createdAt)}
      </p>
    </button>
  );
}
