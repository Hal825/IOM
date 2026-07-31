/**
 * New Proposal 单独评测 — 裸调 LLM，打印原始输出。
 * 用法：npx tsx --env-file=.env scripts/eval-proposal-solo.ts "测试文本..."
 */

import { NEW_PROPOSAL_SYSTEM } from '../new_prompts/proposal';

async function main() {
  const testInput = process.argv.slice(2).join(' ').trim() ||
    '请帮我制作一个30秒左右的科普视频，介绍人工智能如何改变医疗诊断，要有科技感，背景音乐舒缓一些';

  const k = process.env.PROPOSAL_API_KEY!;
  const u = process.env.PROPOSAL_BASE_URL!;
  const m = process.env.PROPOSAL_LLM_MODEL!;

  console.log(`测试文本: "${testInput.slice(0, 60)}..."`);
  console.log('');

  const t0 = Date.now();
  const r = await fetch(`${u}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${k}` },
    body: JSON.stringify({
      model: m,
      messages: [
        { role: 'system', content: NEW_PROPOSAL_SYSTEM },
        { role: 'user', content: `用户原始文本：\n${testInput}\n\n请基于以上文本直接生成视频制作方案。` },
      ],
      max_tokens: 20000,
      temperature: 0.6,
    }),
  });

  const d = await r.json();
  const raw = d.choices?.[0]?.message?.content ?? '(空)';
  const usage = d.usage;

  console.log(`耗时: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (usage) {
    console.log(`Token: in=${usage.prompt_tokens} out=${usage.completion_tokens} total=${usage.total_tokens}`);
    if (usage.completion_tokens_details?.reasoning_tokens) {
      console.log(`推理: ${usage.completion_tokens_details.reasoning_tokens}`);
    }
  }
  console.log('');

  // 尝试 JSON.parse 后美化打印
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.log('(JSON parse 失败，输出原始文本)');
      console.log(raw);
    }
  } else {
    console.log(raw);
  }
}

main().catch((err) => {
  console.error('失败:', err.message);
  process.exit(1);
});
