import { StateGraph, END, Send } from '@langchain/langgraph';
import { VideoGenState, type VideoGenStateType } from './state';
import {
  researchNode,
  proposalNode,
  scriptGenNode,
  assetGenNode,
  ttsNode,
  sequentialShotVideoNode,
  videoMergeNode,
} from './nodes';

/**
 * 节点拓扑（视频改为串行避免 API 限流）：
 *
 *   __start__
 *       │
 *   research              ← 文本分析
 *       │
 *   generate_proposal     ← 分镜方案 + 角色设计
 *       │
 *   script_generation     ← 逐镜头脚本
 *       │
 *   fanout_assets_tts     ← 并行分发
 *     ╱        ╲
 *   asset_gen  tts        ← 素材生成 + 分段语音合成
 *     ╲        ╱
 *   shot_video_sequential ← 串行逐个生成视频片段（间隔 5s 防限流）
 *       │
 *   video_merge           ← FFmpeg 拼接 + 音轨合成
 *       │
 *      END
 */

// ── Fanout：asset_gen 和 tts 并行分发 ──

function fanoutAssetsTts(state: VideoGenStateType): Send[] {
  return [
    new Send('asset_gen', { proposal: state.proposal, videoScript: state.videoScript }),
    new Send('tts', { proposal: state.proposal, videoScript: state.videoScript }),
  ];
}

// ── 编译状态图 ──────────────────────────────────────

const workflow = new StateGraph(VideoGenState)
  .addNode('research', researchNode)
  .addNode('generate_proposal', proposalNode)
  .addNode('script_generation', scriptGenNode)
  .addNode('asset_gen', assetGenNode)
  .addNode('tts', ttsNode)
  .addNode('shot_video_sequential', sequentialShotVideoNode)
  .addNode('video_merge', videoMergeNode)

  // 顺序链
  .addEdge('__start__', 'research')
  .addEdge('research', 'generate_proposal')
  .addEdge('generate_proposal', 'script_generation')

  // 并行：asset_gen + tts
  .addConditionalEdges('script_generation', fanoutAssetsTts, ['asset_gen', 'tts'])

  // asset_gen 和 tts 都完成后 → 串行视频
  .addEdge('asset_gen', 'shot_video_sequential')
  .addEdge('tts', 'shot_video_sequential')

  // 视频完成 → 拼接
  .addEdge('shot_video_sequential', 'video_merge')
  .addEdge('video_merge', END);

export const videoGraph = workflow.compile();
