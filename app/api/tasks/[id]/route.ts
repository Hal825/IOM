import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/queue';
import { deleteTaskFiles, jobToSummary, removeJobWithRetry } from '@/lib/tasks';
import { markJobDeleted } from '@/lib/pause';
import { getCoordinator } from '@/lib/coordinator';

export const dynamic = 'force-dynamic';

/** 查询单个任务状态 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const queue = getQueue();
    const job = await queue.getJob(id);
    if (!job) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }
    return NextResponse.json(await jobToSummary(job));
  } catch (err) {
    console.error(`[api] 查询任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}

/**
 * 删除任务：标记删除（让暂停中的管线检测后中止）→ 移除 job（运行中任务锁错误重试，仍失败则兜底）
 * → 清理该任务产物 → 退订事件。幂等。
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let removeFailed = false;
  try {
    await markJobDeleted(id);
    const queue = getQueue();
    const job = await queue.getJob(id);
    if (job) {
      const removed = await removeJobWithRetry(job);
      removeFailed = !removed; // 仍被锁：靠 om:deleted 标志让管线中止，记录残留为 failed
    }
    await deleteTaskFiles(id);
    await getCoordinator().unsubscribe(id);
    return NextResponse.json({
      ok: true,
      note: removeFailed
        ? '任务正被处理，记录已标记删除、产物已清理；管线将在暂停点中止'
        : undefined,
    });
  } catch (err) {
    console.error(`[api] 删除任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
