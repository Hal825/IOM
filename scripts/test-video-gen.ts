/**
 * 测试脚本 — 最小化真实视频生成 + FFmpeg 拼接（不经 LLM 分镜，确定性构造）。
 * 构造 2 镜头 / 15s / 480p 的场景规格，直接跑 shot_video_gen → video_merge。
 *
 * 流程：
 *   1. DashScope 生一张场景图 → 存本地 → 发布 OSS 拿公网 URL（视频 API 首帧硬依赖）
 *   2. 构造 2 条 SceneVideoSpec（7s + 8s = 15s，854x480，同一张场景图）
 *   3. FFmpeg 生成 2 段静音音频（对齐时长）
 *   4. 直接调用 shotVideoGenNode + videoMergeNode
 *
 * 需要 .env：AI_ASSET_*（生图）、OSS_*（发布）、AI_VIDEO_*（视频生成）、ffmpeg。
 * 用法：npx tsx --env-file=.env scripts/test-video-gen.ts
 *
 * 注：dev 检视/构造脚本，直接读取 API 响应未定型 JSON 并构造部分 state，
 * 对 no-explicit-any 豁免（生产代码不适用）。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'node:path';
import fs from 'node:fs';
import { execFile } from 'node:child_process';
import { shotVideoGenNode, videoMergeNode } from '../lib/agent/nodes';
import { AssetStore } from '../lib/store/asset-store';
import type { Proposal, VideoScript, SceneVideoSpec } from '../lib/types';
import type { SceneAudioSegment, SceneVideoResult } from '../lib/agent/state';

const JOB_ID = `test-vg-${Date.now()}`;
const MODEL = 'happyhorse-1.1-r2v';

// ── 1. 生成一张场景图并发布 OSS ─────────────────────────
async function makeSceneImageUrl(): Promise<string> {
  const key = process.env.AI_ASSET_API_KEY;
  const base = process.env.AI_ASSET_BASE_URL;
  const model = process.env.AI_ASSET_MODEL;
  if (!key || !base || !model) throw new Error('AI_ASSET_* 未配置（生图）');

  const prompt =
    'sunset over calm sea, warm golden light to pale purple, gentle waves on rocks, no people, cinematic, photorealistic';
  console.log(`[test] 生成场景图: "${prompt.slice(0, 50)}..."`);
  const resp = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      input: { messages: [{ role: 'user', content: [{ text: prompt }] }] },
      parameters: { size: '1280*720', n: 1 },
    }),
  });
  if (!resp.ok) throw new Error(`生图失败 ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  const data = (await resp.json()) as any;
  const img = data?.output?.choices?.[0]?.message?.content?.[0]?.image;
  if (!img) throw new Error('生图响应中未找到图片 URL');

  const store = new AssetStore();
  const rel = `assets/${JOB_ID}/scenes/test_visual.png`;
  await store.storeFromUrl(img, rel);
  const publicUrl = await store.publish(rel);
  console.log(`[test] 场景图已发布: ${publicUrl}`);
  return publicUrl;
}

// ── 2. 构造 2 条 SceneVideoSpec（15s / 480p）─────────────
function buildSceneSpecs(sceneImageUrl: string): SceneVideoSpec[] {
  const mkStoryboard = (movement: string) => ({
    shot: { type: 'wide', angle: 'eye-level', movement, focus: 'horizon' },
    composition: 'rule of thirds',
    lighting: 'golden hour',
    visualElements: ['sea', 'rocks'],
    atmosphere: 'calm',
    motionLevel: 2,
    negativePrompt: 'people, text, watermark',
  });
  const mkPacing = () => ({ transitionIn: { type: 'cut', durationSec: 0 }, transitionOut: { type: 'cut', durationSec: 0 }, keyMoments: [] });
  return [
    {
      sceneId: 'scene-1', duration: 7, engine: MODEL, mode: 'image-to-video', resolution: '854x480', fps: 24,
      assets: { sceneImageUrl, characterImageUrls: [], audioFilePath: null },
      story: { sceneDescription: '暖金日落海面', narrative: '开场', characters: [] },
      storyboard: mkStoryboard('slow push-in'),
      audio: { dialogue: null, sfx: [], bgm: { style: '', mood: '', timing: '' } },
      pacing: mkPacing(),
    },
    {
      sceneId: 'scene-2', duration: 8, engine: MODEL, mode: 'image-to-video', resolution: '854x480', fps: 24,
      assets: { sceneImageUrl, characterImageUrls: [], audioFilePath: null },
      story: { sceneDescription: '淡紫暮色海天', narrative: '收尾', characters: [] },
      storyboard: mkStoryboard('slow pan right'),
      audio: { dialogue: null, sfx: [], bgm: { style: '', mood: '', timing: '' } },
      pacing: mkPacing(),
    },
  ];
}

// ── 3. FFmpeg 生成静音音频 ──────────────────────────────
async function makeSilence(outPath: string, seconds: number): Promise<void> {
  const bin = process.env.FFMPEG_PATH || 'ffmpeg';
  await new Promise<void>((resolve, reject) => {
    execFile(
      bin,
      ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=channel_layout=mono:sample_rate=22050',
        '-t', String(seconds), '-c:a', 'libmp3lame', '-b:a', '64k', '-y', outPath],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log(`  测试：真实视频生成 + 拼接（${JOB_ID}）`);
  console.log('  规格：2 镜头 / 15s / 480p / happyhorse-1.1-r2v');
  console.log('═══════════════════════════════════════════');

  const sceneImageUrl = await makeSceneImageUrl();
  const sceneSpecs = buildSceneSpecs(sceneImageUrl);

  // 静音音频（对齐时长）
  const audioDir = path.join(process.cwd(), 'storage', 'audio', JOB_ID);
  fs.mkdirSync(audioDir, { recursive: true });
  const audioSegments: SceneAudioSegment[] = [];
  for (const spec of sceneSpecs) {
    const p = path.join(audioDir, `${spec.sceneId}_silent.mp3`);
    await makeSilence(p, spec.duration);
    audioSegments.push({ sceneId: spec.sceneId, audioUrl: p, durationSec: spec.duration });
  }
  console.log(`[test] 静音音频: ${audioSegments.length} 段`);

  // 最小 proposal / videoScript（videoMergeNode 只用 pacingScript 顺序 + 守卫）
  const proposal: Proposal = {
    characters: [],
    blueprint: { title: 'test', totalDuration: 15, aspectRatio: '16:9' },
    sceneVisuals: [],
    styleProfile: { tone: 'minimal', visualStyle: '', suggestedBGM: '' },
  };
  const videoScript: VideoScript = {
    storyScript: { scenes: sceneSpecs.map((s) => ({ sceneId: s.sceneId, sceneDescription: s.story.sceneDescription, characters: [], narrative: s.story.narrative })) },
    storyboardScript: { scenes: [] },
    audioScript: { scenes: sceneSpecs.map((s) => ({ sceneId: s.sceneId, dialogue: null, sfx: [], bgm: { style: '', mood: '', timing: '' } })) },
    pacingScript: { scenes: sceneSpecs.map((s) => ({ sceneId: s.sceneId, duration: s.duration, transitionIn: s.pacing.transitionIn, transitionOut: s.pacing.transitionOut, keyMoments: [] })) },
  };

  // 4. 直接跑两个节点
  const state: any = { jobId: JOB_ID, proposal, videoScript, sceneSpecs, audioSegments };

  console.log('\n─── shot_video_gen（真实视频生成）───');
  const { sceneVideos } = (await shotVideoGenNode(state)) as { sceneVideos: SceneVideoResult[] };
  for (const v of sceneVideos) {
    console.log(`  [${v.sceneId}] ${v.durationSec.toFixed(2)}s | ${v.status} | ${path.basename(v.videoUrl)}`);
  }

  console.log('\n─── video_merge（FFmpeg 拼接）───');
  const merged = (await videoMergeNode({ ...state, sceneVideos })) as {
    mergedVideoUrl: string | null;
    durationSec: number;
  };
  console.log(`  mergedVideoUrl: ${merged.mergedVideoUrl}`);
  console.log(`  durationSec   : ${merged.durationSec}`);

  // 校验产物
  const failures: string[] = [];
  for (const v of sceneVideos) {
    if (v.status !== 'done' || !fs.existsSync(v.videoUrl)) failures.push(`缺少逐镜头视频 ${v.sceneId}`);
  }
  if (!merged.mergedVideoUrl || !fs.existsSync(merged.mergedVideoUrl)) {
    failures.push('缺少合并视频');
  }
  if (failures.length > 0) {
    console.error('\n✗ 测试失败:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log('\n✓ 测试通过：2 镜头真实视频 + 合并 MP4 均已产出');
}

main().catch((err) => {
  console.error('\n✗ 测试失败:', err);
  process.exit(1);
});
