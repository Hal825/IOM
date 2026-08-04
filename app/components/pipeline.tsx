const PIPELINE_STAGES = ['调研', '提案', '脚本', '素材', '逐镜头视频', '拼接'];

type PipelineState = 'idle' | 'queued' | 'active' | 'paused' | 'done' | 'failed';

function stateOf(status: string): PipelineState {
  switch (status) {
    case 'waiting':
      return 'queued';
    case 'active':
      return 'active';
    case 'paused':
      return 'paused';
    case 'completed':
      return 'done';
    case 'failed':
      return 'failed';
    default:
      return 'idle';
  }
}

const CHIP: Record<PipelineState, string> = {
  idle: 'border-border bg-panel text-muted',
  queued: 'border-border bg-panel text-muted',
  active: 'border-accent/50 bg-accent/10 text-accent',
  paused: 'border-border bg-muted/10 text-muted',
  done: 'border-success/50 bg-success/10 text-success',
  failed: 'border-danger/50 bg-danger/10 text-danger',
};

const CAPTION: Record<PipelineState, string> = {
  idle: '',
  queued: '排队中',
  active: '处理中',
  paused: '已暂停',
  done: '已完成',
  failed: '失败',
};

interface PipelineProps {
  status: string;
}

/**
 * 流水线六阶段。
 * 诚实约束：后端仅 0/10/100 三档进度，无法定位具体阶段，
 * 故整条流水线按任务状态统一着色、不伪造逐阶段百分比。
 */
export function Pipeline({ status }: PipelineProps) {
  const state = stateOf(status);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-muted">流水线进度</span>
        {CAPTION[state] ? (
          <span className="font-mono text-[10px] text-muted">{CAPTION[state]}</span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PIPELINE_STAGES.map((s) => (
          <span
            key={s}
            className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
              CHIP[state]
            } ${state === 'active' ? 'animate-pulse' : ''}`}
          >
            {s}
          </span>
        ))}
      </div>
      {state === 'active' ? (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full w-1/3 animate-indeterminate rounded-full bg-accent" />
        </div>
      ) : null}
    </div>
  );
}
