/** 队列状态仪表：三态（空闲 / 渲染中 / 离线）。Header 右侧与 Rail 队列概况共用。 */

interface QueueIndicatorProps {
  /** Redis / 队列是否可达（轮询失败时为 false） */
  queueOnline: boolean;
  /** 是否任一任务处于 active */
  anyActive: boolean;
  className?: string;
}

export function QueueIndicator({ queueOnline, anyActive, className = '' }: QueueIndicatorProps) {
  const dot = !queueOnline
    ? 'bg-danger'
    : anyActive
      ? 'bg-accent animate-pulse'
      : 'bg-muted';
  const hint = !queueOnline ? '队列离线' : anyActive ? '渲染中' : '空闲';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] text-muted ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {hint}
    </span>
  );
}
