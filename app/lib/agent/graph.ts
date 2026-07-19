import { StateGraph, END } from '@langchain/langgraph';
import { VideoGenState } from './state';
import { scriptNode, ttsNode, queueNode } from './nodes';

/**
 * 第一期工作流：纯线性确定性流转。
 *
 *   __start__ → script → tts → queue → END
 *
 * 每个节点的返回值被浅合并到全局状态中，下游节点通过 state 读取上游产出。
 */
const workflow = new StateGraph(VideoGenState)
  .addNode('script', scriptNode)
  .addNode('tts', ttsNode)
  .addNode('queue', queueNode)

  // 入口
  .addEdge('__start__', 'script')
  // 线性流转
  .addEdge('script', 'tts')
  .addEdge('tts', 'queue')
  .addEdge('queue', END);

export const videoGraph = workflow.compile();
