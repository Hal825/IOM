'use client';

import type { SceneAudioSegment } from '@/lib/agent/state';
import type { CardBodyProps } from './registry';

/** 配音卡：分段语音合成结果（每镜头一条对齐音频）。 */
export function AudioCard({ payload }: CardBodyProps) {
  const segments = (payload.audioSegments as SceneAudioSegment[] | undefined) ?? [];
  if (segments.length === 0) return <p className="text-xs text-muted">（无配音数据）</p>;

  const total = segments.reduce((s, a) => s + (a.durationSec ?? 0), 0);

  return (
    <div className="space-y-1 text-xs leading-relaxed">
      <p>
        <span className="font-medium text-foreground">{segments.length} 段配音</span>
        <span className="text-muted"> · 合计约 {Math.round(total)}s（已对齐镜头时长）</span>
      </p>
      <ul className="flex flex-wrap gap-1">
        {segments.map((s) => (
          <li key={s.sceneId} className="rounded-full border border-border bg-panel px-2 py-0.5 font-mono text-[10px] text-muted">
            {s.sceneId} · {s.durationSec}s
          </li>
        ))}
      </ul>
    </div>
  );
}
