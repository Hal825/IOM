'use client';

import type { AssetManifest } from '@/lib/types';
import type { CardBodyProps } from './registry';

/** 素材卡：角色四视图 + 场景背景的素材清单概览（本地产物暂以文本呈现）。 */
export function AssetsCard({ payload }: CardBodyProps) {
  const manifest = payload.assetManifest as AssetManifest | undefined;
  if (!manifest) return <p className="text-xs text-muted">（无素材数据）</p>;

  const chars = Object.values(manifest.characters ?? {});
  const scenes = Object.values(manifest.scenes ?? {});
  const libChars = chars.filter((c) => c.source === 'library').length;
  const aiChars = chars.length - libChars;
  const libScenes = scenes.filter((s) => s.source === 'library').length;
  const aiScenes = scenes.length - libScenes;

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p>
        <span className="font-medium text-foreground">{chars.length} 个角色素材</span>
        <span className="text-muted">
          {' '}
          （库 {libChars} / AI 生成 {aiChars}，四视图）
        </span>
      </p>
      <p>
        <span className="font-medium text-foreground">{scenes.length} 个场景背景</span>
        <span className="text-muted">
          {' '}
          （库 {libScenes} / AI 生成 {aiScenes}）
        </span>
      </p>
      {chars.length > 0 ? (
        <ul className="list-inside list-disc space-y-0.5 text-muted">
          {chars.map((c) => (
            <li key={c.sourceRef ?? c.views.front}>{c.sourceRef ?? c.views.front}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
