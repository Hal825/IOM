import { StateGraph, END, Send } from '@langchain/langgraph';
import { VideoGenState, type VideoGenStateType } from './state';
import {
  scriptAiNode,
  ttsNode,
  matchVisualNode,
  composeVideoNode,
  queueNode,
} from './nodes';

/**
 * Phase 2 工作流：AI 脚本 + 并行 fan-out（TTS ∥ 画面匹配）。
 *
 *   __start__
 *       │
 *   script_ai      ← DeepSeek LLM 脚本生成（失败回退规则切句）
 *       │
 *   fanout (Send)  ← 并行分派到 tts + match_visual
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
  .addNode('script_ai', scriptAiNode)
  .addNode('tts', ttsNode)
  .addNode('match_visual', matchVisualNode)
  .addNode('compose_video', composeVideoNode)
  .addNode('queue', queueNode)

  // 入口 → AI 脚本生成
  .addEdge('__start__', 'script_ai')
  // fan-out: Send API 并行分派
  .addConditionalEdges('script_ai', fanout)
  // 汇聚：两个并发分支都指向 compose_video
  .addEdge('tts', 'compose_video')
  .addEdge('match_visual', 'compose_video')
  // 后续线性流转
  .addEdge('compose_video', 'queue')
  .addEdge('queue', END);

export const videoGraph = workflow.compile();
