/**
 * Script 串联评测 — Proposal → Script.
 * 用法：npx tsx --env-file=.env scripts/eval-script.ts "测试文本..."
 */

import fs from 'node:fs';
import path from 'node:path';
import { NEW_PROPOSAL_SYSTEM } from '../new_prompts/proposal';
import { NEW_SCRIPT_SYSTEM } from '../new_prompts/script';
import { calculateCost, formatDurationSec } from '../lib/log/procedure';

function safeStr(v: unknown, maxLen = 100): string {
  if (typeof v === 'string') return v.length > maxLen ? v.slice(0, maxLen) + '...' : v;
  if (v == null) return 'N/A';
  return String(v).slice(0, maxLen);
}

async function callLLM(systemPrompt: string, userContent: string, stage: string) {
  const k = process.env.SCRIPT_API_KEY!;
  const u = process.env.SCRIPT_BASE_URL!;
  const m = process.env.SCRIPT_LLM_MODEL!;
  const t0 = Date.now();

  const r = await fetch(`${u}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${k}` },
    body: JSON.stringify({
      model: m,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_tokens: 20000,
      temperature: 0.6,
    }),
  });

  const d = await r.json();
  const raw = d.choices?.[0]?.message?.content ?? '(空)';
  const usage = d.usage;

  console.log(`[${stage}] ${((Date.now() - t0) / 1000).toFixed(1)}s | tokens: in=${usage?.prompt_tokens} out=${usage?.completion_tokens} total=${usage?.total_tokens}`);
  if (usage?.completion_tokens_details?.reasoning_tokens) {
    console.log(`[${stage}] 推理: ${usage.completion_tokens_details.reasoning_tokens}`);
  }

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  return { raw, parsed, usage, durationMs: Date.now() - t0, model: m };
}

