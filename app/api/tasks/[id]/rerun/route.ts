import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/queue';
import { getCoordinator } from '@/lib/coordinator';
import { createConversationStore } from '@/lib/conversations/store';
import {
  isJobPaused,
  setJobPaused,
  setJobAwaitingReply,
  markJobDeleted,
  clearJobDeleted,
  clearJobDecisions,
} from '@/lib/pause';
import { NODE_POSITION, NODE_LABELS, buildResumeState } from '@/lib/agent/rerun';

export const dynamic = 'force-dynamic';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 轮询 job 直到进入目标状态（如旧跑被删除标志中止后变 failed）；超时返回 null */
async function waitForJobState(
  job: { getState(): Promise<string> },
  targets: string[],
  timeoutMs: number
): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const state = await job.getState();
    if (targets.includes(state)) return state;
    if (Date.now() > deadline) return null;
    await sleep(500);
  }
}

/**
 * 重跑节点：POST { nodeName } → X 及之后全部重新生成（上游保留）。
 * 机制：`updateData(rerunFrom + resumeState)` + `job.retry(state)` **原地**重新入队 ——
 * 保留同一 jobId（对话线程与 storage 目录延续），并绕开 BullMQ「Custom Id cannot be integers」限制。
 * 暂停在门上的任务先 markJobDeleted 触发旧跑中止（变 failed），再 updateData + retry。
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { nodeName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求体不是合法 JSON' }, { status: 400 });
  }
  const nodeName = typeof body.nodeName === 'string' ? body.nodeName : '';
  if (!NODE_POSITION[nodeName]) {
    return NextResponse.json({ error: `无法重跑的节点: ${nodeName}` }, { status: 400 });
  }

  try {
    const queue = getQueue();
    const job = await queue.getJob(id);
    if (!job) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }

    const state = await job.getState();
    const paused = await isJobPaused(id);
    // 可重跑：已完成 / 已失败 / 暂停在门上（active+暂停标志）
    const rerunnable =
      state === 'completed' || state === 'failed' || (state === 'active' && paused);
    if (!rerunnable) {
      return NextResponse.json({ error: '任务当前状态无法重跑' }, { status: 409 });
    }

    // 上游产出 = 对话线程里 position < X 的卡（+ 同位置非 X 的并行兄弟卡），最新胜
    const conv = await createConversationStore().read(id);
    const resumeState = buildResumeState(conv?.messages ?? [], nodeName);

    // 暂停在门上的旧跑：标记删除 → pausePoint 检测到删除标志自动中止（job 变 failed）
    let retryState: 'failed' | 'completed' =
      state === 'active' ? 'failed' : (state as 'failed' | 'completed');
    if (state === 'active' && paused) {
      await markJobDeleted(id);
      const next = await waitForJobState(job, ['failed', 'completed'], 10_000);
      if (!next) {
        return NextResponse.json({ error: '旧任务中止超时，无法重跑' }, { status: 409 });
      }
      retryState = next as 'failed' | 'completed';
    }

    // 更新数据后原地 retry（保留同一 jobId，Worker 以 rerunFrom 初始状态跑同一张全图）
    await job.updateData({ text: job.data.text, rerunFrom: nodeName, resumeState });
    await job.retry(retryState);

    // 清暂停/待回复/决策点幂等键/删除标志，避免新跑立即再阻塞或门不重新提问
    await setJobPaused(id, false);
    await setJobAwaitingReply(id, false);
    await clearJobDecisions(id);
    await clearJobDeleted(id);

    // 追加「已从 X 重跑」标记 + 广播 rerun 事件（前端插系统行）
    await getCoordinator().rerunTask(id, nodeName);
    await getCoordinator().subscribe(id);

    return NextResponse.json({
      ok: true,
      status: 'waiting',
      label: NODE_LABELS[nodeName] ?? nodeName,
    });
  } catch (err) {
    console.error(`[api] 重跑任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '重跑失败，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
