'use client';

import type { SceneVideoSpec } from '@/lib/types';
import type { CardBodyProps } from './registry';

/** 场景规格卡：每镜头完整视频生成规格（素材公网 URL + 音频已就绪）。 */
export function ScenesCard({ payload }: CardBodyProps) {
  const specs = (payload.sceneSpecs as SceneVideoSpec[] | undefined) ?? [];
  if (specs.length === 0) return <p className="text-xs text-muted">（无场景规格数据）</p>;

  const total = specs.reduce((s, x) => s + (x.duration ?? 0), 0);
  const withImage = specs.filter((x) => x.assets.sceneImageUrl).length;

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p>
        <span className="font-medium text-foreground">{specs.length} 个镜头规格</span>
        <span className="text-muted">
          {' '}
          · 合计 {Math.round(total)}s · {withImage}/{specs.length} 镜头有场景图
        </span>
      </p>
      <ul className="space-y-0.5 font-mono text-[11px] text-muted">
        {specs.map((s) => (
          <li key={s.sceneId}>
            {s.sceneId} · {s.duration}s · {s.resolution} · {s.engine}
          </li>
        ))}
      </ul>
    </div>
  );
}
