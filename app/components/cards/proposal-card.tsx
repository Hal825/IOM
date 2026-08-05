'use client';

import type { Proposal } from '@/lib/types';
import type { CardBodyProps } from './registry';

/** 提案卡：角色 + 蓝图 + 空间/镜头分组 + 风格配置。 */
export function ProposalCard({ payload }: CardBodyProps) {
  const proposal = payload.proposal as Proposal | undefined;
  if (!proposal) return <p className="text-xs text-muted">（无提案数据）</p>;

  const sceneCount = proposal.sceneVisuals.reduce((s, v) => s + v.scenes.length, 0);
  const visualCount = proposal.sceneVisuals.length;

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p className="font-medium text-foreground">{proposal.blueprint.title || '（未命名提案）'}</p>
      <p className="text-muted">
        {proposal.characters.length} 个角色 · {visualCount} 个空间 · {sceneCount} 个镜头 ·{' '}
        {proposal.blueprint.totalDuration}s · {proposal.blueprint.aspectRatio}
      </p>
      <p className="text-muted">
        风格：{proposal.styleProfile.tone} · {proposal.styleProfile.visualStyle}
        {proposal.styleProfile.suggestedBGM
          ? ` · BGM ${proposal.styleProfile.suggestedBGM}`
          : ''}
      </p>
      {proposal.characters.length > 0 ? (
        <ul className="list-inside list-disc space-y-0.5 text-muted">
          {proposal.characters.map((c) => (
            <li key={c.characterId}>
              {c.name}（{c.type === 'protagonist' ? '主角' : '配角'}）— {c.role}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
