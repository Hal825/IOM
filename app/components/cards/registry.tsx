'use client';

import type { ComponentType } from 'react';
import type { CardType } from '@/lib/conversations/types';
import { ResearchCard } from './research-card';
import { ProposalCard } from './proposal-card';
import { ScriptCard } from './script-card';
import { AssetsCard } from './assets-card';
import { AudioCard } from './audio-card';
import { ScenesCard } from './scenes-card';
import { ShotsCard } from './shots-card';
import { VideoCard } from './video-card';

/** 节点结果卡的中文标签（agent 决定呈现形态：节点 → 卡片类型 + 标签） */
export const CARD_LABELS: Record<CardType, string> = {
  research: '调研',
  proposal: '提案',
  script: '脚本',
  assets: '素材',
  audio: '配音',
  scenes: '场景规格',
  shots: '逐镜头视频',
  video: '成片',
};

export interface CardBodyProps {
  payload: Record<string, unknown>;
  /** jobId（成片卡渲染播放器/下载地址用） */
  jobId: string;
}

const REGISTRY: Record<CardType, ComponentType<CardBodyProps>> = {
  research: ResearchCard,
  proposal: ProposalCard,
  script: ScriptCard,
  assets: AssetsCard,
  audio: AudioCard,
  scenes: ScenesCard,
  shots: ShotsCard,
  video: VideoCard,
};

/** 按 cardType 渲染对应卡片主体；未知类型返回 null。 */
export function NodeCardBody({
  cardType,
  payload,
  jobId,
}: CardBodyProps & { cardType: CardType }) {
  const C = REGISTRY[cardType];
  if (!C) return null;
  return <C payload={payload} jobId={jobId} />;
}
