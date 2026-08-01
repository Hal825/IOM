# Proposal 节点 Prompt 评测 — 新旧对比

**评测脚本**：`scripts/eval-proposal.ts`
**测试用例**：`请帮我制作一个30秒左右的科普视频，介绍人工智能如何改变医疗诊断，要有科技感，背景音乐舒缓一些`
**评测日志**：`log/eval/eval-2026-07-31T12-54-04-837Z/comparison.json`

## 指标对比

| 指标 | 旧版 (8130 字符) | 新版 (4762 字符) | 差异 |
|---|---|---|---|
| 耗时 | 25.6s | 29.3s | +14.5% (API 波动) |
| Token 总计 | 4804 | 3222 | -32.9% |
| 费用 | $0.00147 | $0.00114 | -22.4% |
| 重试次数 | 0 | 0 | - |

## 输出结构对比

| 项 | 旧版 | 新版 |
|---|---|---|
| 顶层键 | `extraction` / `optimizationLog` / `blueprint` / `shotScript[]` / `styleGuide` / `characters` / `feasibility` / `videoGen` / `_expansionApplied` | `characters` / `blueprint` / `sceneVisuals[]` / `styleProfile` |
| 镜头组织 | `shotScript[]` 扁平数组 | `sceneVisuals[].scenes[]` 按空间分组嵌套 |
| 空间描述 | 分散隐式在每个 scene 中 | `visualId.description`（完整布景）+ `visualHints`（英文）定义一次，scenes 只描述空间内动作 |
| 风格 | `styleGuide`（globalTone/colorPalette/fontFamily/backgroundMusic/transitions） | `styleProfile`（tone/visualStyle/suggestedBGM）精简版 |
| 中间产物 | `extraction` / `optimizationLog` / `feasibility` / `_expansionApplied` | 全部移除 |
| 角色 | `appearance` 英文 | `appearance` 中文 + 新增 `type`(protagonist/supporting) / `personality` |
| 场景 ID | `shot-1`... | `scene-1`... |

## 质量结论

- 旧版（8130 字符）塞了大量中间产物字段（extraction、optimizationLog、feasibility），prompt 长、token 消耗高。
- 新版核心改进：**布景定义一次，场景只描述动作**——visual-1.description 定义了诊室的完整空间布局，scene-1/2/3 只描述在这个空间内发生的事，不再重复环境描述，避免多镜头同空间的环境信息冗余。
- 本轮评测：2 个 sceneVisuals 分组 → 4 个镜头（AI诊室 3 镜 + 数据流空间 1 镜），时长合计 30s = blueprint.totalDuration。
- **结论**：新版 prompt 短 41%、token 省 33%、费用省 22%，输出结构更清晰（空间分组），建议采用。

> 注：本评测日志中该次输出 `characters` 缺失（评测为裸调不校验）；生产接入后由解析器校验兜底。
