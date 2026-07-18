import { NextResponse } from 'next/server';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { getQueue } from '@/lib/queue';
import { STORAGE_DIR } from '@/lib/tasks';
import type { TaskResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** 下载任务生成的 MP4 */
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

    const state = await job.getState();
    const result = job.returnvalue as TaskResult | undefined;
    if (state !== 'completed' || !result?.videoPath) {
      return NextResponse.json({ error: '视频尚未生成完成' }, { status: 409 });
    }

    // 防路径穿越：解析后必须仍在 STORAGE_DIR 内
    const videoAbsPath = path.resolve(STORAGE_DIR, result.videoPath);
    if (!videoAbsPath.startsWith(STORAGE_DIR)) {
      return NextResponse.json({ error: '非法路径' }, { status: 400 });
    }

    const stat = await fs.stat(videoAbsPath).catch(() => null);
    if (!stat) {
      return NextResponse.json({ error: '视频文件不存在（可能已被清理）' }, { status: 410 });
    }

    const stream = Readable.toWeb(
      createReadStream(videoAbsPath)
    ) as ReadableStream;

    return new Response(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="openmontage-${id}.mp4"`,
      },
    });
  } catch (err) {
    console.error(`[api] 下载任务 ${id} 失败:`, err);
    return NextResponse.json(
      { error: '队列不可用，请确认 Redis 已启动（npm run redis:up）' },
      { status: 503 }
    );
  }
}
