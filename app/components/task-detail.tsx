import type { TaskSummary } from '@/lib/types';
import { formatRelativeTime } from './format';
import { Pipeline } from './pipeline';
import { StatusBadge } from './status-badge';
import { VideoPlayer } from './video-player';

/**
 * 内容区「节点成果卡」——对话时间线当前唯一渲染的卡类型（每轮任务 = 一张）。
 * 结构（按蓝图）：① 视频预览三态 → ② 任务元信息 → ③ 流水线六阶段 → ④ 失败/下载栏。
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

  // flex-1（而非 min-h-full）：内容短时撑满 Stage、内容长时自然增高由外层滚动
  // 承载 —— 不依赖百分比高度，避免卡片与 Composer 之间出现空隙。
  return (
    <section className="flex flex-1 flex-col gap-4 rounded-xl border border-emerald-500/30 bg-panel p-4 shadow-card md:p-5">
      {/* ① 视频预览（三态：空态 / 处理中 / 完成） */}
      <VideoArea task={task} />

      {/* ② 任务元信息 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted">#{task.id}</span>
        <StatusBadge status={task.status} />
        <span className="ml-auto font-mono text-[11px] text-muted">
          {formatRelativeTime(task.createdAt)}
        </span>
      </div>

      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
        {task.text}
      </p>

      {/* ③ 流水线六阶段（诚实约束：仅按任务状态统一着色，不伪造逐阶段） */}
      <Pipeline status={task.status} />

      {/* ④ 失败原因 / 完成产物栏 */}
      {task.status === 'failed' ? (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2">
          <p className="text-xs font-medium text-danger">失败原因</p>
          <p className="mt-1 break-words text-xs text-danger/90">
            {task.failedReason || '未知错误'}
          </p>
        </div>
      ) : null}

      {task.status === 'completed' ? (
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
      ) : null}
    </section>
  );
}

/**
 * 视频预览三态：完成 → <video>；处理中 → 骨架占位；否则 → 空态引导。
 * 宽度限制 max-w-2xl 并居中：避免 16:9 撑满 Stage 太高，完整视频无需滚动即可看到。
 */
function VideoArea({ task }: { task: TaskSummary }) {
  const busy = task.status === 'waiting' || task.status === 'active';
  const tone = busy ? 'border-accent/40 bg-accent/5' : 'border-info/40 bg-info/5';
  const iconTone = busy ? 'border-accent/50 text-accent' : 'border-info/50 text-info';
  const hint = busy ? '视频渲染中 · 完成后在此播放' : '暂无视频 · 提交描述后在此生成';

  return (
    <div className="mx-auto w-full max-w-xl">
      {task.status === 'completed' ? (
        <VideoPlayer taskId={task.id} />
      ) : (
        <div
          className={`flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed ${tone} text-muted`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-dashed ${iconTone} ${
              busy ? 'animate-pulse' : ''
            }`}
          >
            ▷
          </span>
          <span className="text-[11px]">{hint}</span>
        </div>
      )}
    </div>
  );
}
