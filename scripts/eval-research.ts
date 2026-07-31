/**
 * Research Prompt 评测脚本。
 *
 * 用法：
 *   npx tsx --env-file=.env scripts/eval-research.ts "测试文本..."
 *   npx tsx --env-file=.env scripts/eval-research.ts -f ./test-input.txt
 *
 * 输出：log/eval/<jobId>/comparison.json + 控制台摘要。
 */

import fs from 'node:fs';
import path from 'node:path';
import { analyzeContent } from '../lib/tools/research-generator';
import { NEW_RESEARCH_SYSTEM } from '../new_prompts/research';
import { RESEARCH_SYSTEM } from '../lib/prompts/research';
import { calculateCost, formatDurationSec } from '../lib/log/procedure';

// ── CLI 参数解析 ────────────────────────────────────

function readInput(): string {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('用法: npx tsx --env-file=.env scripts/eval-research.ts "测试文本..."');
    console.error('      npx tsx --env-file=.env scripts/eval-research.ts -f ./input.txt');
    process.exit(1);
  }

  if (args[0] === '-f' && args[1]) {
    return fs.readFileSync(path.resolve(args[1]), 'utf-8').trim();
  }

  return args.join(' ').trim();
}

// ── 工具 ────────────────────────────────────────────

function pct(a: number, b: number): string {
  if (b === 0) return 'N/A';
  const delta = a - b;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${(delta / b * 100).toFixed(1)}%`;
}

function deltaStr(orig: number, next: number, unit = ''): string {
  const d = next - orig;
  const sign = d >= 0 ? '▲' : '▼';
  return `${sign} ${sign === '▲' ? '+' : ''}${d.toFixed(1)}${unit} / ${pct(next, orig)}`;
}

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v == null) return 'N/A';
  return String(v);
}

// ── 主流程 ──────────────────────────────────────────

async function main() {
  const testInput = readInput();
  const jobId = `eval-${new Date().toISOString().replace(/[:.]/g, '-')}`;

  console.log('═══════════════════════════════════════════');
  console.log('  Research Prompt 评测');
  console.log('═══════════════════════════════════════════');
  console.log(`测试文本: "${testInput.slice(0, 80)}${testInput.length > 80 ? '...' : ''}" (${testInput.length}字)`);
  console.log('');

  // ── 原始 prompt ──
  console.log('▶ 运行原始 prompt...');
  const t0 = Date.now();
  const origResult = await analyzeContent(testInput);
  const origDurationMs = Date.now() - t0;
  const origCost = origResult.tokenUsage
    ? calculateCost(origResult.model, origResult.tokenUsage)
    : null;

  // 两轮之间有间隔，避免 API 限流
  console.log('  等待 2s...');
  await new Promise((r) => setTimeout(r, 2000));

  // ── 新 prompt（裸调 LLM，不做校验，仅展示输出）──
  console.log('▶ 运行新 prompt（裸调，不做结构校验）...');
  const t1 = Date.now();

  const NEW_API_KEY = process.env.RESEARCH_API_KEY;
  const NEW_BASE_URL = process.env.RESEARCH_BASE_URL;
  const NEW_MODEL = process.env.RESEARCH_LLM_MODEL;

  if (!NEW_API_KEY || !NEW_BASE_URL || !NEW_MODEL) {
    throw new Error('Research 环境变量未配置');
  }

  const newResp = await fetch(`${NEW_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NEW_API_KEY}`,
    },
    body: JSON.stringify({
      model: NEW_MODEL,
      messages: [
        { role: 'system', content: NEW_RESEARCH_SYSTEM },
        { role: 'user', content: testInput },
      ],
      max_tokens: 8000,
      temperature: 0.5,
    }),
  });

  if (!newResp.ok) {
    const errText = await newResp.text().catch(() => '');
    throw new Error(`新 prompt API 返回 ${newResp.status}: ${errText.slice(0, 200)}`);
  }

  const newData = await newResp.json();
  const newRawContent: string = newData.choices?.[0]?.message?.content ?? '(空)';
  const newTokenUsage = newData.usage ?? null;
  const newDurationMs = Date.now() - t1;
  const newCost = newTokenUsage
    ? calculateCost(NEW_MODEL, newTokenUsage)
    : null;

  // 尝试 JSON.parse 用于展示，失败则保留原始文本
  let newParsedReport: Record<string, unknown> | null = null;
  try {
    const jsonMatch = newRawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) newParsedReport = JSON.parse(jsonMatch[0]);
  } catch {
    // 忽略解析错误
  }

  // ── 写入评测报告 ──
  const evalDir = path.resolve(process.cwd(), 'log', 'eval', jobId);
  fs.mkdirSync(evalDir, { recursive: true });

  const report = {
    jobId,
    testInput,
    evaluatedAt: new Date().toISOString(),
    original: {
      systemPrompt: RESEARCH_SYSTEM,
      durationSec: formatDurationSec(origDurationMs),
      model: origResult.model,
      retries: origResult.retries,
      tokenUsage: origResult.tokenUsage ?? null,
      cost: origCost,
      report: origResult.report,
    },
    new: {
      systemPrompt: NEW_RESEARCH_SYSTEM,
      durationSec: formatDurationSec(newDurationMs),
      model: NEW_MODEL,
      retries: 0,
      tokenUsage: newTokenUsage ?? null,
      cost: newCost,
      reportRaw: newRawContent,
      reportParsed: newParsedReport,
    },
    comparison: {
      promptDiff: {
        originalLength: RESEARCH_SYSTEM.length,
        newLength: NEW_RESEARCH_SYSTEM.length,
        lengthDelta: `${NEW_RESEARCH_SYSTEM.length - RESEARCH_SYSTEM.length >= 0 ? '+' : ''}${NEW_RESEARCH_SYSTEM.length - RESEARCH_SYSTEM.length} (${pct(NEW_RESEARCH_SYSTEM.length, RESEARCH_SYSTEM.length)})`,
      },
      duration: {
        original: formatDurationSec(origDurationMs),
        new: formatDurationSec(newDurationMs),
        delta: deltaStr(origDurationMs, newDurationMs, 's'),
      },
      tokens: {
        originalTotal: origResult.tokenUsage?.total_tokens ?? 0,
        newTotal: newTokenUsage?.total_tokens ?? 0,
        delta: deltaStr(origResult.tokenUsage?.total_tokens ?? 0, newTokenUsage?.total_tokens ?? 0),
      },
      cost: {
        originalTotal: origCost?.totalCost ?? 0,
        newTotal: newCost?.totalCost ?? 0,
        delta: `$${(newCost?.totalCost ?? 0).toFixed(6)} vs $${(origCost?.totalCost ?? 0).toFixed(6)} (${pct(newCost?.totalCost ?? 0, origCost?.totalCost ?? 0)})`,
      },
    },
  };

  const reportPath = path.join(evalDir, 'comparison.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  // ── 控制台摘要 ──
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  Research Prompt 评测报告');
  console.log('═══════════════════════════════════════════');

  console.log('\n─── Prompt 差异 ───────────────────────────');
  console.log(`原始: ${RESEARCH_SYSTEM.length} 字符`);
  console.log(`新版本: ${NEW_RESEARCH_SYSTEM.length} 字符 (${report.comparison.promptDiff.lengthDelta})`);

  console.log('\n─── 耗时 ──────────────────────────────────');
  console.log(`原始: ${formatDurationSec(origDurationMs)}s`);
  console.log(`新版本: ${formatDurationSec(newDurationMs)}s (${report.comparison.duration.delta})`);

  console.log('\n─── Token 消耗 ────────────────────────────');
  const ou = origResult.tokenUsage;
  const nu = newTokenUsage;
  console.log('          原始        新版本');
  console.log(`输入:     ${String(ou?.prompt_tokens ?? 'N/A').padEnd(11)}${nu?.prompt_tokens ?? 'N/A'}`);
  console.log(`输出:     ${String(ou?.completion_tokens ?? 'N/A').padEnd(11)}${nu?.completion_tokens ?? 'N/A'}`);
  console.log(`总计:     ${String(ou?.total_tokens ?? 'N/A').padEnd(11)}${nu?.total_tokens ?? 'N/A'} (${report.comparison.tokens.delta})`);

  if (ou?.prompt_cache_hit_tokens || nu?.prompt_cache_hit_tokens) {
    console.log(`缓存命中: ${String(ou?.prompt_cache_hit_tokens ?? 0).padEnd(11)}${nu?.prompt_cache_hit_tokens ?? 0}`);
    console.log(`缓存未命中: ${String(ou?.prompt_cache_miss_tokens ?? 0).padEnd(11)}${nu?.prompt_cache_miss_tokens ?? 0}`);
  }
  if (ou?.completion_tokens_details?.reasoning_tokens || nu?.completion_tokens_details?.reasoning_tokens) {
    console.log(`推理:     ${String(ou?.completion_tokens_details?.reasoning_tokens ?? 0).padEnd(11)}${nu?.completion_tokens_details?.reasoning_tokens ?? 0}`);
  }

  console.log('\n─── 费用 (USD) ────────────────────────────');
  console.log(`原始: $${origCost?.totalCost.toFixed(6) ?? 'N/A'}`);
  console.log(`新版本: $${newCost?.totalCost.toFixed(6) ?? 'N/A'} (${report.comparison.cost.delta})`);

  // ── 输出对比（新旧格式不同，分开展示）──
  console.log('\n═══ 原始 Prompt 输出 ═══════════════════════');
  console.log(`segments  : ${origResult.report.contentSkeleton.segments.length}`);
  console.log(`flow      : ${origResult.report.contentSkeleton.flow}`);
  console.log(`tone      : ${origResult.report.styleProfile.tone}`);
  console.log(`pace      : ${origResult.report.styleProfile.pace}`);
  console.log(`readiness : ${origResult.report.readiness.overallScore}`);
  console.log(`hasChar   : ${origResult.report.characterAnalysis.hasCharacter}`);

  console.log('\n═══ 新 Prompt 输出 ═══════════════════════════');
  if (newParsedReport) {
    const ud = newParsedReport.user_demand as Record<string, unknown> | undefined;
    const cra = newParsedReport.content_readiness_assessment as Record<string, unknown> | undefined;
    const dims = cra?.dimensions as Record<string, { score: number }> | undefined;

    console.log(`user_text : ${safeStr(newParsedReport.user_text).slice(0, 60)}...`);
    console.log(`user_demand.hasExplicitDemand: ${ud?.hasExplicitDemand ?? 'N/A'}`);
    console.log(`user_demand.demands         : ${Array.isArray(ud?.demands) ? ud!.demands.length : 'N/A'}`);
    console.log(`user_demand.summary         : ${safeStr(ud?.summary).slice(0, 80)}`);
    console.log('---');
    console.log('content_readiness_assessment:');
    console.log(`  overallScore  : ${cra?.overallScore ?? 'N/A'}`);
    console.log(`  level         : ${cra?.level ?? 'N/A'}`);
    console.log(`  recommendation: ${cra?.recommendation ?? 'N/A'}`);
    if (dims) {
      for (const [key, val] of Object.entries(dims)) {
        console.log(`  ${key.padEnd(24)}: ${val?.score ?? 'N/A'}`);
      }
    }
    console.log(`  strengths     : ${Array.isArray(cra?.strengths) ? (cra!.strengths as string[]).join(', ') : 'N/A'}`);
    console.log(`  weaknesses    : ${Array.isArray(cra?.weaknesses) ? (cra!.weaknesses as string[]).join(', ') : 'N/A'}`);
  } else {
    console.log('(JSON 解析失败，原始输出如下)');
    console.log(newRawContent.slice(0, 500));
  }

  console.log(`\n完整报告: ${reportPath}`);
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n✗ 评测失败:', err.message);
  process.exit(1);
});
