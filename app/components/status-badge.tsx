/** BullMQ 任务状态 → 中文标签 + 柔和着色的状态芯片。 */

interface StatusMeta {
  label: string;
  /** 芯片配色：文字/底色/描边同色系 */
  chip: string;
  /** 状态点颜色 */
  dot: string;
  /** 状态点是否呼吸闪烁 */
  pulse?: boolean;
}

const STATUS_META: Record<string, StatusMeta> = {
  waiting: {
    label: '排队中',
    chip: 'bg-info/10 text-info border-info/30',
    dot: 'bg-info',
  },
  active: {
    label: '处理中',
    chip: 'bg-accent/10 text-accent border-accent/30',
    dot: 'bg-accent',
    pulse: true,
  },
  completed: {
    label: '已完成',
    chip: 'bg-success/10 text-success border-success/30',
    dot: 'bg-success',
  },
  failed: {
    label: '失败',
    chip: 'bg-danger/10 text-danger border-danger/30',
    dot: 'bg-danger',
  },
  delayed: {
    label: '延迟',
    chip: 'bg-warning/10 text-warning border-warning/40',
    dot: 'bg-warning',
  },
  paused: {
    label: '已暂停',
    chip: 'bg-muted/10 text-muted border-border',
    dot: 'bg-muted',
  },
};

const FALLBACK: StatusMeta = {
  label: '未知',
  chip: 'bg-muted/10 text-muted border-border',
  dot: 'bg-muted',
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { ...FALLBACK, label: status || FALLBACK.label };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] ${meta.chip}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${meta.pulse ? 'animate-pulse' : ''}`}
      />
      {meta.label}
    </span>
  );
}
