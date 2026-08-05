const STAGES = [
  { key: 'research', label: '调研' },
  { key: 'generate_proposal', label: '提案' },
  { key: 'script_generation', label: '脚本' },
  { key: 'asset_gen', label: '素材' },
  { key: 'tts', label: '配音' },
  { key: 'scene_json_assembler', label: '组装' },
  { key: 'shot_video_gen', label: '逐镜头视频' },
  { key: 'video_merge', label: '拼接' },
];

type StageState = 'idle' | 'done' | 'active' | 'paused' | 'failed';

const CHIP: Record<StageState, string> = {
  idle: 'border-border bg-panel text-muted',
  done: 'border-success/50 bg-success/10 text-success',
  active: 'border-accent/50 bg-accent/10 text-accent',
  paused: 'border-border bg-muted/10 text-muted',
  failed: 'border-danger/50 bg-danger/10 text-danger',
};

const CAPTION: Record<string, string> = {
  waiting: '排队中',
  active: '处理中',
  paused: '已暂停',
  completed: '已完成',
  failed: '失败',
};

interface PipelineProps {
  status: string;
  /** 已产出卡片的节点名（来自对话时间线的真实节点事件） */
  completedNodes?: string[];
}

/**
 * 流水线八节点。
 * 诚实约束升级：不再「整条统一着色」——节点一旦在对话时间线里产卡（真实事件），
 * 对应阶段即标绿；首个未完成阶段按整体状态显示 处理中/已暂停/失败。
 */
export function Pipeline({ status, completedNodes = [] }: PipelineProps) {
  const doneSet = new Set(completedNodes);
  const firstNotDone = STAGES.findIndex((s) => !doneSet.has(s.key));

  const stateOf = (i: number): StageState => {
    if (doneSet.has(STAGES[i].key)) return 'done';
    if (i !== firstNotDone) return 'idle';
    if (status === 'failed') return 'failed';
    if (status === 'active') return 'active';
    if (status === 'paused') return 'paused';
    return 'idle';
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-muted">流水线进度</span>
        {CAPTION[status] ? (
          <span className="font-mono text-[10px] text-muted">{CAPTION[status]}</span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {STAGES.map((s, i) => {
          const st = stateOf(i);
          return (
            <span
              key={s.key}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] ${CHIP[st]} ${
                st === 'active' ? 'animate-pulse' : ''
              }`}
            >
              {s.label}
            </span>
          );
        })}
      </div>
      {status === 'active' ? (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full w-1/3 animate-indeterminate rounded-full bg-accent" />
        </div>
      ) : null}
    </div>
  );
}
