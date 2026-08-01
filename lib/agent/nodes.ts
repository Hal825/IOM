import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { type VideoGenStateType, type VideoGenStateUpdate, type SceneAudioSegment, type SceneVideoResult } from './state';
import type { SceneVideoSpec } from '@/lib/types';
import { analyzeContent } from '@/lib/tools/research-generator';
import { generateProposal } from '@/lib/tools/proposal-generator';
import { generateScript } from '@/lib/tools/script-generator';
import { generateAssets } from '@/lib/tools/asset-generator';
import { synthesizeSpeech } from '@/lib/tools/tts-generator';
import { buildShotSSML } from '@/lib/prompts/tts';
import { AssetStore } from '@/lib/store/asset-store';
import { saveStageLog, calculateCost, formatDurationSec } from '@/lib/log/procedure';

// ── FFmpeg 辅助 ──────────────────────────────────────

type FfmpegFn = (opts?: any) => any;
let _ffmpeg: FfmpegFn | null = null;

/** ffmpeg.exe 路径：环境变量 FFMPEG_PATH 优先，否则用系统 PATH 自动查找 */
const FFMPEG_PATH = process.env.FFMPEG_PATH;

function ffmpeg(...args: any[]): any {
  if (!_ffmpeg) {
    try {
      const ffmpegModule = require('fluent-ffmpeg');
      if (FFMPEG_PATH) {
        ffmpegModule.setFfmpegPath(FFMPEG_PATH);
      }
      _ffmpeg = ffmpegModule;
    } catch {
      throw new Error('fluent-ffmpeg 未安装，请运行 npm install fluent-ffmpeg');
    }
  }
  if (!_ffmpeg) throw new Error('fluent-ffmpeg 加载失败');
  return _ffmpeg(...args);
}

// ── 脚本存储目录 ────────────────────────────────────

const SCRIPTS_DIR = path.resolve(process.cwd(), 'storage', 'scripts');

// ============================================================
// 节点 1：Research（调研）— 零容错
// ============================================================

export async function researchNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  const startedAt = new Date().toISOString();
  const t0 = Date.now();

  if (!state.userPrompt?.trim()) throw new Error('用户输入为空');

  const result = await analyzeContent(state.userPrompt);

  const durationMs = Date.now() - t0;
  const jobId = state.jobId || String(Date.now());

  console.log(
    `[agent] research → 需求提取: ${result.report.user_demand.hasExplicitDemand ? '是' : '否'} ` +
    `(${result.report.user_demand.demands.length} 条), ` +
    `就绪度: ${result.report.content_readiness_assessment.overallScore} ` +
    `(${result.report.content_readiness_assessment.level}) (model: ${result.model})`
  );

  // ── 阶段审计日志 ──
  if (result.tokenUsage) {
    const cost = calculateCost(result.model, result.tokenUsage);
    const logPath = saveStageLog(jobId, 'research', {
      startedAt,
      durationSec: formatDurationSec(durationMs),
      model: result.model,
      retries: result.retries,
      input: { userPrompt: state.userPrompt },
      output: { report: result.report },
      tokenUsage: result.tokenUsage,
      cost,
    });
    console.log(`[agent] research log → ${logPath}`);
  }

  return {
    researchReport: result.report,
  };
}

// ============================================================
// 节点 2：Proposal（提案）— 零容错
// ============================================================

export async function proposalNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  const result = await generateProposal(
    state.researchReport ?? null,
    state.userPrompt,
    state.style ?? undefined
  );

  const sceneCount = result.proposal.sceneVisuals.reduce((sum, sv) => sum + sv.scenes.length, 0);
  const charInfo = result.proposal.characters.length
    ? `, ${result.proposal.characters.length} 个角色`
    : '';

  console.log(
    `[agent] proposal → ${result.proposal.sceneVisuals.length} 个空间, ${sceneCount} 个镜头, ` +
    `${result.proposal.blueprint.totalDuration}s${charInfo} (model: ${result.model})`
  );

  return {
    proposal: result.proposal,
  };
}

// ============================================================
// 节点 3：Script Generation（脚本生成）— 零容错 + 文本快照
// ============================================================

