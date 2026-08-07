import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { type VideoGenStateType, type VideoGenStateUpdate, type SceneAudioSegment, type SceneVideoResult } from './state';
import type { SceneVideoSpec } from '@/lib/types';
import { shouldFireGate } from './rerun';
import { analyzeContent } from '@/lib/tools/research-generator';
import { generateProposal } from '@/lib/tools/proposal-generator';
import { generateScript } from '@/lib/tools/script-generator';
import { generateAssets } from '@/lib/tools/asset-generator';
import { synthesizeSpeech } from '@/lib/tools/tts-generator';
import { buildShotSSML } from '@/lib/prompts/tts';
import { AssetStore } from '@/lib/store/asset-store';
import { saveStageLog, calculateCost, formatDurationSec } from '@/lib/log/procedure';
import { beginDecision } from '@/lib/pause';
import {
  generateSceneVideo,
  runWithConcurrency,
  clampDuration,
  buildMotionDescription,
  resolutionToTier,
  type VideoGenRequest,
} from '@/lib/tools/video-generation';

// ── FFmpeg 辅助 ──────────────────────────────────────

// 懒加载 fluent-ffmpeg：仅在使用时 require，避免无 ffmpeg 环境下模块级加载即失败。
// 类型用 typeof import 推断（@types/fluent-ffmpeg），不引入运行时依赖。
type FfmpegModule = typeof import('fluent-ffmpeg');
let _ffmpeg: FfmpegModule | null = null;

/** ffmpeg.exe 路径：环境变量 FFMPEG_PATH 优先，否则用系统 PATH 自动查找 */
const FFMPEG_PATH = process.env.FFMPEG_PATH;

function ffmpeg(...args: Parameters<FfmpegModule>): ReturnType<FfmpegModule> {
  if (!_ffmpeg) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- 懒加载设计
      _ffmpeg = require('fluent-ffmpeg') as FfmpegModule;
      if (FFMPEG_PATH) {
        _ffmpeg.setFfmpegPath(FFMPEG_PATH);
      }
    } catch {
      throw new Error('fluent-ffmpeg 未安装，请运行 npm install fluent-ffmpeg');
    }
  }
  if (!_ffmpeg) throw new Error('fluent-ffmpeg 加载失败');
  return _ffmpeg(...args);
}

/** 解析 ffprobe 可执行路径：FFMPEG_PATH 指向 ffmpeg 时同目录取 ffprobe，否则用系统 PATH */
function getFfprobeBin(): string {
  if (FFMPEG_PATH) {
    const dir = path.dirname(FFMPEG_PATH);
    const base = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
    return path.join(dir, base);
  }
  return 'ffprobe';
}

/**
 * 用 ffprobe 校验视频文件真实生成成功，并取实际时长（秒）。
 * 校验失败（文件损坏/无有效流/时长不可解析）→ 抛错（零容错，视为该镜头生成失败）。
 */
function probeVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    execFile(
      getFfprobeBin(),
      [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        filePath,
      ],
      (err, stdout) => {
        if (err) {
          reject(new Error(`ffprobe 校验失败 ${filePath}: ${err.message}`));
          return;
        }
        const duration = parseFloat(stdout.trim());
        if (!Number.isFinite(duration) || duration <= 0) {
          reject(new Error(`无法解析视频时长 ${filePath}: ${stdout.trim() || '(空)'}`));
          return;
        }
        resolve(duration);
      }
    );
  });
}

// ── 脚本存储目录 ────────────────────────────────────

const SCRIPTS_DIR = path.resolve(process.cwd(), 'storage', 'scripts');

// ============================================================
// 节点 1：Research（调研）— 零容错
// ============================================================

