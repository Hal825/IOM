/**
 * 前端 agent — 把节点的「完整输出」组织成自然语言，流式输出给用户（像 LLM 网页交互）。
 *
 * 职责：协调器拿到 node 事件后，把原始结构化输出交给本 provider.stream()，
 * LLM 模式（FRONTEND_AGENT=on）逐 token 调 onDelta（协调器转发为 SSE agent_delta）；
 * 关闭/失败时用每节点类型的确定性模板摘要兜底（不调付费 API）。
 * 表现层软失败：NL 失败不 fail 任务，兜底摘要照常出（与图内零容错解耦）。
 */
import type { CardType } from '@/lib/conversations/types';
import { streamChatCompletion } from '@/lib/tools/llm';

export interface FrontendAgentInput {
  nodeName: string;
  cardType: CardType;
  /** 节点完整输出（Partial state） */
  output: Record<string, unknown>;
}

export interface FrontendAgentProvider {
  /**
   * 生成自然语言；逐 token 调 onDelta。返回最终全文。
   * 失败时返回兜底文本（onDelta 不再补发，前端用全文替换已流的部分）。
   */
  stream(input: FrontendAgentInput, onDelta: (d: string) => void): Promise<{ text: string }>;
}

const AGENT_API_KEY = process.env.AGENT_API_KEY ?? process.env.LLM_TEXT_API_KEY;
const AGENT_BASE_URL = process.env.AGENT_BASE_URL ?? process.env.LLM_TEXT_BASE_URL;
const AGENT_LLM_MODEL = process.env.AGENT_LLM_MODEL ?? process.env.LLM_TEXT_MODEL;

const FRONTEND_AGENT_SYSTEM = `你是 OpenMontage 视频生成工作流的前端展示助手。系统逐个节点产出结构化数据，请把刚完成的节点产物组织成面向用户的中文自然语言（像 ChatGPT 回复一样自然，可少量使用 Markdown 列表/加粗）。
要点：
- 把数据翻译成人话，突出对用户有用的信息（结果、数量、时长、下一步）；
- 语气像一个靠谱的创作伙伴，简洁不啰嗦；
- 只输出给用户看的内容，不要输出 JSON、不要代码块、不要任何前缀或引号。`;

/** 喂给 LLM 的完整输出上限（script/asset 输出很大，给足上下文但防超限） */
const MAX_INPUT_CHARS = 12_000;

async function streamFrontendAgentNL(
  input: FrontendAgentInput,
  onDelta: (d: string) => void
): Promise<string> {
  if (!AGENT_API_KEY || !AGENT_BASE_URL || !AGENT_LLM_MODEL) {
    throw new Error('前端 agent LLM 未配置（AGENT_* 或回退 LLM_TEXT_*）');
  }
  const user = `节点 ${input.nodeName}（${input.cardType}）的完整产物：\n${JSON.stringify(
    input.output
  ).slice(0, MAX_INPUT_CHARS)}\n\n请用自然语言向用户汇报这个节点的结果。`;
  return streamChatCompletion(
    {
      apiKey: AGENT_API_KEY,
      baseUrl: AGENT_BASE_URL,
      model: AGENT_LLM_MODEL,
      messages: [
        { role: 'system', content: FRONTEND_AGENT_SYSTEM },
        { role: 'user', content: user },
      ],
      maxTokens: 500,
      temperature: 0.7,
      label: 'frontend-agent',
    },
    onDelta
  );
}

function num(v: unknown): number | null {
  return typeof v === 'number' ? v : null;
}
function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

