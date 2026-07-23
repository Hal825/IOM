import { type VideoGenStateType, type VideoGenStateUpdate } from '../state';
import { analyzeContent } from '@/lib/tools/research-generator';
import {
  type ProcedureLog,
  createProcedureLog,
} from '@/lib/log/procedure';

/**
 * Research 节点：文本内容分析与结构识别。
 *
 * 调用 LLM（或规则兜底）分析 userPrompt：
 * - 语义分段 + 摘要 + 关键词
 * - 逻辑流类型（chronological / cause-effect / problem-solution / narrative）
 * - 风格基调（tone / pace / visualStyle / suggestedBGM）
 *
 * 输出 researchReport 写入 state，供 proposal 节点消费。
 * analyzeContent() 内置兜底逻辑，不会因 LLM 失败而抛异常。
 */
export async function researchNode(
  state: VideoGenStateType
): Promise<Partial<VideoGenStateUpdate>> {
  const start = Date.now();
  const prompt = state.userPrompt;
  if (!prompt?.trim()) {
    throw new Error('用户输入为空');
  }

  // 初始化日志（若尚未创建）
  const log: ProcedureLog =
    (state._procedureLog as ProcedureLog | null) ??
    createProcedureLog(state.jobId || 'unknown');
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
      `[agent] research → ${result.report.contentSkeleton.segments.length} 个段落 ` +
        `(model: ${result.model}, retries: ${result.retries})`
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
