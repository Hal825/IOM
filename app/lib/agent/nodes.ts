import { type VideoGenStateType, type VideoGenStateUpdate } from '@/lib/agent/state';
import { getQueue } from '@/lib/queue';
import { type ProcedureLog, createProcedureLog, saveProcedureLog } from '@/lib/log/procedure';
import { analyzeContent } from '@/lib/tools/research-generator';
import { generateProposal } from '@/lib/tools/proposal-generator';
import { generateAssets } from '@/lib/tools/asset-generator';
import { generateVideo } from '@/lib/tools/video-generator';
import { synthesizeSpeech } from '@/lib/tools/tts-generator';

// ── 公共工具 ────────────────────────────────────────

function ensureLog(state: VideoGenStateType): ProcedureLog {
  return (state._procedureLog as ProcedureLog | null) ?? createProcedureLog(state.jobId || 'unknown');
}

// ── 节点 1：Research 调研 ────────────────────────────

export async function researchNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  const prompt = state.userPrompt;
  if (!prompt?.trim()) {
    throw new Error('用户输入为空');
  }

  const log = ensureLog(state);
  log.stages.research.input.userPrompt = prompt;

  try {
    const result = await analyzeContent(prompt);

    log.stages.research.output = {
      report: result.report,
      model: result.model,
      retries: result.retries,
      tokenUsage: result.tokenUsage,
    };

    console.log(
      `[agent] research → ${result.report.contentSkeleton.segments.length} 个段落, ` +
        `角色需求: ${result.report.characterAnalysis.hasCharacter ? '是' : '否'} ` +
        `(model: ${result.model})`
    );

    return {
      researchReport: result.report,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.stages.research.error = message;
    throw err;
  } finally {
    log.stages.research.durationMs = Date.now() - start;
  }
}

// ── 节点 2：Proposal 提案 ────────────────────────────

export async function proposalNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  const log = state._procedureLog as ProcedureLog | null;

  if (log) {
    log.stages.proposal.input = {
      researchReport: state.researchReport ?? undefined,
      userPrompt: state.userPrompt,
    };
  }

  try {
    const result = await generateProposal(
      state.researchReport ?? null,
      state.userPrompt,
      state.style ?? undefined
    );

    if (log) {
      log.stages.proposal.output = {
        proposal: result.proposal,
        model: result.model,
        retries: result.retries,
        tokenUsage: result.tokenUsage,
      };
    }

    const charInfo = result.proposal.characters?.length
      ? `, ${result.proposal.characters.length} 个角色`
      : '';

    console.log(
      `[agent] proposal → ${result.proposal.shotScript.length} 个镜头, ` +
        `${result.proposal.blueprint.totalDuration}s${charInfo} ` +
        `(model: ${result.model})`
    );

    return {
      proposal: result.proposal,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.proposal.error = message;
    throw err;
  } finally {
    if (log) log.stages.proposal.durationMs = Date.now() - start;
  }
}

// ── 节点 3：Asset Generation 素材生成 ────────────────

export async function assetGenNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  if (!state.proposal) {
    throw new Error('缺少 Proposal，请先执行提案生成');
  }

  const log = state._procedureLog as ProcedureLog | null;
  if (log) {
    log.stages.asset_gen.input = {
      proposal: {
        characterCount: state.proposal.characters?.length ?? 0,
        sceneCount: state.proposal.shotScript.length,
      },
    };
  }

  try {
    const jobId = state.jobId || `asset-${Date.now()}`;
    const result = await generateAssets(state.proposal, jobId);

    if (log) {
      log.stages.asset_gen.output = {
        manifest: result.manifest,
        characterCount: result.characterCount,
        sceneCount: result.sceneCount,
      };
    }

    console.log(
      `[agent] asset_gen → ${result.characterCount} 个角色, ` +
        `${result.sceneCount} 个场景背景`
    );

    return {
      assetManifest: result.manifest,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.asset_gen.error = message;
    throw err;
  } finally {
    if (log) log.stages.asset_gen.durationMs = Date.now() - start;
  }
}

