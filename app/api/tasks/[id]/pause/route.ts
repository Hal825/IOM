import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/queue';
import { setJobPaused } from '@/lib/pause';

export const dynamic = 'force-dynamic';

/** 逐任务暂停/恢复：POST { paused: boolean }（默认 paused=true）。 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let paused = true;
  try {
    const body = await request.json();
    if (typeof body?.paused === 'boolean') paused = body.paused;
  } catch {
    /* 无 body / 非 JSON → 默认暂停 */
  }

  try {
    const queue = getQueue();
    const job = await queue.getJob(id);
    if (!job) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }
    await setJobPaused(id, paused);
    return NextResponse.json({ ok: true, status: paused ? 'paused' : await job.getState() });
  } catch (err) {
    console.error(`[api] 暂停/恢复任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