/** 每节点类型的确定性中文摘要（LLM 关闭/失败时兜底，不调付费 API） */
export function fallbackSummary(nodeName: string, output: Record<string, unknown>): string {
  const o = output;
  switch (nodeName) {
    case 'research': {
      const report = o.researchReport as Record<string, unknown> | undefined;
      const cra = report?.content_readiness_assessment as Record<string, unknown> | undefined;
      const demand = report?.user_demand as Record<string, unknown> | undefined;
      const demands = Array.isArray(demand?.demands) ? demand.demands : [];
      const score = num(cra?.overallScore);
      return `调研完成：提取需求 ${demands.length} 条，内容就绪度${score !== null ? ` ${score} 分` : ' —'}。`;
    }
    case 'generate_proposal': {
      const proposal = o.proposal as Record<string, unknown> | undefined;
      const blueprint = proposal?.blueprint as Record<string, unknown> | undefined;
      const visuals = Array.isArray(proposal?.sceneVisuals) ? proposal.sceneVisuals : [];
      const scenes = visuals.reduce(
        (sum, sv) => sum + (Array.isArray((sv as Record<string, unknown>).scenes) ? ((sv as Record<string, unknown>).scenes as unknown[]).length : 0),
        0
      );
      const dur = num(blueprint?.totalDuration);
      const title = str(blueprint?.title);
      return `提案完成：${title ? `《${title}》` : '视频方案'}，${visuals.length} 个空间 / ${scenes} 个镜头${dur !== null ? `，总时长 ${dur}s` : ''}。`;
    }
    case 'script_generation': {
      const script = o.videoScript as Record<string, unknown> | undefined;
      const board = script?.storyboardScript as Record<string, unknown> | undefined;
      const scenes = Array.isArray(board?.scenes) ? board.scenes.length : 0;
      return `脚本完成：${scenes} 个镜头的四子脚本。`;
    }
    case 'asset_gen': {
      const manifest = o.assetManifest as Record<string, unknown> | undefined;
      const chars = manifest?.characters as Record<string, unknown> | undefined;
      const scenes = manifest?.scenes as Record<string, unknown> | undefined;
      const charCount = chars ? Object.keys(chars).length : 0;
      const sceneCount = scenes ? Object.keys(scenes).length : 0;
      return `素材完成：${charCount} 个角色素材，${sceneCount} 个场景背景。`;
    }
    case 'tts': {
      const segments = Array.isArray(o.audioSegments) ? o.audioSegments : [];
      return `配音完成：${segments.length} 个音频片段。`;
    }
    case 'scene_json_assembler': {
      const specs = Array.isArray(o.sceneSpecs) ? o.sceneSpecs : [];
      return `场景规格完成：${specs.length} 个镜头的完整生成规格。`;
    }
    case 'shot_video_gen': {
      const videos = Array.isArray(o.sceneVideos) ? o.sceneVideos : [];
      return `逐镜头视频完成：${videos.length} 个镜头已生成。`;
    }
    case 'video_merge': {
      const dur = num(o.durationSec);
      return `拼接完成：成片${dur !== null ? `时长 ${dur}s` : '已生成'}。`;
    }
    default:
      return `节点 ${nodeName} 完成。`;
  }
}

/** 按 env 创建前端 agent provider（FRONTEND_AGENT=on 走 LLM，否则模板兜底） */
export function createFrontendAgentProvider(): FrontendAgentProvider {
  const enabled = process.env.FRONTEND_AGENT === 'on';
  return {
    async stream(input, onDelta) {
      if (!enabled) {
        const text = fallbackSummary(input.nodeName, input.output);
        onDelta(text);
        return { text };
      }
      try {
        const text = await streamFrontendAgentNL(input, onDelta);
        if (!text.trim()) {
          const fb = fallbackSummary(input.nodeName, input.output);
          onDelta(fb);
          return { text: fb };
        }
        return { text };
      } catch (err) {
        console.warn(
          '[frontend-agent] 流式 NL 失败，模板兜底:',
          err instanceof Error ? err.message : err
        );
        // 已流出的部分由前端用最终 text（兜底全文）替换，这里不补发 onDelta
        return { text: fallbackSummary(input.nodeName, input.output) };
      }
    },
  };
}
