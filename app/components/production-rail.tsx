import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { TaskSummary } from '@/lib/types';
import { formatRelativeTime } from './format';
import { IconDownload } from './icons';
import { RailCollapseStrip } from './rail-collapse';

/** 每分钟重渲染一次列表，让「N 分钟前」相对时间保持新鲜（轮询引用稳定后不再顺带刷新）。 */
function useMinuteTick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);
}

/** 列表底部虚化的融入色（浅绿底），见 globals.css .rail-list */
const RAIL_FADE = { '--rail-fade': '#ecfdf5' } as CSSProperties;

interface ProductionRailProps {
  tasks: TaskSummary[];
  selectedId: string | null;
  /** 点击成品行 → 选中对应任务并切到主区详情 */
  onSelect: (id: string) => void;
  /** 是否处于收起态（窄条） */
  collapsed?: boolean;
  /** 切换收起/展开（收起时窄条上的展开按钮复用此回调） */
  onToggleCollapse?: () => void;
  className?: string;
}

interface ProductionRowProps {
  task: TaskSummary;
  selected: boolean;
  onSelect: (id: string) => void;
}

/**
 * 右栏「成品库」（浅绿底）：已完成任务的成片清单。
 * 每行 = #id + 标题 + 时长/相对时间 + 「⬇ 下载」；点击行选中任务切主区。
 * 滚动结构：整条 rail 不滚动，只有成品列表内部 overflow-y。
 * 收起态 = 窄条（RailCollapseStrip）：保留展开入口，不占内容区宽度。
 */
export function ProductionRail({
  tasks,
  selectedId,
  onSelect,
  collapsed = false,
  onToggleCollapse,
  className = '',
}: ProductionRailProps) {
  useMinuteTick();
  const completed = tasks.filter((t) => t.status === 'completed');

  if (collapsed) {
    return (
      <aside className={`flex min-h-0 flex-col bg-emerald-50 ${className}`}>
        <RailCollapseStrip label="成品库" icon="⟨" onExpand={() => onToggleCollapse?.()} />
      </aside>
    );
  }

  return (
    <aside className={`flex min-h-0 flex-col bg-emerald-50 ${className}`} style={RAIL_FADE}>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <h2 className="text-xs font-medium text-emerald-900">成品库</h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-emerald-900/70">{completed.length}</span>
          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="收起成品库"
              aria-label="收起成品库"
              aria-expanded="true"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-xs text-emerald-900/60 transition hover:bg-emerald-200/60 hover:text-emerald-900 md:h-7 md:w-7"
            >
              ⟩
            </button>
          ) : null}
        </div>
      </div>

      {completed.length === 0 ? (
        <p className="mx-3 mb-3 rounded-lg border border-dashed border-emerald-300 px-3 py-8 text-center text-xs text-emerald-900/80">
          暂无已完成任务，成片会出现在这里
        </p>
      ) : (
        <div className="rail-list min-h-0 flex-1 overflow-y-auto border-t border-emerald-200">
          {completed.map((task) => (
            <ProductionRow
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

function ProductionRow({ task, selected, onSelect }: ProductionRowProps) {
  const durationSec = task.result?.durationSec;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(task.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(task.id);
        }
      }}
      className={`cursor-pointer border-l-2 px-3 py-2.5 transition-colors ${
        selected
          ? 'border-accent bg-accent/8'
          : 'border-transparent hover:border-emerald-200 hover:bg-emerald-100'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">#{task.id}</span>
        <a
          href={`/api/tasks/${task.id}/download`}
          download
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded border border-emerald-500/40 px-2.5 py-2 text-[10px] font-medium text-emerald-700 transition hover:bg-emerald-100 md:px-1.5 md:py-0.5"
        >
          <IconDownload className="h-3 w-3" /> 下载
        </a>
      </div>
      <p className="mt-1 truncate text-[13px] text-foreground/90">{task.text}</p>
      <p className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted">
        {durationSec != null ? <span>{durationSec.toFixed(1)}s</span> : null}
        <span>{formatRelativeTime(task.createdAt)}</span>
      </p>
    </div>
  );
}
