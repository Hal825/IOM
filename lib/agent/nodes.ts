import fs from 'node:fs';
import path from 'node:path';
import { type VideoGenStateType, type VideoGenStateUpdate, type SceneAudioSegment, type SceneVideoResult } from './state';
import { analyzeContent } from '@/lib/tools/research-generator';
import { generateProposal } from '@/lib/tools/proposal-generator';
import { generateScript } from '@/lib/tools/script-generator';
import { generateAssets } from '@/lib/tools/asset-generator';
import { synthesizeSpeech } from '@/lib/tools/tts-generator';
import { generateSingleVideo } from '@/lib/tools/shot-video-generator';
import { buildShotSSML } from '@/lib/prompts/tts';
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
    `[agent] research → ${result.report.contentSkeleton.segments.length} 个段落, ` +
    `角色需求: ${result.report.characterAnalysis.hasCharacter ? '是' : '否'} (model: ${result.model})`
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

  const charInfo = result.proposal.characters?.length
    ? `, ${result.proposal.characters.length} 个角色`
    : '';

  console.log(
    `[agent] proposal → ${result.proposal.shotScript.length} 个镜头, ` +
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

  // ── 保存关键生成文本快照 ──
  const textSnapshot = videoScript.sceneScripts.map((sc) => ({
    sceneId: sc.sceneId,
    motionDescription: sc.videoGenPrompt.motionDescription,
    negativePrompt: sc.videoGenPrompt.negativePrompt,
    narration: sc.audio.narration?.text ?? null,
    dialogues: sc.audio.dialogues?.map((d) => d.text) ?? [],
  }));

  const jobId = state.jobId || 'unknown';
  const scriptDir = path.join(SCRIPTS_DIR, jobId);
  fs.mkdirSync(scriptDir, { recursive: true });
  fs.writeFileSync(
    path.join(scriptDir, 'scene-texts.json'),
    JSON.stringify(textSnapshot, null, 2),
    'utf-8'
  );

  console.log(
    `[agent] script_gen → ${videoScript.sceneScripts.length} 个镜头脚本 ` +
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
    `[agent] asset_gen → ${result.characterCount} 个角色, ${result.sceneCount} 个唯一场景`
  );

  return {
    assetManifest: result.manifest,
  };
}

// ============================================================
// 节点 5：TTS（分段语音合成）— 零容错 + FFmpeg 静音/对齐
// ============================================================

async function generateSilence(outputPath: string, durationSec: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input('anullsrc=channel_layout=mono:sample_rate=22050')
      .inputOptions(['-f', 'lavfi'])
      .output(outputPath)
      .audioCodec('libmp3lame')
      .audioBitrate('64k')
      .duration(durationSec)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
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

  let ttsFirst = true;
  for (const shot of state.proposal.shotScript) {
    if (!ttsFirst) {
      await new Promise((r) => setTimeout(r, 1000)); // TTS 请求间隔 1s 避免限流
    }
    ttsFirst = false;

    const scene = state.videoScript.sceneScripts.find((s) => s.sceneId === shot.sceneId);
    if (!scene) throw new Error(`Scene script not found for ${shot.sceneId}`);

    const narrationText = scene.audio.narration?.text ?? null;
    const narrationEmotion = scene.audio.narration?.emotion ?? 'neutral';
    const pauseAfter = scene.audio.narration?.pauseAfter ?? 0.5;
    const dialogues = (scene.audio.dialogues ?? []).filter((d) => d.text.trim());

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
      audioPath = path.join(audioDir, `${shot.sceneId}.mp3`);
      fs.writeFileSync(audioPath, ttsResult.audioBuffer);
    } else {
      audioPath = path.join(audioDir, `${shot.sceneId}_silent.mp3`);
      await generateSilence(audioPath, shot.duration);
    }

    // 对齐时长
    const rawPath = audioPath;
    audioPath = path.join(audioDir, `${shot.sceneId}_aligned.mp3`);
    await alignAudioDuration(rawPath, audioPath, shot.duration);

    audioSegments.push({
      sceneId: shot.sceneId,
      audioUrl: audioPath,
      durationSec: shot.duration,
    });
  }

  console.log(`[agent] tts → ${audioSegments.length} 个音频片段 (SSML)`);

  return {
    audioSegments,
  };
}

