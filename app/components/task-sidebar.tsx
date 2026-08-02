import type { TaskSummary } from '@/lib/types';
import { TaskItem } from './task-item';

interface TaskSidebarProps {
  tasks: TaskSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Redis/队列是否可达（轮询失败时为 false） */
  queueOnline: boolean;
  className?: string;
}

/** 左栏：队列状态 + 可滚动任务列表。 */
export function TaskSidebar({
  tasks,
  selectedId,
  onSelect,
  queueOnline,
  className = '',
}: TaskSidebarProps) {
  const anyActive = tasks.some((t) => t.status === 'active');
  const dot = !queueOnline
    ? 'bg-danger'
    : anyActive
      ? 'bg-accent animate-pulse'
      : 'bg-muted';
  const hint = !queueOnline ? '队列离线' : anyActive ? '渲染中' : '空闲';

  return (
    <aside className={`flex min-h-0 flex-col bg-panel ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xs font-medium text-muted">任务列表</h2>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {hint}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="mx-3 rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-muted">
          {queueOnline ? '暂无任务，提交一段文本试试' : '无法连接队列，请确认 Redis 已启动'}
        </p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-border">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              selected={task.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
