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

  // ── Script 输出 (四子脚本) ──
  console.log('\n═══ Script 输出 (四子脚本) ════════════════════');
  if (s.parsed) {
    const story = (s.parsed.storyScript?.scenes ?? []) as any[];
    const board = (s.parsed.storyboardScript?.scenes ?? []) as any[];
    const audio = (s.parsed.audioScript?.scenes ?? []) as any[];
    const pacing = (s.parsed.pacingScript?.scenes ?? []) as any[];
    console.log(`storyScript: ${story.length} 镜 | storyboardScript: ${board.length} 镜 | audioScript: ${audio.length} 镜 | pacingScript: ${pacing.length} 镜`);
    const totalDur = pacing.reduce((sum, p) => sum + (p.duration ?? 0), 0);
    console.log(`duration 合计: ${totalDur}s`);

    const boardById = new Map(board.map((b) => [b.sceneId, b]));
    const audioById = new Map(audio.map((a) => [a.sceneId, a]));
    const pacingById = new Map(pacing.map((p) => [p.sceneId, p]));

    for (const st of story) {
      const b = boardById.get(st.sceneId) ?? {};
      const a = audioById.get(st.sceneId) ?? {};
      const pc = pacingById.get(st.sceneId) ?? {};
      const shot = b.shot ?? {};
      console.log(`\n  [${st.sceneId}] ← ${b.visualSource} | ${pc.duration}s | motion=${b.motionLevel}`);
      console.log(`    story   : ${safeStr(st.narrative, 80)}`);
      console.log(`    chars   : ${Array.isArray(st.characters) && st.characters.length ? st.characters.map((c: any) => c.characterId).join(', ') : '(无)'}`);
      console.log(`    refs    : scene=${b.resourceRefs?.sceneImageRef} | appearCharId=[${(b.appearCharId ?? []).join(', ')}]`);
      console.log(`    shot    : ${shot.type} / ${shot.angle} / ${shot.movement}`);
      console.log(`    engine  : ${b.engine} | ${b.mode} | ${b.resolution} ${b.fps}fps`);
      console.log(`    neg     : ${safeStr(b.negativePrompt, 80)}`);
      console.log(`    trans   : ${pc.transitionIn?.type} → ${pc.transitionOut?.type} (${pc.transitionOut?.durationSec}s)`);
      console.log(`    bgm     : ${safeStr(a.bgm?.style, 40)} / ${safeStr(a.bgm?.mood, 40)}`);
      console.log(`    sfx     : ${Array.isArray(a.sfx) ? a.sfx.map((x: any) => x.type).join(', ') : 'N/A'}`);
      if (a.dialogue) {
        console.log(`    dialogue: ${a.dialogue.map((d: any) => `${d.characterId}:${safeStr(d.text, 50)}`).join(' | ')}`);
      }
    }
  } else {
    console.log('(JSON 解析失败,原始输出)');
    console.log(s.raw.slice(0, 1000));
  }

  // ── 持久化日志 ──
  const scriptScenes = s.parsed?.storyScript?.scenes as Array<Record<string, unknown>> | undefined;
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