async function main() {
  const testInput = process.argv.slice(2).join(' ').trim() ||
    '请帮我制作一个30秒左右的科普视频,介绍人工智能如何改变医疗诊断,要有科技感,背景音乐舒缓一些';

  const jobId = `script-eval-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const evalDir = path.resolve(process.cwd(), 'log', 'eval', jobId);
  fs.mkdirSync(evalDir, { recursive: true });

  console.log('═══════════════════════════════════════════');
  console.log('  Script 串联评测 (Proposal → Script)');
  console.log('═══════════════════════════════════════════');
  console.log(`jobId: ${jobId}`);
  console.log(`测试文本: "${testInput.slice(0, 60)}..."`);
  console.log('');

  // ── Stage 1: Proposal ──
  console.log('▶ Stage 1: 生成 Proposal...');
  const p = await callLLM(
    NEW_PROPOSAL_SYSTEM,
    `用户原始文本:\n${testInput}\n\n请基于以上文本直接生成视频制作方案.`,
    'Proposal'
  );

  if (!p.parsed) {
    console.error('Proposal JSON 解析失败');
    console.log(p.raw.slice(0, 500));
    process.exit(1);
  }

  const proposal = p.parsed;
  console.log(`  blueprint: ${safeStr(proposal.blueprint?.title)} | ${proposal.blueprint?.totalDuration}s`);
  console.log(`  sceneVisuals: ${proposal.sceneVisuals?.length} 个空间`);
  const proposalScenes = proposal.sceneVisuals?.flatMap((sv: any) => sv.scenes ?? []) ?? [];
  console.log(`  scenes: ${proposalScenes.length} 个镜头`);
  if (proposal.characters?.length) {
    console.log(`  characters: ${proposal.characters.map((c: any) => c.name).join(', ')}`);
  }

  // 间隔
  console.log('  等待 2s...');
  await new Promise((r) => setTimeout(r, 2000));

  // ── Stage 2: Script ──
  console.log('\n▶ Stage 2: 生成 Script...');
  const proposalJson = JSON.stringify(proposal, null, 2);
  const s = await callLLM(
    NEW_SCRIPT_SYSTEM,
    `以下是完整的视频制作方案(Proposal JSON):\n${proposalJson}\n\n请基于以上方案生成逐镜头 AI 视频生成脚本.`,
    'Script'
  );

  // ── 汇总 ──
  const totalMs = p.durationMs + s.durationMs;
  const totalCost = (p.usage && s.usage)
    ? calculateCost(p.model, p.usage).totalCost + calculateCost(s.model, s.usage).totalCost
    : null;

  console.log('\n═══════════════════════════════════════════');
  console.log('  评测汇总');
  console.log('═══════════════════════════════════════════');
  console.log(`总耗时 : ${formatDurationSec(totalMs)}s (Proposal: ${formatDurationSec(p.durationMs)}s + Script: ${formatDurationSec(s.durationMs)}s)`);
  console.log(`总Token: ${(p.usage?.total_tokens ?? 0) + (s.usage?.total_tokens ?? 0)} (Proposal: ${p.usage?.total_tokens} + Script: ${s.usage?.total_tokens})`);
  if (totalCost != null) {
    console.log(`总费用 : $${totalCost.toFixed(6)}`);
  }

  // ── Script 输出 ──
  console.log('\n═══ Script 输出 ════════════════════════════');
  if (s.parsed) {
    const proj = s.parsed.project;
    console.log(`project: ${proj?.title} | ${proj?.aspectRatio} | ${proj?.totalDuration}s | ${proj?.outputResolution} | ${proj?.fps}fps`);

    const scenes = s.parsed.scenes as Array<Record<string, unknown>> | undefined;
    if (scenes) {
      console.log(`scenes: ${scenes.length} 个镜头`);
      for (const sc of scenes) {
        const gen = sc.generation as Record<string, unknown> | undefined;
        const trans = sc.transition as Record<string, unknown> | undefined;
        const audio = sc.audio as Record<string, unknown> | undefined;
        console.log(`\n  [${sc.sceneId}] ← ${sc.visualSource} | ${sc.duration}s | motion=${gen?.motion}`);
        console.log(`    engine  : ${gen?.engine} | ${gen?.mode}`);
        console.log(`    prompt  : ${safeStr(gen?.prompt, 120)}`);
        console.log(`    neg     : ${safeStr(gen?.negativePrompt, 80)}`);
        console.log(`    trans   : ${trans?.in} → ${trans?.out} (${trans?.outDuration}s)`);
        console.log(`    bgm     : ${safeStr(audio?.bgm, 60)}`);
        console.log(`    sfx     : ${Array.isArray(audio?.sfx) ? (audio!.sfx as string[]).join(', ') : 'N/A'}`);
        if (audio?.dialogue) {
          console.log(`    dialogue: ${safeStr(audio.dialogue, 120)}`);
        }
      }
    }
  } else {
    console.log('(JSON 解析失败,原始输出)');
    console.log(s.raw.slice(0, 1000));
  }

  // ── 持久化日志 ──
  const scriptScenes = s.parsed?.scenes as Array<Record<string, unknown>> | undefined;
  const logReport = {
    jobId,
    testInput,
    evaluatedAt: new Date().toISOString(),
    stages: {
      proposal: {
        durationSec: formatDurationSec(p.durationMs),
        durationMs: p.durationMs,
        model: p.model,
        tokenUsage: p.usage ?? null,
        cost: p.usage ? calculateCost(p.model, p.usage) : null,
        report: p.parsed,
        rawOutputLength: p.raw.length,
      },
      script: {
        durationSec: formatDurationSec(s.durationMs),
        durationMs: s.durationMs,
        model: s.model,
        tokenUsage: s.usage ?? null,
        cost: s.usage ? calculateCost(s.model, s.usage) : null,
        report: s.parsed,
        rawOutputLength: s.raw.length,
      },
    },
    summary: {
      totalDurationSec: formatDurationSec(p.durationMs + s.durationMs),
      totalTokens: (p.usage?.total_tokens ?? 0) + (s.usage?.total_tokens ?? 0),
      totalCost: (() => {
        const pc = p.usage ? calculateCost(p.model, p.usage).totalCost : 0;
        const sc = s.usage ? calculateCost(s.model, s.usage).totalCost : 0;
        return pc + sc;
      })(),
      sceneCount: scriptScenes?.length ?? 0,
      spaceCount: p.parsed?.sceneVisuals?.length ?? 0,
      characterCount: p.parsed?.characters?.length ?? 0,
    },
  };

  fs.writeFileSync(path.join(evalDir, 'report.json'), JSON.stringify(logReport, null, 2), 'utf-8');
  fs.writeFileSync(path.join(evalDir, 'proposal-raw.txt'), p.raw, 'utf-8');
  fs.writeFileSync(path.join(evalDir, 'script-raw.txt'), s.raw, 'utf-8');

  console.log(`\n日志已保存: ${evalDir}`);
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n✗ 评测失败:', err.message);
  process.exit(1);
});
