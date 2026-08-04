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
  pauseGateNode,
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
 *
 * 阶段间插入 pause_gate_1..4（逐任务暂停/恢复检查点：暂停阻塞、恢复放行、删除中止）。
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
  .addNode('pause_gate_1', pauseGateNode)
  .addNode('generate_proposal', proposalNode)
  .addNode('script_generation', scriptGenNode)
  .addNode('pause_gate_2', pauseGateNode)
  .addNode('asset_gen', assetGenNode)
  .addNode('tts', ttsNode)
  .addNode('scene_json_assembler', sceneJsonAssemblerNode)
  .addNode('pause_gate_3', pauseGateNode)
  .addNode('shot_video_gen', shotVideoGenNode)
  .addNode('pause_gate_4', pauseGateNode)
  .addNode('video_merge', videoMergeNode)

  // 顺序链（阶段间插暂停点：暂停在此阻塞轮询，恢复放行，删除中止）
  .addEdge('__start__', 'research')
  .addEdge('research', 'pause_gate_1')
  .addEdge('pause_gate_1', 'generate_proposal')
  .addEdge('generate_proposal', 'script_generation')
  .addEdge('script_generation', 'pause_gate_2')

  // 并行：asset_gen + tts（pause_gate_2 之后分发）
  .addConditionalEdges('pause_gate_2', fanoutAssetsTts, ['asset_gen', 'tts'])

  // asset_gen 和 tts 都完成后 → 组装单镜头完整 JSON → 逐镜头视频 → 拼接 → END
  .addEdge('asset_gen', 'scene_json_assembler')
  .addEdge('tts', 'scene_json_assembler')
  .addEdge('scene_json_assembler', 'pause_gate_3')
  .addEdge('pause_gate_3', 'shot_video_gen')
  .addEdge('shot_video_gen', 'pause_gate_4')
  .addEdge('pause_gate_4', 'video_merge')
  .addEdge('video_merge', END);

export const videoGraph = workflow.compile();
