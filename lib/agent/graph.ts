import { StateGraph, END, Send } from '@langchain/langgraph';
import { VideoGenState, type VideoGenStateType } from './state';
import {
  researchNode,
  proposalNode,
  assetGenNode,
  ttsNode,
  videoGenNode,
} from './nodes';

/**
 * 新工作流（纯 AI 管线）：
 *
 *   __start__
 *       │
 *   research       ← 文本分析（LLM + 规则回退）
 *       │
 *   proposal       ← 分镜提案 + 角色设计（LLM + 规则回退）
 *       │
 *   fanout (Send)  ← 并行分派到 asset_gen + tts
 *     ╱     ╲
 *   asset_gen   tts    ← 并发执行（两者均只依赖 proposal，无相互依赖）
 *     ╲     ╱
 *   video_gen      ← 汇聚点：Proposal + AssetManifest + audioUrl → AI 视频生成
 *       │
 *      END
 */

/** fan-out 路由函数：将 proposal 同时分派给素材生成和语音合成 */
function fanout(state: VideoGenStateType): Send[] {
  return [
    new Send('asset_gen', { proposal: state.proposal }),
    new Send('tts', { proposal: state.proposal }),
  ];
}

const workflow = new StateGraph(VideoGenState)
  .addNode('research', researchNode)
  .addNode('generate_proposal', proposalNode)
  .addNode('asset_gen', assetGenNode)
  .addNode('tts', ttsNode)
  .addNode('video_gen', videoGenNode)

  // 入口 → 调研 → 提案
  .addEdge('__start__', 'research')
  .addEdge('research', 'generate_proposal')
  // fan-out: Send API 并行分派 asset_gen 和 tts
  .addConditionalEdges('generate_proposal', fanout)
  // 汇聚：两个并发分支都指向 video_gen
  .addEdge('asset_gen', 'video_gen')
  .addEdge('tts', 'video_gen')
  .addEdge('video_gen', END);

export const videoGraph = workflow.compile();
