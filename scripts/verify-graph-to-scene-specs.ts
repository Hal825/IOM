/**
 * 验证脚本 — 跑完整图到 scene_json_assembler（video 前），不进入真实视频生成。
 * 用法：npx tsx --env-file=.env scripts/verify-graph-to-scene-specs.ts "测试文本..."
 */

import { videoGraph } from '../lib/agent/graph';

async function main() {
  const testInput = process.argv.slice(2).join(' ').trim() ||
    '请帮我制作一个30秒左右的科普视频,介绍人工智能如何改变医疗诊断,要有科技感,背景音乐舒缓一些';
  const jobId = `verify-${Date.now()}`;

  console.log('═══════════════════════════════════════════');
  console.log('  验证：图跑到 scene_json_assembler（video 前）');
  console.log('═══════════════════════════════════════════');
  console.log(`jobId: ${jobId}`);
  console.log(`测试文本: "${testInput.slice(0, 60)}..."`);
  console.log('');

  const t0 = Date.now();
  const result = await videoGraph.invoke({ userPrompt: testInput, jobId });
  const totalMs = Date.now() - t0;

  console.log('\n═══════════════════════════════════════════');
  console.log('  执行完成');
  console.log('═══════════════════════════════════════════');
  console.log(`总耗时: ${(totalMs / 1000).toFixed(1)}s`);

  // ── 各阶段结果检查 ──
  const report = result as Record<string, unknown>;

  const r = report.researchReport as Record<string, unknown> | null | undefined;
  const userDemand = r?.user_demand as Record<string, unknown> | undefined;
  const demands = userDemand?.demands as unknown[] | undefined;
  const cra = r?.content_readiness_assessment as Record<string, unknown> | undefined;
  console.log('\n[research]', r
    ? `user_demand.demands=${demands?.length ?? 'N/A'} | ` +
      `overallScore=${cra?.overallScore}`
    : 'MISSING');

  const p = report.proposal as Record<string, unknown> | null | undefined;
  if (p) {
    const sceneVisuals = (p.sceneVisuals ?? []) as Array<Record<string, unknown>>;
    const sceneCount = sceneVisuals.reduce((s, sv) => s + ((sv.scenes as unknown[]) ?? []).length, 0);
    console.log(`[proposal] sceneVisuals=${sceneVisuals.length} 空间, ${sceneCount} 镜头, ` +
      `duration=${(p.blueprint as Record<string, unknown>)?.totalDuration}s, ` +
      `characters=${((p.characters ?? []) as unknown[]).length}`);
  } else {
    console.log('[proposal] MISSING');
  }

  const vs = report.videoScript as Record<string, unknown> | null | undefined;
  if (vs) {
    const counts = ['storyScript', 'storyboardScript', 'audioScript', 'pacingScript'].map(
      (k) => `${k}=${(((vs[k] as Record<string, unknown> | undefined)?.scenes as unknown[]) ?? []).length}`
    );
    console.log(`[script] ${counts.join(' | ')}`);
  } else {
    console.log('[script] MISSING');
  }

  const am = report.assetManifest as Record<string, unknown> | null | undefined;
  if (am) {
    const chars = (am.characters ?? {}) as Record<string, unknown>;
    const scenes = (am.scenes ?? {}) as Record<string, unknown>;
    console.log(`[asset_gen] characters=${Object.keys(chars).length}, scenes=${Object.keys(scenes).length}, ` +
      `sceneRefs=${Object.keys((am.sceneRefs ?? {}) as Record<string, unknown>).length}`);
  }

  const audioSegments = (report.audioSegments ?? []) as Array<Record<string, unknown>>;
  console.log(`[tts] audioSegments=${audioSegments.length}`);

  const specs = (report.sceneSpecs ?? []) as Array<Record<string, unknown>>;
  console.log(`[scene_json_assembler] sceneSpecs=${specs.length}`);

  if (specs.length > 0) {
    console.log('\n─── 每个镜头的 SceneVideoSpec 概要 ───');
    for (const s of specs) {
      const assets = s.assets as Record<string, unknown>;
      const board = s.storyboard as Record<string, unknown>;
      const pacing = s.pacing as Record<string, unknown>;
      console.log(`  [${s.sceneId}] ${s.duration}s | ${s.engine} ${s.resolution} | ` +
        `motion=${board.motionLevel} | img=${(assets.sceneImageUrl as string) ? '✓' : '✗'} | ` +
        `char=${(assets.characterImageUrls as string[]).length}张 | audio=${(assets.audioFilePath as string) ? '✓' : '✗'} | ` +
        `in=${(pacing.transitionIn as Record<string, unknown>)?.type}→out=${(pacing.transitionOut as Record<string, unknown>)?.type}`);
    }

    console.log('\n─── 首个镜头 SceneVideoSpec 完整 JSON ───');
    console.log(JSON.stringify(specs[0], null, 2));
  }

  // 检查是否调用了视频生成（应无 sceneVideos / mergedVideoUrl）
  console.log('\n─── video 前停止检查 ───');
  console.log(`sceneVideos    : ${((report.sceneVideos ?? []) as unknown[]).length}（应为 0）`);
  console.log(`mergedVideoUrl : ${report.mergedVideoUrl ?? 'null'}`);

  console.log('\n═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n✗ 验证失败:', err);
  process.exit(1);
});
