import type { TaskSummary } from '@/lib/types';
import { QueueIndicator } from './queue-indicator';
import { TaskItem } from './task-item';

interface TaskSidebarProps {
  tasks: TaskSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** 点击「＋新建任务」→ 内容区切换为创建表单 */
  onNewTask: () => void;
  /** Redis/队列是否可达（轮询失败时为 false） */
  queueOnline: boolean;
  className?: string;
}

/**
 * 左栏（琥珀浅底）：顶部「队列概况」（含「＋新建任务」入口） + 可滚动「任务列表」。
 * 滚动结构：整条 rail 不滚动，只有任务列表内部 overflow-y。
 */
export function TaskSidebar({
  tasks,
  selectedId,
  onSelect,
  onNewTask,
  queueOnline,
  className = '',
}: TaskSidebarProps) {
  const anyActive = tasks.some((t) => t.status === 'active');

  return (
    <aside className={`flex min-h-0 flex-col bg-amber-50 ${className}`}>
      {/* 队列概况 + 「＋新建任务」入口（蓝图 v2） */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <h2 className="text-xs font-medium text-amber-900">队列概况</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewTask}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
          >
            ＋ 新建任务
          </button>
          <QueueIndicator queueOnline={queueOnline} anyActive={anyActive} />
        </div>
      </div>

      {/* 任务列表标题 */}
      <div className="flex items-center justify-between border-t border-amber-200 px-4 py-2">
        <h3 className="text-[11px] font-medium text-amber-800/80">任务列表</h3>
        <span className="font-mono text-[10px] text-amber-800/60">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="mx-3 mb-3 rounded-lg border border-dashed border-amber-300 px-3 py-8 text-center text-xs text-amber-800/70">
          {queueOnline ? '暂无任务，提交一段文本试试' : '无法连接队列，请确认 Redis 已启动'}
        </p>
      ) : (
        <div className="rail-list min-h-0 flex-1 overflow-y-auto border-t border-amber-200">
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