// ── 节点 4：TTS 语音合成 ─────────────────────────────

export async function ttsNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  if (!state.proposal) {
    throw new Error('缺少 Proposal，请先执行提案生成');
  }

  const log = state._procedureLog as ProcedureLog | null;
  if (log) {
    log.stages.tts.input = {
      sceneCount: state.proposal.shotScript.length,
      voice: process.env.AI_TTS_VOICE ?? 'default',
    };
  }

  try {
    const jobId = state.jobId || `tts-${Date.now()}`;
    const result = await synthesizeSpeech(state.proposal, jobId);

    if (log) {
      log.stages.tts.output = {
        audioPath: result.audioPath,
        durationSec: result.durationSec,
        model: result.model,
      };
    }

    console.log(
      `[agent] tts → ${result.durationSec}s, model: ${result.model}` +
        (result.audioPath ? ` → ${result.audioPath}` : ' (占位)')
    );

    return {
      audioUrl: result.audioPath,
      audioDuration: result.durationSec,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) log.stages.tts.error = message;
    throw err;
  } finally {
    if (log) log.stages.tts.durationMs = Date.now() - start;
  }
}

// ── 节点 5：Video Generation 视频生成 + 入队 ─────────

export async function videoGenNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  if (!state.proposal) {
    throw new Error('缺少 Proposal');
  }
  if (!state.assetManifest) {
    throw new Error('缺少 AssetManifest，请先执行素材生成');
  }

  const log = state._procedureLog as ProcedureLog | null;
  const jobId = state.jobId || `job-${Date.now()}`;

  if (log) {
    log.stages.video_gen.input = {
      proposal: state.proposal.blueprint,
      assetManifest: {
        characterCount: state.assetManifest.characters.length,
        sceneCount: state.assetManifest.scenes.length,
      },
    };
  }

  try {
    // AI 视频生成（带入语音音频）
    const videoResult = await generateVideo(
      state.proposal,
      state.assetManifest,
      jobId,
      state.audioUrl || undefined
    );

    if (log) {
      log.stages.video_gen.output = {
        videoPath: videoResult.videoPath,
        durationSec: videoResult.durationSec,
        model: videoResult.model,
      };
    }

    console.log(
      `[agent] video_gen → ${videoResult.durationSec}s, model: ${videoResult.model}`
    );

    // 入队 BullMQ
    let queueJobId = jobId;
    try {
      const queue = getQueue();
      const job = await queue.add('generate-video', {
        text: state.userPrompt,
        videoUrl: videoResult.videoPath,
        durationSec: videoResult.durationSec,
      });
      queueJobId = String(job.id);

      if (log) {
        log.stages.queue.input = { jobData: { text: state.userPrompt, videoUrl: videoResult.videoPath } };
        log.stages.queue.output = { jobId: queueJobId };
      }

      console.log(`[agent] queue → job #${queueJobId} 已入队`);
    } catch (queueErr) {
      const qMsg = queueErr instanceof Error ? queueErr.message : String(queueErr);
      console.warn(`[agent] 入队失败（非致命）: ${qMsg}`);
      if (log) {
        log.stages.queue.error = qMsg;
      }
    }

    if (log) {
      log.jobId = queueJobId;
      log.stages.video_gen.durationMs = Date.now() - start;
      log.stages.queue.durationMs = Date.now() - start;
      log.finalStatus = 'success';
      await saveProcedureLog(log, queueJobId);
    }

    return {
      videoUrl: videoResult.videoPath,
      durationSec: videoResult.durationSec,
      videoGenStatus: 'completed',
      jobId: queueJobId,
      _procedureLog: log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (log) {
      log.stages.video_gen.error = message;
      log.stages.video_gen.durationMs = Date.now() - start;
      log.finalStatus = 'failed';
      log.globalError = message;
    }
    throw err;
  }
}
