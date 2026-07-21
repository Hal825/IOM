import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/queue';
import { jobToSummary } from '@/lib/tasks';
import { videoGraph } from '../../lib/agent/graph';

export const dynamic = 'force-dynamic';

/** 创建任务：{ text: string } → 经 LangGraph 流水线（脚本→TTS→入队）→ { id } */
export async function POST(request: Request) {
  let body: { text?: unknown };//请求体
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求体不是合法 JSON' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';//提取 text 字段并去除首尾空白
  if (!text) {
    return NextResponse.json({ error: '文本不能为空' }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: '文本过长（最多 2000 字）' }, { status: 400 });
  }

  try {
    // LangGraph 状态机：脚本切分 → TTS → 入队（TTS 约 1-2 秒，入队毫秒级）
    const result = await videoGraph.invoke({ userPrompt: text });//返回 { jobId, script, audioPath }

    return NextResponse.json(
      { id: result.jobId, status: 'waiting' },
      { status: 201 }
    );
  } catch (err) {
    console.error('[api] 创建任务失败:', err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}

// | 参数位置 | 您的值 | 含义 | 实际效果 |
// |---------|--------|------|---------|
// | 第 1 个 | `['waiting', 'active', ...]` | 要查询的任务状态数组 | 同时查出等待中、执行中、已完成、已失败、延迟中、已暂停的任务 |
// | 第 2 个 | `0` | 起始索引（分页起点） | 从第 1 条记录开始取 |
// | 第 3 个 | `49` | 结束索引（分页终点） | 取到第 50 条记录为止（0~49 共 50 条） |
// | 第 4 个 | `false` | 是否升序排列（`asc`） | `false` = 降序排列（最新的任务排在最前面） |


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
    tasks.sort((a, b) => b.createdAt - a.createdAt);//降序 ()=>{}
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error('[api] 查询任务列表失败:', err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
