'use client';

import type { VideoScript } from '@/lib/types';
import type { CardBodyProps } from './registry';

const SUB_LABELS = ['剧情', '分镜', '音频', '节奏'] as const;

/** 脚本卡：四子脚本已生成的镜头概览。 */
export function ScriptCard({ payload }: CardBodyProps) {
  const vs = payload.videoScript as VideoScript | undefined;
  if (!vs) return <p className="text-xs text-muted">（无脚本数据）</p>;

  const sceneCount = vs.pacingScript.scenes.length;
  const dialogueScenes = vs.audioScript.scenes.filter((s) => (s.dialogue ?? []).length > 0).length;
  const firstScene = vs.storyScript.scenes[0];

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p>
        <span className="font-medium text-foreground">{sceneCount} 个镜头</span>
        <span className="text-muted"> · {SUB_LABELS.join(' / ')}四子脚本已生成</span>
      </p>
      <p className="text-muted">{dialogueScenes} 个镜头含台词 · 其余纯视觉</p>
      {firstScene ? (
        <p className="text-muted">
          开场：{firstScene.narrative || firstScene.sceneDescription.slice(0, 40)}
        </p>
      ) : null}
    </div>
  );
}
