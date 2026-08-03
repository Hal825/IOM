'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TaskSummary } from '@/lib/types';
import { createTask, listTasks } from '@/lib/api';
import { Composer } from './composer';
import { QueueIndicator } from './queue-indicator';
import { StatusBar } from './status-bar';
import { TaskDetail } from './task-detail';
import { TaskSidebar } from './task-sidebar';

const POLL_INTERVAL_MS = 3000;

/**
 * 顶层工作台，按蓝图四行两列组装：
 *   header（品牌区 ↔ 队列状态仪表）
 *   / rail（通高侧栏） | stage（可滚动时间线）+ composer（底部）\
 *   status（全宽状态栏）
 * 移动端（≤960px）折叠为：页头 → 内容区 → 输入区 → 侧边栏 → 状态栏。
 */
export function Workbench() {
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueOnline, setQueueOnline] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const list = await listTasks();
      setTasks(list);
      setQueueOnline(true);
    } catch {
      // 轮询失败不弹错（多半是 Redis 离线），仅标记队列状态
      setQueueOnline(false);
    }
  }, []);

  // 轮询任务列表（首次请求用 timeout 异步发起，避免在 effect 体内同步 setState）
  useEffect(() => {
    const kickoff = setTimeout(() => void refresh(), 0);
    const timer = setInterval(() => void refresh(), POLL_INTERVAL_MS);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, [refresh]);

  // 渲染期间直接派生有效选中项：未选中 / 选中项已被队列清理（保留最近 100 条）时回退到最新任务
  const effectiveSelectedId =
    tasks.length === 0
      ? null
      : selectedId !== null && tasks.some((t) => t.id === selectedId)
        ? selectedId
        : tasks[0].id;

  const handleSubmit = useCallback(async (text: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createTask(text);
      // 乐观插入：先立即出现在侧栏并选中，下一次轮询会用服务端数据校准
      const optimistic: TaskSummary = {
        id: created.id,
        status: created.status,
        progress: 0,
        text,
        createdAt: Date.now(),
      };
      setTasks((prev) => [optimistic, ...prev.filter((t) => t.id !== created.id)]);
      setSelectedId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
      throw err; // 抛回 Composer 以保留草稿
    } finally {
      setSubmitting(false);
    }
  }, []);

  const selected = tasks.find((t) => t.id === effectiveSelectedId) ?? null;
  const anyActive = tasks.some((t) => t.status === 'active');

  return (
    // 桌面端用固定高度 h-dvh：flex 在 definite height 下才能正确分配空间，
    // 避免被 flex-grow 撑长（min-h-dvh 只是下限，会失控增长）；移动端保留自然滚动折叠
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:h-dvh">
      {/* 页头：品牌区（左）↔ 队列状态仪表（右） */}
      <header className="flex items-center gap-3 border-b border-border bg-panel px-4 py-3 md:px-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs text-white shadow-sm">
          ▸
        </span>
        <h1 className="text-sm font-semibold tracking-wide">OpenMontage</h1>
        <span className="hidden text-[11px] text-muted sm:inline">文本生成视频</span>
        <span className="ml-auto">
          <QueueIndicator queueOnline={queueOnline} anyActive={anyActive} />
        </span>
      </header>

      {/* 中部 Grid：rail 通高（跨 stage + composer 两行）。
           md:grid-rows 显式填满 —— 静态布局吃满剩余高度，长内容由内部滚动承载 */}
      <div className="grid flex-1 md:grid-cols-[280px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] md:min-h-0">
        <TaskSidebar
          tasks={tasks}
          selectedId={effectiveSelectedId}
          onSelect={setSelectedId}
          queueOnline={queueOnline}
          className="order-2 border-t border-border md:order-none md:border-r md:border-t-0"
        />

        {/* 右列：stage（可滚动时间线）+ composer（底部编辑器） */}
        <main className="order-1 flex min-w-0 flex-col gap-4 p-4 md:order-none md:min-h-0 md:p-6">
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
            <TaskDetail task={selected} />
          </div>
          <Composer onSubmit={handleSubmit} submitting={submitting} error={error} />
        </main>
      </div>

      <StatusBar queueOnline={queueOnline} taskCount={tasks.length} />
    </div>
  );
}
