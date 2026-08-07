import { describe, expect, it } from 'vitest';
import type { Proposal, ResearchReport } from '@/lib/types';
import {
  PIPELINE_SYSTEM,
  TASK_RESEARCH,
  TASK_PROPOSAL,
  TASK_SCRIPT,
  buildPipelineConversation,
} from './pipeline';

/**
 * KV Cache 前缀一致性设计测试。
 * 核心不变量：后续请求的 messages 是前序请求的严格前缀扩展（逐字节一致），
 * 这是 DeepSeek 自动前缀缓存命中的前提。
 */

const USER_TEXT = '测试文本，讲一个 AI 医疗的故事。';

const researchReport: ResearchReport = {
  user_text: USER_TEXT,
  user_demand: {
    hasExplicitDemand: true,
    demands: [{ category: 'style', description: '科技感', originalPhrase: '科技感' }],
    summary: '科技感短视频',
  },
  content_readiness_assessment: {
    overallScore: 80,
    level: 'good',
    dimensions: { information_sufficiency: { score: 80, comment: 'ok' } },
    strengths: ['结构完整'],
    weaknesses: ['不够具体'],
    recommendation: 'needs_polish',
  },
};

const proposal: Proposal = {
  characters: [],
  blueprint: { title: '测试', totalDuration: 10, aspectRatio: '16:9' },
  sceneVisuals: [
    {
      visualId: 'visual-1',
      description: '现代诊室',
      visualHints: 'modern clinic',
      scenes: [{ sceneId: 'scene-1', sceneDescription: '医生查看数据', appearCharId: [], duration: 10 }],
    },
  ],
  styleProfile: { tone: 'professional', visualStyle: '科技白蓝', suggestedBGM: '舒缓电子' },
};

describe('buildPipelineConversation 前缀不变量（KV Cache 命中的前提）', () => {
  it('research / proposal / script 三段严格前缀递增（无 styleHint）', () => {
    const researchMsgs = buildPipelineConversation({ userPrompt: USER_TEXT });
    const proposalMsgs = buildPipelineConversation({ userPrompt: USER_TEXT, researchReport });
    const scriptMsgs = buildPipelineConversation({ userPrompt: USER_TEXT, researchReport, proposal });

    expect(proposalMsgs.slice(0, researchMsgs.length)).toEqual(researchMsgs);
    expect(scriptMsgs.slice(0, proposalMsgs.length)).toEqual(proposalMsgs);
  });

  it('带 styleHint 时前缀仍严格递增（styleHint 两轮同值）', () => {
    const researchMsgs = buildPipelineConversation({ userPrompt: USER_TEXT });
    const proposalMsgs = buildPipelineConversation({
      userPrompt: USER_TEXT,
      styleHint: '赛博朋克',
      researchReport,
    });
    const scriptMsgs = buildPipelineConversation({
      userPrompt: USER_TEXT,
      styleHint: '赛博朋克',
      researchReport,
      proposal,
    });

    expect(proposalMsgs.slice(0, researchMsgs.length)).toEqual(researchMsgs);
    expect(scriptMsgs.slice(0, proposalMsgs.length)).toEqual(proposalMsgs);
  });

  it('同一输入两次构造 → 逐字节一致（确定性，无逐请求动态内容）', () => {
    const a = buildPipelineConversation({ userPrompt: USER_TEXT, researchReport, proposal });
    const b = buildPipelineConversation({ userPrompt: USER_TEXT, researchReport, proposal });
    expect(a).toEqual(b);
  });
});

describe('消息结构与常量', () => {
  it('research：system + 用户原文 + TASK_RESEARCH', () => {
    const msgs = buildPipelineConversation({ userPrompt: USER_TEXT });
    expect(msgs.map((m) => m.role)).toEqual(['system', 'user', 'user']);
    expect(msgs[0].content).toBe(PIPELINE_SYSTEM);
    expect(msgs[1].content).toBe(USER_TEXT);
    expect(msgs[2].content).toBe(TASK_RESEARCH);
  });

  it('proposal：research 前缀 + assistant(校验后 JSON) + TASK_PROPOSAL', () => {
    const msgs = buildPipelineConversation({ userPrompt: USER_TEXT, researchReport });
    expect(msgs.map((m) => m.role)).toEqual(['system', 'user', 'user', 'assistant', 'user']);
    expect(msgs[3].content).toBe(JSON.stringify(researchReport));
    expect(msgs[4].content).toBe(TASK_PROPOSAL);
  });

  it('styleHint 插在 assistant(research) 之后、TASK_PROPOSAL 之前', () => {
    const msgs = buildPipelineConversation({
      userPrompt: USER_TEXT,
      styleHint: '赛博朋克',
      researchReport,
    });
    expect(msgs[4].content).toBe('用户偏好风格：赛博朋克');
    expect(msgs[5].content).toBe(TASK_PROPOSAL);
  });

  it('script：完整前缀 + assistant(proposal JSON) + TASK_SCRIPT', () => {
    const msgs = buildPipelineConversation({ userPrompt: USER_TEXT, researchReport, proposal });
    expect(msgs.map((m) => m.role)).toEqual([
      'system', 'user', 'user', 'assistant', 'user', 'assistant', 'user',
    ]);
    expect(msgs[5].content).toBe(JSON.stringify(proposal));
    expect(msgs[6].content).toBe(TASK_SCRIPT);
  });

  it('TASK_* 常量模块加载期求值后不含插值标记（`${` 已求值）', () => {
    // 模板字面量在模块加载期求值，导出的已是最终字符串；残留 `${` 说明存在未处理的插值
    expect(TASK_RESEARCH).not.toContain('${');
    expect(TASK_PROPOSAL).not.toContain('${');
    expect(TASK_SCRIPT).not.toContain('${');
  });
});
