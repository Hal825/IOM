import { type VideoGenStateType, type VideoGenStateUpdate } from '../state';
import { generateProposal } from '@/lib/tools/proposal-generator';
import { type ProcedureLog } from '@/lib/log/procedure';

/**
 * Proposal 节点：视频制作方案生成。
 *
 * 基于 ResearchReport（或原始文本兜底）生成：
 * - 视频蓝图（标题、时长、场景数、比例）
 * - 分镜脚本（sceneId / duration / visualDescription / layout / subtitleText / audioTts）
 * - 风格指南（配色 / 字体 / BGM / 转场）
 * - 可行性评估
 *
 * 输出 proposal 写入 state，供 script_ai 节点消费。
 * generateProposal() 内置兜底逻辑，不会因 LLM 失败而抛异常。
 */
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

    console.log(
      `[agent] proposal → ${result.proposal.shotScript.length} 个镜头，` +
        `${result.proposal.blueprint.totalDuration}s ` +
        `(model: ${result.model}, retries: ${result.retries})`
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
