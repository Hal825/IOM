import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/queue';
import { deleteTaskFiles, jobToSummary } from '@/lib/tasks';
import { markJobDeleted } from '@/lib/pause';

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

/** 删除任务：标记删除（让暂停中的管线检测后中止）→ 移除 job → 清理该任务产物。幂等。 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await markJobDeleted(id);
    const queue = getQueue();
    const job = await queue.getJob(id);
    if (job) await job.remove();
    await deleteTaskFiles(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[api] 删除任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
