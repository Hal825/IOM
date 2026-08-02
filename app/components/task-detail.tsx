import type { TaskSummary } from '@/lib/types';
import { formatRelativeTime } from './format';
import { StatusBadge } from './status-badge';
import { VideoPlayer } from './video-player';

/**
 * 右侧画布：选中任务的详情。
 * 后端进度仅有 0 → 10 → 100 三个刻度（见 lib/agent/orchestrator.ts），
 * 因此 waiting/active 展示不定的动画进度条，而非伪造百分比。
 */
export function TaskDetail({ task }: { task: TaskSummary | null }) {
  if (!task) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-panel/60 p-10 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg text-accent">
          ▸
        </span>
        <p className="mt-3 text-sm text-muted">选择左侧任务查看详情，或先提交一段文本</p>
      </section>
    );
  }

  const inProgress = task.status === 'waiting' || task.status === 'active';

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-panel p-4 shadow-card md:p-5">
      <header className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted">#{task.id}</span>
        <StatusBadge status={task.status} />
        <span className="ml-auto font-mono text-[11px] text-muted">
          {formatRelativeTime(task.createdAt)}
        </span>
      </header>

      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
        {task.text}
      </p>

      {inProgress ? (
        <div>
          <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full w-1/3 animate-indeterminate rounded-full bg-accent" />
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted">
            {task.status === 'active'
              ? 'Worker 处理中：调研 → 提案 → 脚本 → 素材 → 逐镜头视频 → 拼接…'
              : '排队中，等待 Worker 拾取…'}
          </p>
        </div>
      ) : null}

      {task.status === 'failed' ? (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2">
          <p className="text-xs font-medium text-danger">失败原因</p>
          <p className="mt-1 break-words text-xs text-danger/90">
            {task.failedReason || '未知错误'}
          </p>
        </div>
      ) : null}

      {task.status === 'completed' ? (
        <div className="flex flex-col gap-3">
          <VideoPlayer taskId={task.id} />
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-muted">
              {/* durationSec 在早期完成的任务中可能缺失（旧 Worker 的 returnvalue 无此字段） */}
              {task.result && typeof task.result.durationSec === 'number'
                ? `时长 ${task.result.durationSec.toFixed(1)}s`
                : ''}
            </span>
            <a
              href={`/api/tasks/${task.id}/download`}
              download
              className="rounded-lg border border-accent/50 px-4 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/10"
            >
              ⬇ 下载 MP4
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