// ============================================================
// 节点 6：Shot Video Sequential（串行逐镜头视频生成）
// ============================================================

export async function sequentialShotVideoNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  if (!state.proposal) throw new Error('缺少 Proposal');
  if (!state.videoScript) throw new Error('缺少 VideoScript');
  if (!state.assetManifest) throw new Error('缺少 AssetManifest');

  const jobId = state.jobId || 'unknown';
  const outputDir = path.join(process.cwd(), 'storage', 'scenes', jobId);
  fs.mkdirSync(outputDir, { recursive: true });

  const sceneVideos: SceneVideoResult[] = [];
  const shots = state.proposal.shotScript;

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i];
    const sceneScript = state.videoScript.sceneScripts.find((s) => s.sceneId === shot.sceneId);
    if (!sceneScript) throw new Error(`Scene script not found for ${shot.sceneId}`);

    // 镜头间间隔 5s 防止 API 限流
    if (i > 0) {
      console.log(`[agent] shot_video → 等待 5s 后处理下一个镜头...`);
      await new Promise((r) => setTimeout(r, 5000));
    }

    const sceneAsset = state.assetManifest.scenes.find((s) => s.sceneId === shot.sceneId);
    if (!sceneAsset) throw new Error(`Scene asset not found for ${shot.sceneId}`);

    const characterImagePaths: string[] = [];
    for (const charId of (shot.cast ?? [])) {
      const charAsset = state.assetManifest.characters.find((c) => c.characterId === charId);
      if (charAsset?.remoteViews) {
        for (const v of ['front', 'back', 'left', 'right'] as const) {
          if (charAsset.remoteViews[v]) characterImagePaths.push(charAsset.remoteViews[v]);
        }
      }
    }

    if (characterImagePaths.length === 0) {
      console.warn(`[agent] shot_video → ${shot.sceneId}: 无角色 OSS URL`);
    }

    const sceneImagePath = sceneAsset.remoteUrl ?? sceneAsset.imageUrl;

    console.log(
      `[agent] shot_video → ${shot.sceneId} (${i + 1}/${shots.length}, ` +
      `${shot.duration}s, ${characterImagePaths.length} 张角色图)`
    );

    const videoBuffer = await generateSingleVideo({
      sceneImagePath,
      characterImagePaths,
      motionDescription: sceneScript.videoGenPrompt.motionDescription,
      negativePrompt: sceneScript.videoGenPrompt.negativePrompt,
      duration: shot.duration,
      styleStrength: sceneScript.videoGenPrompt.styleStrength,
    });

    const outputPath = path.join(outputDir, `${shot.sceneId}.mp4`);
    fs.writeFileSync(outputPath, videoBuffer);
    sceneVideos.push({ sceneId: shot.sceneId, videoUrl: outputPath, durationSec: shot.duration, status: 'done' });
    console.log(`[agent] shot_video → ${shot.sceneId} done`);
  }

  console.log(`[agent] shot_video → 完成 ${sceneVideos.length} 个镜头 (${Date.now() - start}ms)`);

  return {
    sceneVideos,
  };
}

// ============================================================
// 节点 7：Video Merge（FFmpeg 拼接）— 零容错
// ============================================================

export async function videoMergeNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (!state.proposal) throw new Error('缺少 Proposal');

  const sceneVideos = state.sceneVideos;
  const audioSegments = state.audioSegments;

  if (sceneVideos.length !== state.proposal.shotScript.length) {
    throw new Error(`Video count mismatch: expected ${state.proposal.shotScript.length}, got ${sceneVideos.length}`);
  }

  const jobId = state.jobId || 'unknown';
  const outputDir = path.join(process.cwd(), 'storage', 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${jobId}.mp4`);

  // 按 shot 顺序排列
  const orderedVideos: SceneVideoResult[] = [];
  const orderedAudios: SceneAudioSegment[] = [];

  for (const shot of state.proposal.shotScript) {
    const video = sceneVideos.find((v) => v.sceneId === shot.sceneId);
    if (!video) throw new Error(`Missing video for ${shot.sceneId}`);
    orderedVideos.push(video);

    const audio = audioSegments.find((a) => a.sceneId === shot.sceneId);
    if (!audio) throw new Error(`Missing audio for ${shot.sceneId}`);
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
