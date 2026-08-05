'use client';

import { VideoPlayer } from '../video-player';
import type { CardBodyProps } from './registry';

/** 成片卡：最终视频播放器 + 时长 + 下载。 */
export function VideoCard({ payload, jobId }: CardBodyProps) {
  const durationSec =
    typeof payload.durationSec === 'number' ? payload.durationSec : null;
  const mergeLog =
    typeof payload.mergeLog === 'string' ? payload.mergeLog : null;

  return (
    <div className="space-y-2">
      <VideoPlayer taskId={jobId} />
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {durationSec != null ? (
          <span className="font-mono text-muted">{`时长 ${durationSec.toFixed(1)}s`}</span>
        ) : null}
        <a
          href={`/api/tasks/${jobId}/download`}
          download
          className="ml-auto rounded-lg border border-accent/50 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/10"
        >
          ⬇ 下载 MP4
        </a>
      </div>
      {mergeLog ? <p className="font-mono text-[10px] text-muted">{mergeLog}</p> : null}
    </div>
  );
}
