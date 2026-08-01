# Script 节点 Prompt 评测 — 新旧对比

**评测脚本**：`scripts/eval-script.ts`（Proposal → Script 串联，两轮独立运行）
**测试用例**：`请帮我制作一个30秒左右的科普视频，介绍人工智能如何改变医疗诊断，要有科技感，背景音乐舒缓一些`
**评测日志**：
- 旧版：`log/eval/script-eval-2026-07-31T14-10-22-516Z/`
- 新版：`log/eval/script-eval-2026-08-01T05-48-07-197Z/`

## 指标对比

| 指标 | 旧版(单 scenes[]) | 新版(四子脚本) | 差异 |
|---|---|---|---|
| script 耗时 | 43.1s | 38.6s | -10.4% |
| script Token | 6862 | 10459 | +52.4% |
| script 费用 | $0.00406 | $0.00615 | +51.6% |

## 输出结构对比

| 项 | 旧版 | 新版 |
|---|---|---|
| 顶层键 | `project` + `scenes[]`（一体化） | `storyScript` / `storyboardScript` / `audioScript` / `pacingScript` 四子脚本 |
| 剧情 | 无独立剧情层 | `storyScript.scenes[]`（sceneDescription + characters[actions/emotions] + narrative） |
| 分镜 | `scenes[].generation`（prompt 混写） | `storyboardScript.scenes[]`（shot/composition/lighting/visualElements/atmosphere/motionLevel/negativePrompt/resolution/fps/engine/mode + resourceRefs） |
| 音频 | `scenes[].audio`（bgm/sfx/dialogue 混在） | `audioScript.scenes[]`（dialogue/sfx/bgm）单独供 TTS |
| 节奏 | `scenes[].transition`（in/out/outDuration） | `pacingScript.scenes[]`（duration/transitionIn/transitionOut/keyMoments）单独供 video_merge |
| 场景 ID | `scene-1`... | `scene-1`...（与 Proposal 一致） |

## 质量结论（新版一致性校验全部通过）

- 四个子脚本 scenes[] **长度相同、sceneId 集合与顺序完全一致**（scene-1~4），与 Proposal 一一对应。
- duration 合计 8+7+9+6 = **30s = blueprint.totalDuration**。
- `sceneImageRef` 正确去重：visual-1 的 3 个镜头复用 `scene_visual-1`，visual-2 单独 `scene_visual-2`。
- 首镜头 fade-in、末镜头 fade-out；motionLevel 1-5；1920x1080 / 24fps 全部符合约束。
- 角色图片引用、台词、SFX、BGM 正确拆分到 audioScript / storyboardScript。
- **结论**：四子脚本职责单一（剧情/分镜/音频/节奏），下游 asset_gen / tts / video_merge 可各自只读所需子脚本，解耦清晰；token/费用上升是拆分后信息密度提升的代价。建议采用。

## 说明

- 旧版评测为 7/31 的"project + scenes[]"结构（当时新 prompt 的过渡形态），新版为 8/1 的四子脚本最终形态。
- 两轮为独立运行，proposal 输出不同（角色名不同：张医生/李阿姨 vs 林医生/陈阿姨），指标可比但不完全同源，结构差异是主要评估依据。
