'use client';

import type { ResearchReport } from '@/lib/types';
import type { CardBodyProps } from './registry';

/** 就绪度分数着色：高绿 / 中琥珀 / 低红 */
function scoreTone(score: number): string {
  if (score >= 75) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-danger';
}

/** 调研结果卡：需求提取 + 内容就绪度评估。 */
export function ResearchCard({ payload }: CardBodyProps) {
  const report = payload.researchReport as ResearchReport | undefined;
  if (!report) return <p className="text-xs text-muted">（无调研数据）</p>;

  const demand = report.user_demand;
  const ready = report.content_readiness_assessment;

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p>
        <span className="text-muted">需求提取：</span>
        {demand.summary || '—'}
      </p>
      <p>
        <span className="text-muted">明确要求：</span>
        {demand.hasExplicitDemand ? `有（${demand.demands.length} 条）` : '无'}
      </p>
      <p>
        <span className="text-muted">就绪度：</span>
        <span className={`font-mono ${scoreTone(ready.overallScore)}`}>
          {ready.overallScore}
        </span>
        <span className="text-muted">
          {' '}
          · {ready.level} · {ready.recommendation}
        </span>
      </p>
      {ready.weaknesses.length > 0 ? (
        <p className="text-muted">短板：{ready.weaknesses.join('；')}</p>
      ) : null}
    </div>
  );
}