export async function scriptGenNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.proposal) throw new Error('缺少 Proposal');

  const result = await generateScript(
    state.proposal,
    state.researchReport ?? null,
    state.userPrompt
  );
  const videoScript = result.script;

  // ── 保存关键生成文本快照（四子脚本按 sceneId 对齐）──
  const pacingById = new Map(videoScript.pacingScript.scenes.map((p) => [p.sceneId, p]));
  const audioById = new Map(videoScript.audioScript.scenes.map((a) => [a.sceneId, a]));
  const textSnapshot = videoScript.storyScript.scenes.map((sc) => {
    const pc = pacingById.get(sc.sceneId);
    const au = audioById.get(sc.sceneId);
    return {
      sceneId: sc.sceneId,
      duration: pc?.duration ?? null,
      narrative: sc.narrative,
      shotType: (videoScript.storyboardScript.scenes.find((b) => b.sceneId === sc.sceneId))?.shot.type ?? null,
      dialogue: au?.dialogue?.map((d) => d.text) ?? [],
      sfx: au?.sfx?.map((s) => s.type) ?? [],
    };
  });

  const jobId = state.jobId || 'unknown';
  const scriptDir = path.join(SCRIPTS_DIR, jobId);
  fs.mkdirSync(scriptDir, { recursive: true });
  fs.writeFileSync(
    path.join(scriptDir, 'scene-texts.json'),
    JSON.stringify(textSnapshot, null, 2),
    'utf-8'
  );

  console.log(
    `[agent] script_gen → ${videoScript.storyScript.scenes.length} 个镜头（四子脚本） ` +
    `(model: ${result.model}) → scripts saved to ${scriptDir}`
  );

  return {
    videoScript: result.script,
    scriptTextSnapshot: JSON.stringify(textSnapshot),
  };
}

// ============================================================
// 节点 4：Asset Generation（素材生成）— 零容错
// ============================================================

export async function assetGenNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.proposal) throw new Error('缺少 Proposal');
  if (!state.videoScript) throw new Error('缺少 VideoScript');

  const jobId = state.jobId || `asset-${Date.now()}`;
  const result = await generateAssets(state.proposal, state.videoScript, jobId);

  console.log(
    `[agent] asset_gen → ${result.characterCount} 个角色, ${result.sceneCount} 个唯一场景 → ${result.manifestPath}`
  );

  return {
    assetManifest: result.manifest,
  };
}

// ============================================================
// 节点 5：TTS（分段语音合成）— 零容错 + FFmpeg 静音/对齐
// ============================================================

