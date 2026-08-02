import { StateGraph, END, Send } from '@langchain/langgraph';
import { VideoGenState, type VideoGenStateType } from './state';
import {
  researchNode,
  proposalNode,
  scriptGenNode,
  assetGenNode,
  ttsNode,
  sceneJsonAssemblerNode,
  shotVideoGenNode,
  videoMergeNode,
} from './nodes';

/**
 * 节点拓扑：
 *
 *   __start__
 *       │
 *   research              ← 文本分析
 *       │
 *   generate_proposal     ← 分镜方案 + 角色设计
 *       │
 *   script_generation     ← 逐镜头四子脚本（storyboard 含 appearCharId + sceneImageRef）
 *       │
 *   fanout_assets_tts     ← 并行分发
 *     ╱        ╲
 *   asset_gen  tts        ← 素材生成（按 charId 产角色 + 按 sceneImageRef 去重生场景）+ 分段语音合成
 *     ╲        ╱
 *   scene_json_assembler  ← 组装单镜头完整视频生成 JSON（含素材/音频产物）
 *       │
 *   shot_video_gen        ← 逐镜头真实视频生成（模型无关适配器，并发窗口 + ffprobe 校验）
 *       │
 *   video_merge           ← FFmpeg 拼接逐镜头视频 + 合成音轨 → storage/output/{jobId}.mp4
 *       │
 *      END
 */

// ── Fanout：asset_gen 和 tts 并行分发 ──

function fanoutAssetsTts(state: VideoGenStateType): Send[] {
  return [
    new Send('asset_gen', { proposal: state.proposal, videoScript: state.videoScript, jobId: state.jobId }),
    new Send('tts', { proposal: state.proposal, videoScript: state.videoScript, jobId: state.jobId }),
  ];
}

// ── 编译状态图 ──────────────────────────────────────

const workflow = new StateGraph(VideoGenState)
  .addNode('research', researchNode)
  .addNode('generate_proposal', proposalNode)
  .addNode('script_generation', scriptGenNode)
  .addNode('asset_gen', assetGenNode)
  .addNode('tts', ttsNode)
  .addNode('scene_json_assembler', sceneJsonAssemblerNode)
  .addNode('shot_video_gen', shotVideoGenNode)
  .addNode('video_merge', videoMergeNode)

  // 顺序链
  .addEdge('__start__', 'research')
  .addEdge('research', 'generate_proposal')
  .addEdge('generate_proposal', 'script_generation')

  // 并行：asset_gen + tts
  .addConditionalEdges('script_generation', fanoutAssetsTts, ['asset_gen', 'tts'])

  // asset_gen 和 tts 都完成后 → 组装单镜头完整 JSON → 逐镜头视频 → 拼接 → END
  .addEdge('asset_gen', 'scene_json_assembler')
  .addEdge('tts', 'scene_json_assembler')
  .addEdge('scene_json_assembler', 'shot_video_gen')
  .addEdge('shot_video_gen', 'video_merge')
  .addEdge('video_merge', END);

export const videoGraph = workflow.compile();
