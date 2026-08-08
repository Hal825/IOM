'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TaskSummary, VideoMode } from '@/lib/types';
import { createTask, deleteTask, listTasks, setTaskPaused } from '@/lib/api';
import { EmptyHero } from './new-task-page';
import { IconBrand } from './icons';
import { QueueIndicator } from './queue-indicator';
import { StatusBar } from './status-bar';
import { ChatTimeline } from './chat-timeline';
import { TaskSidebar } from './task-sidebar';
import { ProductionRail } from './production-rail';

// 有任务在跑/排队时高频轮询，全部空闲时降频；标签页隐藏时暂停（见下方调度 effect）
const POLL_ACTIVE_MS = 3000;
const POLL_IDLE_MS = 10000;

/**
 * 逐字段浅比较任务列表：数据未变时保留旧数组引用，
 * 避免每次轮询都触发整棵 Workbench 树重渲染。
 */
function sameTaskList(a: TaskSummary[], b: TaskSummary[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (
      x.id !== y.id ||
      x.status !== y.status ||
      x.progress !== y.progress ||
      x.text !== y.text ||
      x.createdAt !== y.createdAt ||
      x.awaitingReply !== y.awaitingReply ||
      x.failedReason !== y.failedReason ||
      x.result?.durationSec !== y.result?.durationSec
    ) {
      return false;
    }
  }
  return true;
}

// 侧栏收起/展开的 localStorage 键（左右各自独立记住用户偏好）
const LS_LEFT_RAIL = 'om:rail-left-collapsed';
const LS_RIGHT_RAIL = 'om:rail-right-collapsed';

// 左右两栏收/展的 4 种组合 → 静态 grid 列类（Tailwind JIT 需完整类名，不能动态拼接）
const RAIL_GRID_COLS = {
  bothOpen: 'md:grid-cols-[280px_minmax(0,1fr)_260px]',
  leftClosed: 'md:grid-cols-[44px_minmax(0,1fr)_260px]',
  rightClosed: 'md:grid-cols-[280px_minmax(0,1fr)_44px]',
  bothClosed: 'md:grid-cols-[44px_minmax(0,1fr)_44px]',
} as const;

function readCollapsed(key: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(key) === '1';
}

/**
 * 顶层工作台，按蓝图四行三列组装：
 *   header（品牌区 ↔ 队列状态仪表）
 *   / rail（通高侧栏，队列概况含「＋新建任务」）| 内容区 + 输入区 | 成品库（右栏）\
 *   status（全宽状态栏）
 * 内容区两态（蓝图 v2 简化）：默认进入初始状态页（EmptyHero 大输入横跨内容区+输入区）；
 *   点选侧栏任务 / 右栏成品 → 详情（节点成果卡）。移动端折叠：内容 → 成品 → 任务列表。
 */