export async function researchNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (state.researchReport) return {}; // 重跑：上游产出已存在 → 跳过
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
  if (state.proposal) return {}; // 重跑：上游产出已存在 → 跳过
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
  if (state.videoScript) return {}; // 重跑：上游产出已存在 → 跳过
  if (!state.proposal) throw new Error('缺少 Proposal');

  const result = await generateScript(
    state.proposal,
    state.researchReport ?? null,
    state.userPrompt,
    state.style ?? undefined // styleHint 必须与 proposal 轮同值，保持追加式对话前缀一致
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
  if (state.assetManifest) return {}; // 重跑：上游产出已存在 → 跳过
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
  if (state.audioSegments?.length) return {}; // 重跑：上游产出已存在 → 跳过
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
  if (state.sceneSpecs?.length) return {}; // 重跑：上游产出已存在 → 跳过
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
// 节点 7：Shot Video Gen（逐镜头视频生成）— 零容错 + 并发窗口
// ============================================================

/**
 * 逐个镜头真实调用视频生成 API（经模型无关抽象层 generateSceneVideo），
 * 并发窗口（AI_VIDEO_CONCURRENCY，默认 2），产物落 storage/scenes/{jobId}/{sceneId}.mp4。
 * 每个镜头写出后用 ffprobe 校验真实生成成功并取实际时长。
 * 同时写盘 scene-specs.json（视频生成脚本包，审计/复用用）。任一镜头失败 → 整体失败（零容错）。
 */
export async function shotVideoGenNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (state.sceneVideos?.length) return {}; // 重跑：上游产出已存在 → 跳过
  const sceneSpecs = state.sceneSpecs ?? [];
  if (sceneSpecs.length === 0) throw new Error('缺少 SceneSpecs（shot_video_gen）');
  if (!state.jobId) throw new Error('缺少 jobId（shot_video_gen）');

  const jobId = state.jobId;
  const scenesDir = path.join(process.cwd(), 'storage', 'scenes', jobId);
  fs.mkdirSync(scenesDir, { recursive: true });

  // 写盘视频生成脚本包（交接凭证，便于审计/后续复用）
  const specPath = path.join(scenesDir, 'scene-specs.json');
  fs.writeFileSync(specPath, JSON.stringify(sceneSpecs, null, 2), 'utf-8');

  const concurrency = Number(process.env.AI_VIDEO_CONCURRENCY ?? '2') || 2;
  const fallbackModel = process.env.AI_VIDEO_MODEL ?? '';
  const defaultResolution = process.env.AI_VIDEO_RESOLUTION ?? '720P';
  const styleStrength = Number(process.env.AI_VIDEO_STYLE_STRENGTH ?? '0.85');

  const sceneVideos: SceneVideoResult[] = [];

  await runWithConcurrency(sceneSpecs, concurrency, async (spec) => {
    // 模型：spec.engine 优先（脚本 prompt 固定为 AI_VIDEO_MODEL），回退 env
    const model = spec.engine?.trim() || fallbackModel;

    // 首帧硬依赖：必须为公网 http(s) URL（i2v 需要首帧）
    const sceneImageUrl = spec.assets.sceneImageUrl;
    if (!sceneImageUrl || !/^https?:\/\//i.test(sceneImageUrl)) {
      throw new Error(`场景 ${spec.sceneId} 缺少公网场景图（i2v 需要首帧 URL）`);
    }

    const durationSec = clampDuration(spec.duration);
    // spec.resolution 为宽x高（如 854x480），映射为档位；映射不到则回退 env
    const resolution = resolutionToTier(spec.resolution) ?? defaultResolution;

    const req: VideoGenRequest = {
      model,
      sceneImageUrl,
      characterImageUrls: spec.assets.characterImageUrls,
      motionDescription: buildMotionDescription(spec.storyboard),
      negativePrompt: spec.storyboard.negativePrompt,
      durationSec,
      resolution,
      styleStrength,
    };

    console.log(`[shot_video_gen] ${spec.sceneId} → ${model} (${resolution}, ${durationSec}s)`);
    const { buffer } = await generateSceneVideo(req);

    const videoUrl = path.join(scenesDir, `${spec.sceneId}.mp4`);
    fs.writeFileSync(videoUrl, buffer);

    // 用 ffprobe 校验视频真实生成成功，并取实际时长（失败视为该镜头生成失败）
    const actualDuration = await probeVideoDuration(videoUrl);
    sceneVideos.push({ sceneId: spec.sceneId, videoUrl, durationSec: actualDuration, status: 'done' });
  });

  console.log(`[shot_video_gen] 完成 ${sceneVideos.length} 个镜头 → ${scenesDir}`);

  return { sceneVideos };
}

// ============================================================
// 节点 8：Video Merge（FFmpeg 拼接）— 零容错
// ============================================================

export async function videoMergeNode(state: VideoGenStateType): Promise<Partial<VideoGenStateUpdate>> {
  if (state.mergedVideoUrl) return {}; // 重跑：上游产出已存在 → 跳过
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

    // 先设 output，再挂 filter_complex（不带 outputs 参数，避免 fluent-ffmpeg 自动 -map 与手动 -map 重复）
    cmd
      .output(outputPath)
      .complexFilter([vConcat, aConcat])
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-map', '[vout]', '-map', '[aout]', '-y'])
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

// ============================================================
// 暂停门节点（决策点）— human-in-loop 锚点
// beginDecision：置暂停标志 + 发布 gate 事件（幂等）→ 阻塞等待用户回复；
// 回复清标志放行，删除则抛错中止管线。4 个门各自带 gateId。
// ============================================================

export function createPauseGateNode(gateId: string) {
  return async function pauseGateNode(
    state: VideoGenStateType
  ): Promise<Partial<VideoGenStateUpdate>> {
    // 重跑时跳过上游门（避免重复确认）；正常跑全部提问
    if (!shouldFireGate(gateId, state.rerunFrom)) return {};
    await beginDecision(state.jobId, gateId);
    return {};
  };
}
