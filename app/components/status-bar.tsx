const VERSION = 'v0.1.0';

interface StatusBarProps {
  queueOnline: boolean;
  taskCount: number;
}

/** 状态栏（石板浅底）：左队列 / Worker 连接状态，右任务数 / 版本。 */
export function StatusBar({ queueOnline, taskCount }: StatusBarProps) {
  return (
    <footer className="flex items-center justify-between gap-3 border-t border-border bg-[#f1f5f9] px-4 py-1.5 font-mono text-[11px] text-[#475569]">
      <span className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${queueOnline ? 'bg-muted' : 'bg-danger'}`}
        />
        {queueOnline ? '队列已连接 · Worker 空闲' : '队列离线'}
      </span>
      <span>
        任务 {taskCount} · {VERSION}
      </span>
    </footer>
  );
}
