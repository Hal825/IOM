'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TaskSummary } from '@/lib/types';

const POLL_INTERVAL_MS = 3000;

/** 任务状态 → 中文标签 + 颜色 */
const STATUS_META: Record<string,{label:string, className:string}> = {
  waiting: { label: '排队中', className: 'bg-slate-600' },
  active: { label: '处理中', className: 'bg-sky-600' },
  completed: { label: '已完成', className: 'bg-emerald-600' },
  failed: { label: '失败', className: 'bg-rose-600' },
  delayed: { label: '延迟', className: 'bg-amber-600' },
  paused: { label: '已暂停', className: 'bg-slate-500' },
};

export default function HomePage() {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback
  (
    async () => {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' });
      if (!res.ok) {
        // 尝试解析错误 JSON，失败则用 HTTP 状态
        const text = await res.text().catch(() => '');
        let message = `HTTP ${res.status}`;
        try {
          const err = JSON.parse(text);
          if (err.error) message = err.error;
        } catch { /* 非 JSON 响应（如 HTML 报错页）*/ }
        throw new Error(message);
      }
      const data = await res.json();
      setTasks(data.tasks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务列表失败');
    }
  }, 
  []);//useCallback 用于缓存 fetchTasks 函数，避免在每次渲染时都创建新的函数实例，从而优化性能。

  // 轮询任务列表
  useEffect(() => {
    fetchTasks();
    const timer = setInterval(fetchTasks, POLL_INTERVAL_MS);//每隔 POLL_INTERVAL_MS 毫秒调用 fetchTasks 函数，获取最新任务列表
    return () => clearInterval(timer);//这是 useEffect 的专属语法糖。React 规定：如果你返回了一个函数，React 就会把这个函数当作 “清理函数”
  }, [fetchTasks]);

  const handleSubmit = async () => {//提交文本生成视频任务
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const resText = await res.text().catch(() => '');
        let message = `HTTP ${res.status}`;
        try {
          const err = JSON.parse(resText);
          if (err.error) message = err.error;
        } catch { /* 非 JSON 响应 */ }
        throw new Error(message);
      }
      const data = await res.json();
      setText('');
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setSubmitting(false);//无论成功或失败，都将 submitting 状态重置为 false，允许用户再次提交任务
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">OpenMontage</h1>
          <p className="mt-1 text-sm text-slate-400">
            输入文本 → AI 自动生成角色素材与视频
          </p>
        </header>

        {/* 输入区 */}
        <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入要生成视频的文本，例如：你好世界。这是一个测试视频。欢迎使用 OpenMontage。"
            rows={4}
            maxLength={2000}
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm outline-none placeholder:text-slate-500 focus:border-sky-500"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">{text.length} / 2000</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? '提交中…' : '生成视频'}
            </button>
          </div>
        </section>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-2 text-sm text-rose-300">
            {error}
          </p>
        ) : null}

        {/* 任务列表 */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">任务列表</h2>
          {tasks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
              暂无任务，提交一段文本试试
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => {
                const meta = STATUS_META[task.status] ?? {
                  label: task.status,
                  className: 'bg-slate-600',
                };
                return (
                  <li
                    key={task.id}
                    className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1 truncate">
                        <span className="mr-2 text-xs text-slate-500">
                          #{task.id}
                        </span>
                        <span className="text-sm">{task.text}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs text-white ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    {/* 进度条 */}
                    {task.status === 'active' || task.status === 'waiting' ? (
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all duration-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    ) : null}

                    {/* 完成：下载按钮 */}
                    {task.status === 'completed' ? (
                      <div className="mt-3">
                        <a
                          href={`/api/tasks/${task.id}/download`}
                          className="inline-block rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500"
                        >
                          ⬇ 下载 MP4
                        </a>
                      </div>
                    ) : null}

                    {/* 失败：错误原因 */}
                    {task.status === 'failed' && task.failedReason ? (
                      <p className="mt-2 text-xs text-rose-400">
                        {task.failedReason}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
