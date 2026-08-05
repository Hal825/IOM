'use client';

import type { SceneVideoResult } from '@/lib/agent/state';
import type { CardBodyProps } from './registry';

/** 逐镜头视频卡：每镜头真实生成结果（ffprobe 实测时长）。 */
export function ShotsCard({ payload }: CardBodyProps) {
  const results = (payload.sceneVideos as SceneVideoResult[] | undefined) ?? [];
  if (results.length === 0) return <p className="text-xs text-muted">（无镜头视频数据）</p>;

  const done = results.filter((r) => r.status === 'done').length;
  const total = results.reduce((s, r) => s + (r.durationSec ?? 0), 0);

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p>
        <span className="font-medium text-foreground">{done}/{results.length} 个镜头已生成</span>
        <span className="text-muted"> · 合计约 {Math.round(total)}s</span>
      </p>
      <ul className="space-y-0.5 font-mono text-[11px] text-muted">
        {results.map((r) => (
          <li key={r.sceneId}>
            {r.sceneId} · {r.durationSec?.toFixed(1)}s · {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