export function Workbench() {
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 蓝图 v2：内容区两态 —— 默认初始状态页 EmptyHero（大输入横跨内容区+输入区），
  // 点「＋新建任务」回到初始状态页；点选侧栏任务 → TaskDetail。
  const [contentView, setContentView] = useState<'create' | 'detail'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueOnline, setQueueOnline] = useState(true);
  // 左右两栏收起/展开。注意：不能在 useState 初始化器里读 localStorage——
  // 服务端预渲染读不到（恒展开）、客户端读到持久化值（收起）→ hydration mismatch。
  // 首帧一律展开保证 SSR/CSR 一致，mount 后用 effect 恢复偏好（restored 门控避免写回覆盖）。
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [restored, setRestored] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await listTasks();
      // 数据未变 → 保留旧引用，跳过本次重渲染
      setTasks((prev) => (sameTaskList(prev, list) ? prev : list));
      setQueueOnline(true);
    } catch {
      // 轮询失败不弹错（多半是 Redis 离线），仅标记队列状态
      setQueueOnline(false);
    }
  }, []);

  // 是否有任务在排队/执行中（决定轮询频率；用 ref 避免重建定时器）
  const anyActive = tasks.some((t) => t.status === 'active' || t.status === 'waiting');
  const anyActiveRef = useRef(anyActive);
  // ref 同步放进 effect（render 期间写 ref 违反 react-hooks/refs 规则）
  useEffect(() => {
    anyActiveRef.current = anyActive;
  }, [anyActive]);

  // 自适应轮询：活跃 3s / 空闲 10s；标签页隐藏时暂停，回到前台立即补一次。
  // 用 setTimeout 链而非 setInterval：请求耗时不会与下次触发重叠。
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      if (!document.hidden) await refresh();
      if (!cancelled) {
        timer = setTimeout(run, anyActiveRef.current ? POLL_ACTIVE_MS : POLL_IDLE_MS);
      }
    };
    const onVisibility = () => {
      if (!document.hidden) void refresh(); // 回前台立即校准一次
    };

    timer = setTimeout(run, 0); // 首次异步发起，避免在 effect 体内同步 setState
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  // mount 后从 localStorage 恢复偏好（hydration 完成后才读 window，避免 SSR 不一致）。
  // rAF 回调里 setState：effect 体内同步 setState 会触发级联渲染（react-hooks/set-state-in-effect）
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setLeftCollapsed(readCollapsed(LS_LEFT_RAIL));
      setRightCollapsed(readCollapsed(LS_RIGHT_RAIL));
      setRestored(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // 偏好写回 localStorage；restored 门控——恢复前不写，避免用首帧展开态覆盖持久化收起态
  useEffect(() => {
    if (!restored) return;
    window.localStorage.setItem(LS_LEFT_RAIL, leftCollapsed ? '1' : '0');
  }, [leftCollapsed, restored]);
  useEffect(() => {
    if (!restored) return;
    window.localStorage.setItem(LS_RIGHT_RAIL, rightCollapsed ? '1' : '0');
  }, [rightCollapsed, restored]);

  const toggleLeftRail = useCallback(() => setLeftCollapsed((c) => !c), []);
  const toggleRightRail = useCallback(() => setRightCollapsed((c) => !c), []);

  // 渲染期间直接派生有效选中项：未选中 / 选中项已被队列清理（保留最近 100 条）时回退到最新任务
  const effectiveSelectedId =
    tasks.length === 0
      ? null
      : selectedId !== null && tasks.some((t) => t.id === selectedId)
        ? selectedId
        : tasks[0].id;

  // 点选侧栏任务 / 成品库成品 → 内容区切任务详情（两栏共用同一选中动作）
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setContentView('detail');
  }, []);

  const handleSubmit = useCallback(async (text: string, videoMode: VideoMode = 'auto') => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createTask(text, videoMode);
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
      setContentView('detail'); // 提交成功回到任务详情视图
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
      throw err; // 抛回 Composer 以保留草稿
    } finally {
      setSubmitting(false);
    }
  }, []);

  const selected = tasks.find((t) => t.id === effectiveSelectedId) ?? null;

  // 左右两栏收/展 → 三列宽度（静态类映射，见 RAIL_GRID_COLS）
  const gridCols =
    leftCollapsed && rightCollapsed
      ? RAIL_GRID_COLS.bothClosed
      : leftCollapsed
        ? RAIL_GRID_COLS.leftClosed
        : rightCollapsed
          ? RAIL_GRID_COLS.rightClosed
          : RAIL_GRID_COLS.bothOpen;

  // 逐任务暂停/恢复 + 删除（错误由 TaskDetail 的 runAction 捕获展示）
  const handleTogglePause = useCallback(async (id: string, paused: boolean) => {
    await setTaskPaused(id, paused);
    await refresh();
  }, [refresh]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteTask(id);
    setContentView('create'); // 删除后回到初始状态页
    await refresh();
  }, [refresh]);

  return (
    // 桌面端用固定高度 h-dvh：flex 在 definite height 下才能正确分配空间，
    // 避免被 flex-grow 撑长（min-h-dvh 只是下限，会失控增长）；移动端保留自然滚动折叠
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:h-dvh">
      {/* 页头：品牌区（左）↔ 队列状态仪表（右）。h-14 = 蓝图 56px 固定行高 */}
      <header className="flex h-14 items-center gap-3 border-b border-border bg-panel px-4 md:px-6">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-sm"
        >
          <IconBrand className="h-4 w-4" />
        </span>
        <h1 className="text-sm font-semibold tracking-wide">OpenMontage</h1>
        <span className="hidden text-[11px] text-muted sm:inline">文本生成视频</span>
        <span className="ml-auto">
          <QueueIndicator queueOnline={queueOnline} anyActive={anyActive} />
        </span>
      </header>

      {/* 中部 Grid：任务栏 + 内容区 + 成品库三列通高（栏可收起为 44px 窄条）。
           移动端 grid-cols-1 = repeat(1, minmax(0,1fr))：单列可收缩，防长文本把列撑破；
           md:grid-rows 显式填满 —— 静态布局吃满剩余高度，长内容由内部滚动承载 */}
      <div
        className={`grid flex-1 grid-cols-1 ${gridCols} md:grid-rows-[minmax(0,1fr)] md:min-h-0`}
      >
        <TaskSidebar
          tasks={tasks}
          selectedId={effectiveSelectedId}
          onSelect={handleSelect}
          onNewTask={() => setContentView('create')}
          queueOnline={queueOnline}
          collapsed={leftCollapsed}
          onToggleCollapse={toggleLeftRail}
          className="order-3 min-w-0 border-t border-border md:order-none md:border-r md:border-t-0"
        />

        {/* 右列：内容区 + 输入区（蓝图 v2 两态）
             初始 / 新建 → EmptyHero 大输入横跨内容区+输入区（无独立 Composer）
             详情 → ChatTimeline 对话时间线（任务头 + 节点卡 + 流水线 + 决策点回复框） */}
        <main className="order-1 flex min-w-0 flex-col gap-4 p-4 md:order-none md:min-h-0 md:p-6">
          {contentView === 'create' ? (
            <EmptyHero onSubmit={handleSubmit} submitting={submitting} error={error} />
          ) : (
            <ChatTimeline
              key={selected?.id ?? 'empty'}
              task={selected}
              onTogglePause={handleTogglePause}
              onDelete={handleDelete}
            />
          )}
        </main>

        {/* 右栏成品库：已完成任务成片清单（点击选中任务 → 切主区详情） */}
        <ProductionRail
          tasks={tasks}
          selectedId={effectiveSelectedId}
          onSelect={handleSelect}
          collapsed={rightCollapsed}
          onToggleCollapse={toggleRightRail}
          className="order-2 min-w-0 border-t border-border md:order-none md:border-l md:border-t-0"
        />
      </div>

      <StatusBar queueOnline={queueOnline} taskCount={tasks.length} />
    </div>
  );
}
