import { NextResponse } from 'next/server';
import { createConversationStore } from '@/lib/conversations/store';

export const dynamic = 'force-dynamic';

/** 拉取任务对话历史（前端初始加载 / 轮询兜底） */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = await createConversationStore().read(id);
  return NextResponse.json({ conversation });
}
