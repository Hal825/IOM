import { NextResponse } from 'next/server';
import { setJobPaused, setJobAwaitingReply } from '@/lib/pause';
import { createConversationStore } from '@/lib/conversations/store';
import { getSseHub } from '@/lib/sse/hub';
import { newId } from '@/lib/id';
import type { SystemMessage } from '@/lib/conversations/types';

export const dynamic = 'force-dynamic';

/**
 * 方案 B · Claude 视频生成器的放行端点（scripts/claude-video-gen.ts 收尾时调用）。
 * 清 paused/awaiting 标志（worker 的 pause_gate_video 放行）+ 追加系统消息 + 广播 proceed。
 * 必须在 API 进程内执行 —— SSE hub 是进程内扇出，跨进程 broadcast 到不了浏览器。
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await setJobPaused(id, false);
    await setJobAwaitingReply(id, false);

    const now = new Date().toISOString();
    const msg: SystemMessage = {
      id: newId(),
      jobId: id,
      role: 'system',
      kind: 'status',
      text: 'Claude 已生成各场景视频，继续拼接…',
      createdAt: now,
    };
    await createConversationStore().append(id, msg);
    getSseHub().broadcast(id, {
      event: 'proceed',
      data: { gateId: 'pause_gate_video', resumedAt: now },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[api] claude-release ${id} 失败:`, err);
    return NextResponse.json(
      { error: '放行失败，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
