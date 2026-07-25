import { StateGraph, END, Send } from '@langchain/langgraph';
import { VideoGenState, type VideoGenStateType } from './state';
import {
  scriptAiNode,
  ttsNode,
  matchVisualNode,
  composeVideoNode,
  queueNode,
  researchNode,
  proposalNode,
} from './nodes';

/**
 * Phase 3 工作流（含调研 + 提案）：
 *
 *   __start__
 *       │
 *   research      ← 文本分析（LLM + 规则回退）
 *       │
 *   generate_proposal ← 分镜提案（LLM + 规则回退）
 *       │
 *   script_ai     ← 从 Proposal.shotScript 映射 ScriptScene[]（或回退 AI 生成）
 *       │
 *   fanout (Send) ← 并行分派到 tts + match_visual
 *     ╱     ╲
 *   tts   match_visual   ← 并发执行（无依赖关系）
 *     ╲     ╱
 *   compose_video  ← 同步点：帧区间 + 画面按 sceneIndex 对齐
 *       │
 *   queue          ← BullMQ 入队
 *       │
 *      END
 */

/** fan-out 路由函数：返回 Send[] 将脚本同时分派给 TTS 和画面匹配 */
function fanout(state: VideoGenStateType): Send[] {
  return [
    new Send('tts', { scriptSegments: state.scriptSegments }),
    new Send('match_visual', { scriptSegments: state.scriptSegments }),
  ];
}

const workflow = new StateGraph(VideoGenState)
  .addNode('research', researchNode)
  .addNode('generate_proposal', proposalNode)
  .addNode('script_ai', scriptAiNode)
  .addNode('tts', ttsNode)
  .addNode('match_visual', matchVisualNode)
  .addNode('compose_video', composeVideoNode)
  .addNode('queue', queueNode)

  // 入口 → 调研 → 提案 → 脚本生成
  .addEdge('__start__', 'research')
  .addEdge('research', 'generate_proposal')
  .addEdge('generate_proposal', 'script_ai')
  // fan-out: Send API 并行分派
  .addConditionalEdges('script_ai', fanout)
  // 汇聚：两个并发分支都指向 compose_video
  .addEdge('tts', 'compose_video')
  .addEdge('match_visual', 'compose_video')
  // 后续线性流转
  .addEdge('compose_video', 'queue')
  .addEdge('queue', END);

export const videoGraph = workflow.compile();
