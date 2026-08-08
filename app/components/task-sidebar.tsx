import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { TaskSummary } from '@/lib/types';
import { QueueIndicator } from './queue-indicator';
import { TaskItem } from './task-item';
import { RailCollapseStrip } from './rail-collapse';

/** 每分钟重渲染一次列表，让「N 分钟前」相对时间保持新鲜（轮询引用稳定后不再顺带刷新）。 */
function useMinuteTick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);
}

/** 列表底部虚化的融入色（琥珀底），见 globals.css .rail-list */
const RAIL_FADE = { '--rail-fade': '#fffbeb' } as CSSProperties;

interface TaskSidebarProps {
  tasks: TaskSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** 点击「＋新建任务」→ 内容区切换为创建表单 */
  onNewTask: () => void;
  /** Redis/队列是否可达（轮询失败时为 false） */
  queueOnline: boolean;
  /** 是否处于收起态（窄条） */
  collapsed?: boolean;
  /** 切换收起/展开（收起时窄条上的展开按钮复用此回调） */
  onToggleCollapse?: () => void;
  className?: string;
}

/**
 * 左栏（琥珀浅底）：顶部「队列概况」（含「＋新建任务」入口） + 可滚动「任务列表」。
 * 滚动结构：整条 rail 不滚动，只有任务列表内部 overflow-y。
 * 收起态 = 窄条（RailCollapseStrip）：保留展开入口，不占内容区宽度。
 */
export function TaskSidebar({
  tasks,
  selectedId,
  onSelect,
  onNewTask,
  queueOnline,
  collapsed = false,
  onToggleCollapse,
  className = '',
}: TaskSidebarProps) {
  useMinuteTick();
  const anyActive = tasks.some((t) => t.status === 'active');

  if (collapsed) {
    return (
      <aside className={`flex min-h-0 flex-col bg-amber-50 ${className}`}>
        <RailCollapseStrip
          label="任务列表"
          icon="⟩"
          onExpand={() => onToggleCollapse?.()}
        />
      </aside>
    );
  }

  return (
    <aside className={`flex min-h-0 flex-col bg-amber-50 ${className}`} style={RAIL_FADE}>
      {/* 队列概况 + 「＋新建任务」入口（蓝图 v2）+ 收起按钮 */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <h2 className="text-xs font-medium text-amber-900">队列概况</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewTask}
            className="rounded-lg bg-accent px-3 py-2.5 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md md:py-1.5"
          >
            ＋ 新建任务
          </button>
          <QueueIndicator queueOnline={queueOnline} anyActive={anyActive} />
          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="收起任务栏"
              aria-label="收起任务栏"
              aria-expanded="true"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-xs text-amber-900/60 transition hover:bg-amber-200/60 hover:text-amber-900 md:h-7 md:w-7"
            >
              ⟨
            </button>
          ) : null}
        </div>
      </div>

      {/* 任务列表标题 */}
      <div className="flex items-center justify-between border-t border-amber-200 px-4 py-2">
        <h3 className="text-[11px] font-medium text-amber-900/80">任务列表</h3>
        <span className="font-mono text-[10px] text-amber-900/70">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="mx-3 mb-3 rounded-lg border border-dashed border-amber-300 px-3 py-8 text-center text-xs text-amber-900/80">
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
