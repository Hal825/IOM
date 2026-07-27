import { type VideoGenStateType, type VideoGenStateUpdate } from './state';
import { getQueue } from '@/lib/queue';
import { type ProcedureLog, createProcedureLog, saveProcedureLog } from '@/lib/log/procedure';
import { analyzeContent } from '@/lib/tools/research-generator';
import { generateProposal } from '@/lib/tools/proposal-generator';
import { generateAssets } from '@/lib/tools/asset-generator';
import { generateVideo } from '@/lib/tools/video-generator';

// ── 公共工具 ────────────────────────────────────────

function ensureLog(state: VideoGenStateType): ProcedureLog {
  return (state._procedureLog as ProcedureLog | null) ?? createProcedureLog(state.jobId || 'unknown');
}

// ── 节点 1：Research 调研 ────────────────────────────

/**
 * Research 节点：文本内容分析与结构识别。
 *
 * 调用 LLM（或规则兜底）分析 userPrompt：
 * - 语义分段 + 摘要 + 关键词
 * - 逻辑流类型
 * - 风格基调
 * - 角色需求检测（hasCharacter + characterHints）
 *
 * 输出 researchReport 写入 state，供 proposal 节点消费。
 */
export async function researchNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();// 记录节点开始时间
  const prompt = state.userPrompt;// 用户输入文本
  if (!prompt?.trim()) {
    throw new Error('用户输入为空');
  }

  const log = ensureLog(state);
  log.stages.research.input.userPrompt = prompt;// 记录输入日志

  try {
    const result = await analyzeContent(prompt);// 调用内容分析工具

    log.stages.research.output = {// 记录输出日志
      report: result.report,
      model: result.model,
      retries: result.retries,
      tokenUsage: result.tokenUsage,
    };

    console.log(// 输出调试信息
      `[agent] research → ${result.report.contentSkeleton.segments.length} 个段落, ` +
        `角色需求: ${result.report.characterAnalysis.hasCharacter ? '是' : '否'} ` +
        `(model: ${result.model})`
    );

    return {// 返回更新 state
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

/**
 * Proposal 节点：视频制作方案生成。
 *
 * 基于 ResearchReport（或原始文本兜底）生成：
 * - 视频蓝图（标题、时长、场景数、比例）
 * - 分镜脚本（sceneId / duration / visualDescription / layout / subtitleText / videoPrompt）
 * - 风格指南（配色 / 字体 / BGM / 转场）
 * - 角色设计（仅当 research 判定需要角色时）
 * - 可行性评估 + 视频生成配置
 */
export async function proposalNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();// 记录节点开始时间
  const log = state._procedureLog as ProcedureLog | null;// 获取日志对象

  if (log) {
    log.stages.proposal.input = {// 记录输入日志
      researchReport: state.researchReport ?? undefined,
      userPrompt: state.userPrompt,
    };
  }

  try {
    const result = await generateProposal(// 调用提案生成工具
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
      : '';// 记录角色数量信息

    console.log(// 输出调试信息
      `[agent] proposal → ${result.proposal.shotScript.length} 个镜头, ` +
        `${result.proposal.blueprint.totalDuration}s${charInfo} ` +
        `(model: ${result.model})`
    );

    return {// 返回更新 state
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

/**
 * Asset Gen 节点：素材生成。
 *
 * 基于 Proposal 中的 characters 和 shotScript：
 * - 每个角色 → AI 生成前后左右 4 视图
 * - 每个镜头 → AI 生成场景背景图
 *
 * 输出 assetManifest（角色视图 + 场景背景图路径清单）。
 */
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
    const jobId = state.jobId || `asset-${Date.now()}`;// 生成素材的唯一标识
    const result = await generateAssets(state.proposal, jobId);// 调用素材生成工具

    if (log) {
      log.stages.asset_gen.output = {// 记录输出日志
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

// ── 节点 4：Video Generation 视频生成 + 入队 ─────────

/**
 * Video Gen 节点：AI 视频生成 + BullMQ 入队。
 *
 * 将 Proposal + AssetManifest 提交给 AI 视频生成服务。
 * 完成后将结果入队 BullMQ，供前端轮询/下载。
 */
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
    // 1. AI 视频生成
    const videoResult = await generateVideo(
      state.proposal,// 提案蓝图 + 分镜脚本
      state.assetManifest,// 角色视图 + 场景背景图
      jobId
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

    // 2. 入队 BullMQ（记录任务完成状态，供前端查询）
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

    // 3. 保存日志
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
