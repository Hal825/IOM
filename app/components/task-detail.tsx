'use client';

import { useState } from 'react';
import type { TaskSummary } from '@/lib/types';
import { formatRelativeTime } from './format';
import { Pipeline } from './pipeline';
import { StatusBadge } from './status-badge';
import { VideoPlayer } from './video-player';

interface TaskDetailProps {
  task: TaskSummary | null;
  /** 暂停 / 恢复：id + 是否暂停 */
  onTogglePause?: (id: string, paused: boolean) => Promise<void>;
  /** 删除任务 */
  onDelete?: (id: string) => Promise<void>;
}

/**
 * 内容区「节点成果卡」——对话时间线当前唯一渲染的卡类型（每轮任务 = 一张）。
 * 结构：① 视频预览三态 → ② 任务元信息 → ③ 流水线六阶段 → ④ 操作行（暂停/继续/删除/下载）。
 */
export function TaskDetail({ task, onTogglePause, onDelete }: TaskDetailProps) {
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const busy = task.status === 'waiting' || task.status === 'active';
  const paused = task.status === 'paused';

  const runAction = async (fn: () => Promise<void>) => {
    try {
      setActionError(null);
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '操作失败');
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 3000); // 3 秒未再点 → 还原
      return;
    }
    setConfirming(false);
    void runAction(() => onDelete(task.id));
  };

  return (
    <section className="flex flex-1 flex-col gap-4 rounded-xl border border-emerald-500/30 bg-panel p-4 shadow-card md:p-5">
      {/* ① 视频预览（三态：空态 / 处理中 / 已暂停 / 完成） */}
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

      {/* 失败原因 */}
      {task.status === 'failed' ? (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2">
          <p className="text-xs font-medium text-danger">失败原因</p>
          <p className="mt-1 break-words text-xs text-danger/90">
            {task.failedReason || '未知错误'}
          </p>
        </div>
      ) : null}

      {/* ④ 操作行：暂停/继续 + 删除（两步确认）；完成时含时长 + 下载 */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {busy || paused ? (
          <button
            type="button"
            onClick={() =>
              void runAction(async () => {
                if (!onTogglePause) return;
                await onTogglePause(task.id, !paused);
              })
            }
            disabled={!onTogglePause}
            className="rounded-lg border border-accent/50 px-4 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/10 disabled:opacity-40"
          >
            {paused ? '▶ 继续' : '⏸ 暂停'}
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleDelete}
          disabled={!onDelete}
          className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
            confirming
              ? 'border-danger/60 bg-danger/10 text-danger'
              : 'border-danger/50 text-danger hover:bg-danger/10'
          }`}
        >
          {confirming ? '确认删除?' : '🗑 删除'}
        </button>

        {/* durationSec 在早期完成的任务中可能缺失（旧 Worker 的 returnvalue 无此字段） */}
        {task.status === 'completed' &&
        task.result &&
        typeof task.result.durationSec === 'number' ? (
          <span className="font-mono text-[11px] text-muted">
            {`时长 ${task.result.durationSec.toFixed(1)}s`}
          </span>
        ) : null}

        {task.status === 'completed' ? (
          <a
            href={`/api/tasks/${task.id}/download`}
            download
            className="ml-auto rounded-lg border border-accent/50 px-4 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/10"
          >
            ⬇ 下载 MP4
          </a>
        ) : null}
      </div>

      {actionError ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger"
        >
          {actionError}
        </p>
      ) : null}
    </section>
  );
}

/**
 * 视频预览：完成 → <video>；处理中 → 骨架占位；已暂停 → 灰色占位；否则 → 空态引导。
 * 宽度限制 max-w-2xl 并居中：避免 16:9 撑满 Stage 太高，完整视频无需滚动即可看到。
 */
function VideoArea({ task }: { task: TaskSummary }) {
  const busy = task.status === 'waiting' || task.status === 'active';
  const paused = task.status === 'paused';
  const tone = paused
    ? 'border-muted/40 bg-muted/5'
    : busy
      ? 'border-accent/40 bg-accent/5'
      : 'border-info/40 bg-info/5';
  const iconTone = paused
    ? 'border-muted/50 text-muted'
    : busy
      ? 'border-accent/50 text-accent'
      : 'border-info/50 text-info';
  const hint = paused
    ? '已暂停 · 恢复后继续生成'
    : busy
      ? '视频渲染中 · 完成后在此播放'
      : '暂无视频 · 提交描述后在此生成';

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
