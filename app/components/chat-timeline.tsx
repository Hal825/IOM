'use client';

import { useEffect, useRef, useState } from 'react';
import type { TaskSummary } from '@/lib/types';
import type { ConversationMessage } from '@/lib/conversations/types';
import { openTaskStream, replyToTask } from '@/lib/api';
import { formatRelativeTime } from './format';
import { Pipeline } from './pipeline';
import { StatusBadge } from './status-badge';
import { NodeCard } from './cards/node-card';
import { UserBubble, QuestionBubble, SystemLine } from './bubbles';

interface ChatTimelineProps {
  task: TaskSummary | null;
  onTogglePause?: (id: string, paused: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

function MessageItem({ message }: { message: ConversationMessage }) {
  switch (message.kind) {
    case 'card':
      return <NodeCard message={message} />;
    case 'gate':
      return <QuestionBubble message={message} />;
    case 'text':
      return <UserBubble text={message.text} />;
    case 'status':
      return <SystemLine text={message.text} />;
    default:
      return null;
  }
}

/**
 * 内容区「对话时间线」——方案 B 的前端呈现：
 * 用户初始描述气泡 → 节点结果卡逐张流入（agent 决定卡片类型 + 可选点评）
 * → 决策点提问气泡（等回复）→ 用户回复气泡 → … → 成片卡。
 * 顶部任务头（id + 状态 + 操作行），底部流水线按真实节点事件逐节点着色。
 */
export function ChatTimeline({ task, onTogglePause, onDelete }: ChatTimelineProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  // 父组件按 task.id 加 key 重挂载，初始值直接取自 prop，无需在 effect 里同步 setState
  const [awaiting, setAwaiting] = useState(task?.awaitingReply ?? false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const taskId = task?.id ?? null;

  // 打开 SSE 订阅（仅随任务 id 变化重连；3s 轮询只刷新 task 对象，不会重建连接）
  useEffect(() => {
    if (!taskId) return;
    const close = openTaskStream(taskId, {
      onHello(conv) {
        setMessages(conv?.messages ?? []);
      },
      onCard(m) {
        setMessages((prev) => [...prev, m]);
      },
      onGate(m) {
        setMessages((prev) => [...prev, m]);
        setAwaiting(true);
      },
      onUser(m) {
        setMessages((prev) => [...prev, m]);
      },
      onProceed() {
        setAwaiting(false);
      },
      onStatus(d) {
        if (d.status === 'failed') setAwaiting(false);
      },
    });
    return close;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // 新消息自动滚动到底
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  if (!task) {
    return (
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-panel/60 p-10 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg text-accent">
          ▸
        </span>
        <p className="mt-3 text-sm text-muted">选择左侧任务查看对话，或先提交一段文本</p>
      </section>
    );
  }

  const busy = task.status === 'waiting' || task.status === 'active';
  const completedNodes = messages
    .filter((m) => m.kind === 'card')
    .map((m) => m.nodeName);

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

  const handleReply = async () => {
    const text = replyText.trim();
    if (!text || replying) return;
    setReplying(true);
    setReplyError(null);
    try {
      await replyToTask(task.id, text);
      setReplyText('');
      // 用户消息/继续信号会经 SSE（onUser / onProceed）回流，这里不重复追加
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : '回复失败');
    } finally {
      setReplying(false);
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      {/* ① 任务头：id + 状态 + 操作行 */}
      <header className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-panel px-4 py-3">
        <span className="font-mono text-xs text-muted">#{task.id}</span>
        <StatusBadge status={task.status} />
        {awaiting ? (
          <span className="rounded-full border border-info/40 bg-info/10 px-2 py-0.5 text-[11px] text-info">
            等待回复
          </span>
        ) : null}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {formatRelativeTime(task.createdAt)}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          {busy || task.status === 'paused' ? (
            <button
              type="button"
              onClick={() =>
                void runAction(async () => {
                  if (!onTogglePause) return;
                  await onTogglePause(task.id, task.status === 'paused');
                })
              }
              disabled={!onTogglePause}
              className="rounded-lg border border-accent/50 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/10 disabled:opacity-40"
            >
              {task.status === 'paused' ? '▶ 继续' : '⏸ 暂停'}
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleDelete}
            disabled={!onDelete}
            className={`rounded-lg border px-3 py-1 text-xs font-medium transition disabled:opacity-40 ${
              confirming
                ? 'border-danger/60 bg-danger/10 text-danger'
                : 'border-danger/50 text-danger hover:bg-danger/10'
            }`}
          >
            {confirming ? '确认删除?' : '🗑 删除'}
          </button>

          {task.status === 'completed' ? (
            <a
              href={`/api/tasks/${task.id}/download`}
              download
              className="rounded-lg border border-accent/50 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/10"
            >
              ⬇ 下载 MP4
            </a>
          ) : null}
        </span>
      </header>

      {/* ② 对话消息列表（用户描述 → 节点卡 → 提问 → 回复 → …） */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <UserBubble text={task.text} original />
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>

      {/* ③ 流水线：真实节点事件逐节点着色（诚实） */}
      <Pipeline status={task.status} completedNodes={completedNodes} />

      {/* ④ 决策点回复框 / 空闲提示 */}
      {awaiting ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleReply();
          }}
          className="rounded-xl border border-info/40 bg-panel p-3 shadow-card focus-within:border-info/60"
        >
          <label htmlFor="reply-text" className="text-xs font-medium text-info">
            回复 agent（任意文本 = 继续 + 记录反馈）
          </label>
          <div className="mt-2 flex gap-2">
            <textarea
              id="reply-text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  void handleReply();
                }
              }}
              placeholder="例如：继续；或写修改意见（v1 仅记录，不重跑）……"
              rows={2}
              className="min-h-0 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted/70"
            />
            <button
              type="submit"
              disabled={!replyText.trim() || replying}
              className="shrink-0 self-end rounded-lg bg-info px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-info/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {replying ? '发送中…' : '发送'}
            </button>
          </div>
          {replyError ? (
            <p role="alert" className="mt-2 text-xs text-danger">
              {replyError}
            </p>
          ) : null}
        </form>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-panel/50 px-4 py-2.5 text-center text-xs text-muted">
          {task.status === 'completed'
            ? '视频已完成 · 可在左侧新建任务'
            : '管线运行中 · 下一个决策点会在此停下等你回复'}
        </p>
      )}

      {actionError ? (
        <p role="alert" className="text-xs text-danger">
          {actionError}
        </p>
      ) : null}
    </section>
  );
}
