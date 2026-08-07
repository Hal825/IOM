/**
 * 节点结果点评 — agent 决定「一句话中文点评」的部分。
 *
 * 点评是表现层：失败/未启用时软省略（卡片照常渲染），不 fail 任务（与图内零容错解耦）。
 * 通过 `AGENT_COMMENTARY=on` 开启（默认关，避免验证/测试误调付费 API）；
 * 模型用 AGENT_* env，未配置时回退 LLM_TEXT_*（三文本节点共用）。
 */
import type { CardType } from '@/lib/conversations/types';

export interface CommentaryInput {
  cardType: CardType;
  nodeName: string;
  output: Record<string, unknown>;
}

export interface CommentaryProvider {
  comment(input: CommentaryInput): Promise<string>;
}

const AGENT_API_KEY = process.env.AGENT_API_KEY ?? process.env.LLM_TEXT_API_KEY;
const AGENT_BASE_URL = process.env.AGENT_BASE_URL ?? process.env.LLM_TEXT_BASE_URL;
const AGENT_LLM_MODEL = process.env.AGENT_LLM_MODEL ?? process.env.LLM_TEXT_MODEL;

const COMMENTARY_SYSTEM = `你是视频制作工作流里的助理。用户提交文本后，系统会逐个节点产出结果。请为刚完成的节点结果写一句中文点评（30-60 字），自然、具体、不夸张，像在和一个创作者对话。只输出点评本身，不要任何前缀或引号。`;

async function callCommentaryLLM(input: CommentaryInput): Promise<string> {
  if (!AGENT_API_KEY || !AGENT_BASE_URL || !AGENT_LLM_MODEL) {
    throw new Error('Agent 点评 LLM 未配置（AGENT_* 或回退 LLM_TEXT_*）');
  }
  const resp = await fetch(`${AGENT_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AGENT_API_KEY}`,
    },
    body: JSON.stringify({
      model: AGENT_LLM_MODEL,
      messages: [
        { role: 'system', content: COMMENTARY_SYSTEM },
        {
          role: 'user',
          content: `节点 ${input.nodeName}（${input.cardType}）的产物：\n${JSON.stringify(input.output).slice(0, 6000)}\n\n请写一句中文点评。`,
        },
      ],
      max_tokens: 120,
      temperature: 0.7,
    }),
  });
  if (!resp.ok) throw new Error(`点评 API 返回 ${resp.status}`);
  const data = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim() ?? '';
  if (!content) throw new Error('点评 API 返回空内容');
  return content;
}

/** 按 env 创建点评 Provider（AGENT_COMMENTARY=on 时接 LLM，否则 stub） */
export function createCommentaryProvider(): CommentaryProvider {
  const enabled = process.env.AGENT_COMMENTARY === 'on';
  return {
    async comment(input) {
      if (!enabled) return '';
      try {
        return await callCommentaryLLM(input);
      } catch (err) {
        console.warn(
          '[commentary] 点评失败，软省略:',
          err instanceof Error ? err.message : err
        );
        return '';
      }
    },
  };
}