async function generateSilence(outputPath: string, durationSec: number): Promise<void> {
  // 直接用 ffmpeg CLI 子进程生成静音，绕开 fluent-ffmpeg 对新版 ffmpeg -formats 输出的 lavfi 能力探测 bug
  return new Promise<void>((resolve, reject) => {
    const bin = FFMPEG_PATH || 'ffmpeg';
    execFile(
      bin,
      [
        '-hide_banner', '-loglevel', 'error',
        '-f', 'lavfi',
        '-i', 'anullsrc=channel_layout=mono:sample_rate=22050',
        '-t', String(durationSec),
        '-c:a', 'libmp3lame',
        '-b:a', '64k',
        '-y',
        outputPath,
      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

async function alignAudioDuration(inputPath: string, outputPath: string, targetDuration: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .audioFilters([`apad=whole_dur=${targetDuration}`])
      .duration(targetDuration)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}

export async function ttsNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.proposal) throw new Error('缺少 Proposal');
  if (!state.videoScript) throw new Error('缺少 VideoScript');

  const jobId = state.jobId || `tts-${Date.now()}`;
  const audioDir = path.join(process.cwd(), 'storage', 'audio', jobId);
  fs.mkdirSync(audioDir, { recursive: true });

  const audioSegments: SceneAudioSegment[] = [];

  // 新版数据源：pacingScript.scenes（sceneId + duration）对齐 audioScript.scenes（dialogue/sfx/bgm）
  const pacingScenes = state.videoScript.pacingScript.scenes;
  const audioById = new Map(state.videoScript.audioScript.scenes.map((a) => [a.sceneId, a]));

  let ttsFirst = true;
  for (const pc of pacingScenes) {
    if (!ttsFirst) {
      await new Promise((r) => setTimeout(r, 1000)); // TTS 请求间隔 1s 避免限流
    }
    ttsFirst = false;

    const scene = audioById.get(pc.sceneId);
    if (!scene) throw new Error(`Scene audio script not found for ${pc.sceneId}`);

    // 新版 audioScript：dialogue[]（旁白/台词合一，无独立 narration/speed），首句情感作语气
    const dialogues = (scene.dialogue ?? []).filter((d) => d.text.trim());
    const narrationText = dialogues.length > 0 ? dialogues[0].text : null;
    const narrationEmotion = dialogues.length > 0 ? dialogues[0].emotion : 'neutral';
    const pauseAfter = 0.5;

    // 构建 SSML（含停顿 + 情感语速映射）
    const ssml = buildShotSSML(
      narrationText,
      narrationEmotion,
      dialogues,
      pauseAfter,
    );

    let audioPath: string;

    if (ssml) {
      const ttsResult = await synthesizeSpeech(ssml);
      audioPath = path.join(audioDir, `${pc.sceneId}.mp3`);
      fs.writeFileSync(audioPath, ttsResult.audioBuffer);
    } else {
      audioPath = path.join(audioDir, `${pc.sceneId}_silent.mp3`);
      await generateSilence(audioPath, pc.duration);
    }

    // 对齐时长
    const rawPath = audioPath;
    audioPath = path.join(audioDir, `${pc.sceneId}_aligned.mp3`);
    await alignAudioDuration(rawPath, audioPath, pc.duration);

    audioSegments.push({
      sceneId: pc.sceneId,
      audioUrl: audioPath,
      durationSec: pc.duration,
    });
  }

  console.log(`[agent] tts → ${audioSegments.length} 个音频片段 (SSML)`);

  return {
    audioSegments,
  };
}

// ============================================================
// 节点 6：Scene JSON Assembler（组装单镜头视频生成完整 JSON）
// ============================================================

/**
 * 将四子脚本 + 素材产物 + 音频产物按 sceneId 组装为单镜头的完整视频生成规格（SceneVideoSpec[]）。
 * 素材经 AssetStore.publish() 发布为公网 URL 后填入 assets。
 * 图到此为止（不进入 video_merge）。
 */
export async function sceneJsonAssemblerNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.videoScript) throw new Error('缺少 VideoScript');
  if (!state.assetManifest) throw new Error('缺少 AssetManifest');

  const vs = state.videoScript;
  const { assetManifest, audioSegments } = state;

  // 发布素材 → 公网 URL（场景图 + 角色四视图），供视频生成 API 引用
  const store = new AssetStore();
  const published = await store.publishManifest(assetManifest);

  const storyById = new Map(vs.storyScript.scenes.map((s) => [s.sceneId, s]));
  const boardById = new Map(vs.storyboardScript.scenes.map((b) => [b.sceneId, b]));
  const audioById = new Map(vs.audioScript.scenes.map((a) => [a.sceneId, a]));

  // 按 pacingScript 顺序（与 Proposal 镜头顺序一致）
  const sceneSpecs: SceneVideoSpec[] = vs.pacingScript.scenes.map((pc) => {
    const st = storyById.get(pc.sceneId);
    const b = boardById.get(pc.sceneId);
    const au = audioById.get(pc.sceneId);

    if (!st || !b || !au) {
      throw new Error(`scene_json_assembler: scene ${pc.sceneId} 缺少对应子脚本`);
    }

    // 音频产物：对齐后的音频文件路径
    const audioSegment = audioSegments.find((a) => a.sceneId === pc.sceneId);
    const audioFilePath = audioSegment?.audioUrl ?? null;

    // 角色图：按 appearCharId 逐个取已发布的四视图公网 URL
    const characterImageUrls: string[] = [];
    for (const charId of (b.appearCharId ?? [])) {
      const views = published.characters[charId];
      if (views) {
        for (const v of ['front', 'back', 'left', 'right'] as const) {
          if (views[v]) characterImageUrls.push(views[v]);
        }
      }
    }

    return {
      sceneId: pc.sceneId,
      duration: pc.duration,
      engine: b.engine,
      mode: b.mode,
      resolution: b.resolution,
      fps: b.fps,
      assets: {
        sceneImageUrl: published.scenes[pc.sceneId] ?? null,
        characterImageUrls,
        audioFilePath,
      },
      story: {
        sceneDescription: st.sceneDescription,
        narrative: st.narrative,
        characters: st.characters,
      },
      storyboard: {
        shot: b.shot,
        composition: b.composition,
        lighting: b.lighting,
        visualElements: b.visualElements,
        atmosphere: b.atmosphere,
        motionLevel: b.motionLevel,
        negativePrompt: b.negativePrompt,
      },
      audio: {
        dialogue: au.dialogue,
        sfx: au.sfx,
        bgm: au.bgm,
      },
      pacing: {
        transitionIn: pc.transitionIn,
        transitionOut: pc.transitionOut,
        keyMoments: pc.keyMoments,
      },
    };
  });

  console.log(`[agent] scene_json_assembler → ${sceneSpecs.length} 个镜头的完整视频生成规格`);

  return {
    sceneSpecs,
  };
}

// ============================================================
// 节点 7（保留未接线）：Video Merge（FFmpeg 拼接）— 零容错
// ============================================================

export async function videoMergeNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.proposal) throw new Error('缺少 Proposal');
  if (!state.videoScript) throw new Error('缺少 VideoScript');

  const sceneVideos = state.sceneVideos;
  const audioSegments = state.audioSegments;
  const pacingScenes = state.videoScript.pacingScript.scenes;

  if (sceneVideos.length !== pacingScenes.length) {
    throw new Error(`Video count mismatch: expected ${pacingScenes.length}, got ${sceneVideos.length}`);
  }

  const jobId = state.jobId || 'unknown';
  const outputDir = path.join(process.cwd(), 'storage', 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${jobId}.mp4`);

  // 按 pacingScript 顺序排列
  const orderedVideos: SceneVideoResult[] = [];
  const orderedAudios: SceneAudioSegment[] = [];

  for (const pc of pacingScenes) {
    const video = sceneVideos.find((v) => v.sceneId === pc.sceneId);
    if (!video) throw new Error(`Missing video for ${pc.sceneId}`);
    orderedVideos.push(video);

    const audio = audioSegments.find((a) => a.sceneId === pc.sceneId);
    if (!audio) throw new Error(`Missing audio for ${pc.sceneId}`);
    orderedAudios.push(audio);
  }

  // FFmpeg concat
  await new Promise<void>((resolve, reject) => {
    const cmd = ffmpeg();

    for (const v of orderedVideos) {
      cmd.input(v.videoUrl);
    }
    for (const a of orderedAudios) {
      cmd.input(a.audioUrl);
    }

    const vidCount = orderedVideos.length;
    const audCount = orderedAudios.length;

    // 构建 filter strings
    const vFilters: string[] = [];
    for (let i = 0; i < vidCount; i++) {
      if (i === 0) {
        vFilters.push(`[0:v]`);
      } else {
        vFilters.push(`[${i}:v]`);
      }
    }

    const aFilters: string[] = [];
    for (let i = 0; i < audCount; i++) {
      aFilters.push(`[${vidCount + i}:a]`);
    }

    // 使用 concat demuxer（需要转码为统一格式）
    const vConcat = `${vFilters.join('')}concat=n=${vidCount}:v=1:a=0[vout]`;
    const aConcat = `${aFilters.join('')}concat=n=${audCount}:v=0:a=1[aout]`;

    cmd.complexFilter([vConcat, aConcat], ['vout', 'aout'])
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-map', '[vout]', '-map', '[aout]'])
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });

  const totalDuration = orderedVideos.reduce((sum, v) => sum + v.durationSec, 0);

  console.log(`[agent] video_merge → ${orderedVideos.length} 个镜头 → ${outputPath} (${totalDuration}s)`);

  return {
    mergedVideoUrl: outputPath,
    mergeLog: `Merged ${orderedVideos.length} scenes into ${outputPath}`,
    durationSec: totalDuration,
  };
}
