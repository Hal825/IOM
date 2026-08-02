/**
 * 验证脚本 — 跑完整图（research → proposal → script → asset/tts → assembler → shot_video_gen）。
 * shot_video_gen 只接收视频生成脚本并落盘 scene-specs.json（不真正调用视频生成 API）。
 * 需要 .env 配置 LLM / AI_ASSET / OSS 齐全。
 * 用法：npx tsx --env-file=.env scripts/verify-graph-full.ts "测试文本..."
 */

import { videoGraph } from '../lib/agent/graph';

async function main() {
  const testInput = process.argv.slice(2).join(' ').trim() ||
    '请帮我制作一个30秒左右的科普视频,介绍人工智能如何改变医疗诊断,要有科技感,背景音乐舒缓一些';
  const jobId = `verify-${Date.now()}`;

  console.log('═══════════════════════════════════════════');
  console.log('  验证：完整图（含逐镜头视频生成 + 合并）');
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

  // ── 视频生成脚本交接阶段检查 ──
  const sceneVideos = (report.sceneVideos ?? []) as Array<Record<string, unknown>>;
  console.log('\n─── 视频生成脚本交接阶段检查 ───');
  console.log(`[shot_video_gen] sceneVideos=${sceneVideos.length}（应与 sceneSpecs=${specs.length} 一致）`);
  for (const v of sceneVideos) {
    console.log(`  [${v.sceneId}] ${v.durationSec}s | ${v.status} | ${v.videoUrl}`);
  }

  const specPath = `storage/scenes/${jobId}/scene-specs.json`;
  const merged = report.mergedVideoUrl as string | null | undefined;
  console.log(`[shot_video_gen] 脚本包应已落盘 : ${specPath}`);
  console.log(`[video_merge]    mergedVideoUrl（未接线，应为 null）: ${merged ?? 'null'}`);

  // 断言：脚本交接成功（不真正生成）
  const failures: string[] = [];
  if (sceneVideos.length === 0) failures.push('sceneVideos 为空（shot_video_gen 未交接）');
  if (specs.length > 0 && sceneVideos.length !== specs.length) {
    failures.push(`sceneVideos(${sceneVideos.length}) ≠ sceneSpecs(${specs.length})`);
  }
  if (sceneVideos.some((v) => v.status !== 'received')) {
    failures.push('存在非 received 状态的镜头（应仅标记为脚本已交接）');
  }
  if (merged) failures.push(`mergedVideoUrl 应为 null（video_merge 未接线）: ${merged}`);

  if (failures.length > 0) {
    console.error('\n✗ 视频脚本交接断言失败:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log('\n✓ 视频脚本交接断言通过（每镜头脚本均已接收，未真实生成）');
  console.log('\n═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n✗ 验证失败:', err);
  process.exit(1);
});
