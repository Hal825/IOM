/**
 * 诊断脚本 — 打印 proposal 的 sceneVisuals[].visualHints（完整内容）。
 * 用于定位 asset_gen 生图被 DashScope 内容审核（IPInfringementSuspect）拒绝的提示词。
 * 只跑 research + proposal 两个 LLM 调用。
 * 用法：npx tsx --env-file=.env scripts/diag-visualhints.ts "输入文本..."
 */

import { analyzeContent } from '../lib/tools/research-generator';
import { generateProposal } from '../lib/tools/proposal-generator';

async function main() {
  const testInput = process.argv.slice(2).join(' ').trim();
  if (!testInput) {
    console.error('缺少输入文本');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════');
  console.log('  诊断：proposal.sceneVisuals[].visualHints');
  console.log('═══════════════════════════════════════════');
  console.log(`测试文本: "${testInput.slice(0, 80)}..."`);
  console.log('');

  const { report } = await analyzeContent(testInput);
  const { proposal } = await generateProposal(report, testInput);

  console.log(`角色: ${proposal.characters.length} | 空间: ${proposal.sceneVisuals.length}`);
  console.log('');

  for (const sv of proposal.sceneVisuals) {
    console.log(`── ${sv.visualId} | 覆盖 ${sv.scenes.length} 镜头 ──`);
    console.log(`  中文描述: ${sv.description}`);
    console.log(`  visualHints: ${sv.visualHints}`);
    console.log('');
  }

  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n✗ 诊断失败:', err);
  process.exit(1);
});
