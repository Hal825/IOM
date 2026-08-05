import { NextResponse } from 'next/server';
import { getCoordinator } from '@/lib/coordinator';

export const dynamic = 'force-dynamic';

/** 用户回复决策点：{ text } → 追加用户消息 + 反馈落盘 + 清暂停/待回复标志 → Worker 放行 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求体不是合法 JSON' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return NextResponse.json({ error: '回复内容不能为空' }, { status: 400 });
  }

  try {
    const conversation = await getCoordinator().submitReply(id, text);
    return NextResponse.json({ ok: true, conversation });
  } catch (err) {
    console.error(`[api] 回复任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '回复失败，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
