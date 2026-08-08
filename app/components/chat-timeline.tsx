'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TaskSummary } from '@/lib/types';
import type { ConversationMessage, AgentMessage, SystemMessage } from '@/lib/conversations/types';
import { openTaskStream, replyToTask, rerunTask } from '@/lib/api';
import { formatRelativeTime } from './format';
import { Pipeline } from './pipeline';
import { StatusBadge } from './status-badge';
import { IconBrand, IconDownload, IconPause, IconPlay, IconTrash } from './icons';
import { NodeCard } from './cards/node-card';
import { UserBubble, QuestionBubble, SystemLine, AgentBubble } from './bubbles';
import { ThinkingCard } from './thinking-card';

interface ChatTimelineProps {
  task: TaskSummary | null;
  onTogglePause?: (id: string, paused: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

// memo：流式 token 高频 setState 时，历史消息 props 未变即可跳过重渲染
const MessageItem = memo(function MessageItem({
  message,
  onRerun,
}: {
  message: ConversationMessage;
  onRerun?: (nodeName: string) => void;
}) {
  switch (message.kind) {
    case 'card':
      return <NodeCard message={message} onRerun={onRerun} />;
    case 'agent':
      return (
        <AgentBubble text={message.text} nodeName={message.nodeName} onRerun={onRerun} />
      );
    case 'gate':
      return <QuestionBubble message={message} />;
    case 'text':
      return <UserBubble text={message.text} />;
    case 'status':
      return <SystemLine text={message.text} />;
    default:
      return null;
  }
});

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
  // 前端 agent 流式：正在生成的文本（打字机效果），agent 完成事件后用全文替换
  const [streaming, setStreaming] = useState<{ nodeName: string; text: string } | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  // 流式增量缓冲：delta 先入 ref，按动画帧合并 flush，避免每 token 一次全树渲染
  const streamBufRef = useRef<{ nodeName: string; text: string } | null>(null);
  const streamRafRef = useRef<number | null>(null);
  // 删除确认按钮的还原定时器（卸载时需清理）
  const confirmTimerRef = useRef<number | null>(null);

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
      onRerun(d) {
        const label = d.label ?? d.nodeName;
        setMessages((prev) => [
          ...prev,
          {
            id: `rerun-${Date.now()}`,
            jobId: taskId,
            role: 'system',
            kind: 'status',
            text: `已从「${label}」重跑，正在重新生成…`,
            createdAt: new Date().toISOString(),
          } satisfies SystemMessage,
        ]);
      },
      onAgentDelta(d) {
        // 增量先合入缓冲，下一动画帧统一 setState（高频 token → 每帧最多一次渲染）
        const buf = streamBufRef.current;
        streamBufRef.current =
          buf?.nodeName === d.nodeName
            ? { nodeName: buf.nodeName, text: buf.text + d.delta }
            : { nodeName: d.nodeName, text: d.delta };
        if (streamRafRef.current === null) {
          streamRafRef.current = requestAnimationFrame(() => {
            streamRafRef.current = null;
            if (streamBufRef.current) setStreaming(streamBufRef.current);
          });
        }
      },
      onAgent(m: AgentMessage) {
        streamBufRef.current = null; // 全文到达，丢弃缓冲
        setMessages((prev) => [...prev, m]);
        setStreaming((s) => (s?.nodeName === m.nodeName ? null : s));
      },
    });
    return () => {
      close();
      if (streamRafRef.current !== null) {
        cancelAnimationFrame(streamRafRef.current);
        streamRafRef.current = null;
      }
      streamBufRef.current = null;
    };
  }, [taskId]);

  // 新消息 / 流式增量 → 自动滚动到底。
  // 流式期间用即时滚动（auto）：密集增量下 smooth 动画会互相打断、永远追不上内容
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: streaming ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, streaming]);

  // 卸载时清理删除确认的还原定时器
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current !== null) {
        window.clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  // ── 派生数据（hooks 必须在 early return 之前；task 为空时取安全默认值）──
  const busy = task ? task.status === 'waiting' || task.status === 'active' : false;
  // 节点事件来源：旧 card 与新 agent 消息都算（流水线着色 / 思考中判断）
  // useMemo：流式 token 高频渲染时，messages 未变就不重算
  const completedNodes = useMemo(
    () =>
      messages
        .filter((m) => m.kind === 'card' || m.kind === 'agent')
        .map((m) => m.nodeName),
    [messages]
  );
  // 思考中：任务在跑且还没有任何节点消息、也还没开始流式 → 显示转圈 + 趣味对话
  const hasCards = useMemo(
    () => messages.some((m) => m.kind === 'card' || m.kind === 'agent'),
    [messages]
  );
  const thinking = busy && !hasCards && !streaming;
  // 重跑：任务非运行中时卡片显示「重跑」按钮
  const canRerun = !busy;

  const runAction = useCallback(async (fn: () => Promise<void>) => {
    try {
      setActionError(null);
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '操作失败');
    }
  }, []);

  /** 重跑节点：nodeName → 该节点及之后重新生成（上游保留）。useCallback 保持引用稳定，配合 memo(MessageItem)。 */
  const handleRerun = useCallback(
    (nodeName: string) => {
      if (!taskId) return;
      void runAction(() => rerunTask(taskId, nodeName));
    },
    [taskId, runAction]
  );

  if (!task) {
    return (
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-panel/60 p-10 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <IconBrand className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm text-muted">选择左侧任务查看对话，或先提交一段文本</p>
      </section>
    );
  }

  const handleDelete = () => {
    if (!onDelete) return;
    if (!confirming) {
      setConfirming(true);
      if (confirmTimerRef.current !== null) window.clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = window.setTimeout(() => {
        confirmTimerRef.current = null;
        setConfirming(false);
      }, 3000); // 3 秒未再点 → 还原
      return;
    }
    if (confirmTimerRef.current !== null) {
      window.clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
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

  /** 「继续」按钮：无输入直接放行决策点（等价发送文本「继续」，任意文本 = 继续 + 记录反馈） */
  const handleContinue = async () => {
    if (replying) return;
    setReplying(true);
    setReplyError(null);
    try {
      await replyToTask(task.id, '继续');
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/50 px-3 py-2 text-xs font-medium text-accent transition hover:bg-accent/10 disabled:opacity-40 md:py-1"
            >
              {task.status === 'paused' ? (
                <><IconPlay /> 继续</>
              ) : (
                <><IconPause /> 暂停</>
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleDelete}
            disabled={!onDelete}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition disabled:opacity-40 md:py-1 ${
              confirming
                ? 'border-danger/60 bg-danger/10 text-danger'
                : 'border-danger/50 text-danger hover:bg-danger/10'
            }`}
          >
            {confirming ? '确认删除？' : (<><IconTrash /> 删除</>)}
          </button>

          {task.status === 'completed' ? (
            <a
              href={`/api/tasks/${task.id}/download`}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/50 px-3 py-2 text-xs font-medium text-accent transition hover:bg-accent/10 md:py-1"
            >
              <IconDownload /> 下载 MP4
            </a>
          ) : null}
        </span>
      </header>

      {/* ② 对话消息列表（用户描述 → 节点卡 → 提问 → 回复 → …） */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <UserBubble text={task.text} original />
        {thinking ? <ThinkingCard /> : messages.map((m) => (
          <MessageItem key={m.id} message={m} onRerun={canRerun ? handleRerun : undefined} />
        ))}
        {streaming ? (
          <AgentBubble text={streaming.text} nodeName={streaming.nodeName} streaming />
        ) : null}
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
            回复 agent（可写修改意见，或直接点「继续」）
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
              placeholder="例如：写修改意见；或直接点「继续」……"
              rows={2}
              className="min-h-0 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted/70"
            />
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={() => void handleContinue()}
                disabled={replying}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 md:py-1.5"
              >
                {replying ? '处理中…' : '继续 →'}
              </button>
              <button
                type="submit"
                disabled={!replyText.trim() || replying}
                className="rounded-lg border border-info/50 px-4 py-2.5 text-sm font-medium text-info transition hover:bg-info/10 disabled:cursor-not-allowed disabled:opacity-40 md:py-1.5"
              >
                发送
              </button>
            </div>
          </div>
          {replyError ? (
            <p role="alert" className="mt-2 text-xs text-danger">
              {replyError}
            </p>
          ) : null}
        </form>
      ) : thinking ? null : (
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
