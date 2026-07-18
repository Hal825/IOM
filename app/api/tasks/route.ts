import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/queue';
import { jobToSummary } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

/** 创建任务：{ text: string } → { id } */
export async function POST(request: Request) {
  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求体不是合法 JSON' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return NextResponse.json({ error: '文本不能为空' }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: '文本过长（最多 2000 字）' }, { status: 400 });
  }

  try {
    const queue = getQueue();
    const job = await queue.add('generate-video', { text });
    return NextResponse.json({ id: String(job.id), status: 'waiting' }, { status: 201 });
  } catch (err) {
    console.error('[api] 创建任务失败:', err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}

/** 任务列表：最近 50 条，新的在前 */
export async function GET() {
  try {
    const queue = getQueue();
    const jobs = await queue.getJobs(
      ['waiting', 'active', 'completed', 'failed', 'delayed', 'paused'],
      0,
      49,
      false
    );
    const tasks = await Promise.all(jobs.map(jobToSummary));
    tasks.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error('[api] 查询任务列表失败:', err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
