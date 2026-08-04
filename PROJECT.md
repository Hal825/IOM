# OpenMontage — 项目逻辑文档

## 一、项目概述

OpenMontage 是一个基于 **Next.js + TypeScript** 的网页版 AI 视频自动生成工具。用户输入文本后，系统通过 **LangGraph** 状态图编排多个 AI 节点，从文本分析到素材组装，产出每镜头的完整视频生成规格（`SceneVideoSpec[]`）。

### 技术栈

| 层 | 技术 |
|---|------|
| Web 框架 | Next.js (App Router) |
| 编排引擎 | `@langchain/langgraph` (StateGraph + Send API) |
| 任务队列 | BullMQ (Redis 后端) |
| LLM (调研/提案/脚本) | 兼容 OpenAI API 的 chat/completions（`RESEARCH_/PROPOSAL_/SCRIPT_*` 配置） |
| AI 图片（素材生成） | DashScope 图片 API（`AI_ASSET_*` 配置） |
| AI 语音 | DashScope qwen3-tts-flash（SSML） |
| 对象存储 | 阿里云 OSS（REST + HMAC-SHA1，公网 URL） |
| Worker 进程 | 独立 `workers/video-worker.ts` |
| 存储 | 本地文件系统（`storage/`）+ OSS（公网） |

---

## 二、全局架构

```
┌─────────────┐  POST /api/tasks   ┌──────────────────────┐
│   Frontend   │ ────────────────► │  Next.js API Route    │
│  (page.tsx)  │                   │  · 校验 text          │
└──────┬───────┘                   │  · 入队 BullMQ         │
       │  GET /api/tasks (轮询)     └──────────┬───────────┘
       │                                      │ job.data = { text }
       │                           ┌──────────┴───────────┐
       │                           │  Worker (独立进程)     │
       │                           │  executeTask()         │
       │                           │  → videoGraph.invoke() │
       │                           └──────────┬───────────┘
       │                                      │ mergedVideoUrl 写回 job
       │                           ┌──────────┴───────────┐
       ▼  GET /api/tasks/[id]/download │  本地存储 storage/ │
       (流式传输 MP4 / 307 重定向)      └──────────────────┘
```

**关键架构决策**：LangGraph 管线在 **Worker 进程**中运行（非 API 请求内）。API 只负责校验 + 入队，前端通过轮询拿状态。

### 核心流程

1. **用户提交文本** → `POST /api/tasks` 校验后入队 BullMQ
2. **Worker 消费任务** → `executeTask()` → `videoGraph.invoke({ userPrompt, jobId })`
3. **图并行执行**：`asset_gen` 和 `tts` 通过 `Send` 并行分发，`scene_json_assembler` 汇聚
4. **视频生成 + 拼接**：`shot_video_gen` 逐镜头真实调用视频生成 API（并发窗口）→ `video_merge` FFmpeg 拼接产出最终 MP4
5. **前端轮询** `GET /api/tasks` → 任务状态 + 下载链接
6. **下载**：远程 URL → 307 重定向；本地文件 → 流式传输

---

## 三、文件结构

```
openmontage/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首页壳：仅渲染 <Workbench />（服务端）
│   ├── layout.tsx / globals.css  # 根布局 + Tailwind v4 主题（浅色精修色板，见 docs/design.md）
│   ├── components/               # 前端组件（Workbench 组装五区域）
│   │   ├── workbench.tsx         # 顶层工作台：轮询任务 + 布局组装
│   │   ├── task-sidebar.tsx      # 侧栏：队列概况（含「＋新建任务」）+ 任务列表（琥珀底）
│   │   ├── task-item.tsx         # 侧栏任务行
│   │   ├── task-detail.tsx       # 内容区节点成果卡（视频三态 + 元信息 + 流水线）
│   │   ├── pipeline.tsx          # 流水线六阶段（诚实约束：三档进度整体着色）
│   │   ├── composer.tsx          # 底部输入区（textarea + 提交）
│   │   ├── new-task-page.tsx     # 初始/新建视图：EmptyHero 大输入（横跨内容区+输入区）
│   │   ├── video-player.tsx      # 内联视频播放器
│   │   ├── status-badge.tsx      # 任务状态芯片
│   │   ├── queue-indicator.tsx   # 队列状态仪表（空闲/渲染中/离线）
│   │   ├── status-bar.tsx        # 底部状态栏（队列状态 + 任务数/版本）
│   │   └── format.ts             # 前端纯函数（formatRelativeTime）
│   └── api/tasks/
│       ├── route.ts              # POST 创建(入队) / GET 列表
│       └── [id]/
│           ├── route.ts          # GET 单个任务状态 / DELETE 删除（记录+产物）
│           ├── pause/route.ts    # POST 暂停/恢复（逐任务）
│           └── download/route.ts # GET 流式下载 MP4
├── workers/
│   └── video-worker.ts           # BullMQ Worker（执行 LangGraph）
├── lib/
│   ├── types.ts                  # 全部公共类型（TaskData/Proposal/VideoScript/AssetManifest…）
│   ├── queue.ts                  # BullMQ 队列单例 + Redis 连接
│   ├── tasks.ts                  # jobToSummary + STORAGE_DIR + deleteTaskFiles
│   ├── pause.ts                  # 逐任务暂停/删除 Redis 标志 + pausePoint 暂停点
│   ├── orchestrator.ts           # executeTask()：图调用入口（前置暂停点）
│   ├── api.ts                    # 前端 API 客户端（listTasks / createTask）
│   ├── agent/
│   │   ├── graph.ts              # LangGraph 状态图（含 Send 并行分派）
│   │   ├── state.ts              # 状态通道定义 (Annotation.Root + 自定义 reducer)
│   │   └── nodes.ts              # 节点实现（8 接线）
│   ├── tools/
│   │   ├── research-generator.ts # 调研工具
│   │   ├── proposal-generator.ts # 提案工具
│   │   ├── script-generator.ts   # 四子脚本生成 + 结构校验 ★
│   │   ├── asset-generator.ts    # 素材生成（本地库引用 + AI 生成，产出 AssetManifest）
│   │   ├── oss-uploader.ts       # OSS 上传（REST+HMAC，公网 URL）
│   │   ├── tts-generator.ts      # 语音合成 (DashScope qwen3-tts-flash)
│   │   └── video-generation/     # 视频生成抽象层（统一请求 + Adapter 工厂 + happyhorse-r2v，预留）
│   ├── store/
│   │   └── asset-store.ts        # AssetStore：存储 / 库访问 / OSS 发布
│   ├── prompts/
│   │   ├── research.ts           # 调研 system prompt
│   │   ├── proposal.ts           # 提案 system prompt（scene 含 appearCharId）
│   │   ├── script-generation.ts  # 四子脚本 system prompt ★
│   │   └── tts.ts                # TTS SSML 构建 + 默认参数
│   └── log/
│       └── procedure.ts          # 阶段审计日志 + 费用计算
├── new_prompts/                  # 新 prompt 迭代区（评测用，落地后进 lib/prompts）
├── old_prompts/                  # 历史 prompt 归档
├── scripts/
│   ├── eval-research.ts / eval-proposal.ts / eval-script.ts  # 节点级 LLM 评测
│   ├── eval-proposal-solo.ts     # 提案单测评测
│   ├── verify-graph-full.ts      # 跑完整图（到最终拼接）的验证脚本
│   ├── test-video-gen.ts         # 精简测试：2 镜头/15s/480p 真实视频生成+拼接
│   ├── retry-jobs.ts             # BullMQ 一键查询/重试失败任务
│   ├── check-job-34.ts / fix-job-34.ts  # 任务 #34 排查 / 修复脚本
│   └── diag-visualhints.ts       # 视觉提示词诊断
├── storage/                      # 输出产物 (gitignored)
│   ├── library/                  # 素材库（本地已有资源，跨任务复用）
│   │   └── characters/<组>/      # 一组主角：四视图 + meta.json
│   ├── assets/<jobId>/           # 任务素材产物（AI 生成 + manifest.json）
│   ├── audio/<jobId>/            # TTS 音频
│   ├── scripts/<jobId>/          # 脚本文本快照 (scene-texts.json)
│   ├── scenes/<jobId>/           # 逐镜头视频（shot_video_gen 产物，含 scene-specs.json）
│   └── output/<jobId>.mp4        # 最终视频（video_merge 合并产物）
├── log/procedure/                # 流程审计日志 (gitignored)
├── docs/                         # 文档
│   ├── design.md                 # 前端设计系统规格（配色/字体/间距/动效/组件映射）
│   ├── layout-blueprint.html     # 前端布局蓝图（冻结，设计变更入口）
│   ├── bugs/README.md            # 历史 bug 记录（现象/根因/修复/经验）
│   ├── screenshots/              # 验证截图
│   └── archive/                  # 历史归档（ARCHITECTURE / parse1 / parse2）
├── .claude/
│   └── TECHNICAL-SPEC.md         # 给 Claude 的技术规范（操作手册：工作规则/重构/bug 流程/坑）
├── docker-compose.yml            # Redis 7 Alpine
└── .env / .env.example
```

---

## 四、LangGraph 状态图（核心编排引擎）

### 图拓扑

```
__start__
    │
research              ← 节点 1：文本分析 → researchReport
    │
generate_proposal     ← 节点 2：角色设计 + 场景分组 → proposal
    │
script_generation     ← 节点 3：逐镜头四子脚本 → videoScript
    │
fanout_assets_tts     ← 条件边：并行分发（带 jobId）
  ╱        ╲
asset_gen  tts        ← 节点 4/5：素材生成 ∥ 分段语音合成
  ╲        ╱
scene_json_assembler  ← 节点 6：组装 SceneVideoSpec[]（素材公网 URL + 音频路径）
    │
shot_video_gen        ← 节点 7：逐镜头真实视频生成（模型无关适配器，并发窗口 + ffprobe 校验）
    │
video_merge           ← 节点 8：FFmpeg 拼接逐镜头视频 + 合成音轨
    │
   END
```

### 状态通道（VideoGenState）

| 通道 | 类型 | 来源节点 | reducer |
|------|------|----------|---------|
| `userPrompt` | `string` | 输入 | LastValue |
| `style` | `string` | 输入 | LastValue |
| `researchReport` | `ResearchReport \| null` | research | LastValue |
| `proposal` | `Proposal \| null` | generate_proposal | LastValue |
| `videoScript` | `VideoScript \| null` | script_generation | LastValue |
| `assetManifest` | `AssetManifest \| null` | asset_gen | LastValue |
| `audioSegments` | `SceneAudioSegment[]` | tts | 自定义覆盖 |
| `sceneSpecs` | `SceneVideoSpec[]` | scene_json_assembler | 自定义覆盖 |
| `scriptTextSnapshot` | `string \| null` | script_generation | LastValue |
| `sceneVideos` | `SceneVideoResult[]` | shot_video_gen（status=done，ffprobe 实测时长） | 按 sceneId 合并 |
| `mergedVideoUrl` | `string \| null` | video_merge | LastValue |
| `mergeLog` | `string \| null` | video_merge | LastValue |
| `durationSec` | `number` | video_merge | LastValue |
| `jobId` | `string` | 输入 | LastValue |
| `error` | `string` | 异常时 | LastValue |

### Fanout 路由（Send API）

```typescript
function fanoutAssetsTts(state): Send[] {
  return [
    new Send('asset_gen', { proposal, videoScript, jobId }),
    new Send('tts',       { proposal, videoScript, jobId }),
  ];
}
```

`asset_gen` 与 `tts` 无相互依赖，并行执行；`scene_json_assembler` 等待两者完成。

---

## 五、节点详解

### 节点 1：Research（调研）

| 属性 | 值 |
|------|-----|
| 工具 | `analyzeContent()` |
| Prompt | `lib/prompts/research.ts` |
| LLM | `RESEARCH_LLM_MODEL` |

**输入**: `userPrompt`

**输出** (`ResearchReport`): `user_text` + `user_demand` + `content_readiness_assessment`

**日志**: 若返回 tokenUsage → `saveStageLog(jobId, 'research', …)` 写 procedure.json

**容错**: LLM 调用失败 → 3 次指数退避重试 → 仍失败则抛异常（零容错）

---

### 节点 2：Proposal（提案）

| 属性 | 值 |
|------|-----|
| 工具 | `generateProposal()` |
| Prompt | `lib/prompts/proposal.ts` |
| LLM | `PROPOSAL_LLM_MODEL` |

**输入**: `researchReport` + `userPrompt` + `style`

**输出** (`Proposal`):
```
characters[]  → characterId/name/type/appearance/personality/role
blueprint     → title/totalDuration/aspectRatio
sceneVisuals[]→ visualId + description + visualHints + scenes[]
                scenes[] 每项: sceneId / sceneDescription / appearCharId / duration
styleProfile  → tone / visualStyle / suggestedBGM
```

**容错**: 零容错（校验缺失字段直接抛错）

---

### 节点 3：Script Generation（脚本生成）★

| 属性 | 值 |
|------|-----|
| 工具 | `generateScript()` |
| Prompt | `lib/prompts/script-generation.ts` |
| LLM | `SCRIPT_LLM_MODEL` |
| 重试 | 最多 3 次，指数退避 |

**输入**: `proposal` + `researchReport` + `userPrompt`

**输出** (`VideoScript`)：四子脚本，`scenes[]` 长度一致、sceneId 顺序一致：
```
storyScript      剧情脚本（sceneDescription + characters[] + narrative）
storyboardScript 分镜脚本（appearCharId + resourceRefs.sceneImageRef + shot/构图/参数）
audioScript      音频脚本（dialogue + sfx + bgm）
pacingScript     节奏脚本（duration + transitionIn/Out + keyMoments）
```

**结构校验**：`parseAndValidateScript` 检查四子脚本长度一致、sceneId 一致、`appearCharId` 数组存在、各子脚本必填字段，不合法即重试。

**生成后处理**（`applyPostProcess`，确定性覆盖 LLM 输出）：
1. **分辨率需求传递**：research 提取的分辨率档位（如 `480p`）按 aspectRatio 覆盖 storyboard 各镜头 `resolution`（16:9→`854x480`，9:16→`480x854`，1:1→`480x480`）
2. **取消边界 fade**：首镜头 `transitionIn`、末镜头 `transitionOut` 强制为 `cut(0)`，避免自动淡入淡出

**快照**: 写 `storage/scripts/{jobId}/scene-texts.json`（按 sceneId 对齐的关键文本），并写回 `scriptTextSnapshot`。

---

### 节点 4：Asset Generation（素材生成）

| 属性 | 值 |
|------|-----|
| 工具 | `generateAssets()` |
| 来源接口 | 本地库引用 + AI 生成（DashScope 图片） |
| 产物 | `AssetManifest` → `storage/assets/{jobId}/manifest.json` |

**输入**: `proposal` + `videoScript`（storyboard 的 `appearCharId` + `resourceRefs.sceneImageRef`）

**输出** (`AssetManifest`):
```
characters → Record<charId, { source: library|ai, sourceRef?, views: {front,back,left,right} }>
scenes     → Record<ref, { source, image }>      （按 sceneImageRef 去重，共享一张背景）
sceneRefs  → Record<sceneId, ref>                （sceneId → ref 显式映射）
```

**流程**:
1. 角色素材：按唯一 charId 生成（不是每场景）——选角占位取最新库组，无库则 AI 生成四视图
2. 场景素材：按 `resourceRefs.sceneImageRef` 去重，每个 ref 只 AI 生成一次背景图
3. 写本地 `storage/assets/{jobId}/`（AI 产物）+ manifest.json（全部相对路径）
4. 公网 URL 由 `AssetStore.publish()` 在组装时按需生成

**失败策略**：单个角色/场景图生成失败 → 跳过该项（对应 `sceneImageUrl` 落 null），任务继续；正式的中性兜底重试机制后续完善。

---

### 节点 5：TTS（分段语音合成）

| 属性 | 值 |
|------|-----|
| 工具 | `synthesizeSpeech()`（DashScope qwen3-tts-flash） |
| SSML | `buildShotSSML()`（含停顿 + 情感语速映射） |
| 对齐 | FFmpeg `apad` 对齐到镜头时长；纯视觉镜头生成静音 |

**输入**: `videoScript.audioScript`（对齐 `pacingScript`）

**输出**: `audioSegments[]` = `{ sceneId, audioUrl, durationSec }`

**流程**:
1. 逐镜头取 dialogue，首句情感作语气，构建 SSML
2. 有台词 → TTS 合成；无台词 → FFmpeg 生成静音
3. 对齐时长 → `storage/audio/{jobId}/{sceneId}_aligned.mp3`

---

### 节点 6：Scene JSON Assembler（组装）

| 属性 | 值 |
|------|-----|
| 工具 | `AssetStore.publishManifest()` |

**输入**: `videoScript` + `assetManifest` + `audioSegments`

**输出**: `sceneSpecs: SceneVideoSpec[]`（每镜头一条完整视频生成 JSON）

**流程**:
1. `publishManifest(assetManifest)` → 全部素材发布为公网 URL（库素材查 meta 缓存，任务素材上传）
2. 按 `pacingScript` 顺序组装，`sceneRefs[sceneId]` 取场景图，`appearCharId` 取角色四视图

**`SceneVideoSpec` 结构**（`lib/types.ts`）:
```
sceneId / duration / engine / mode / resolution / fps
assets    → { sceneImageUrl, characterImageUrls[], audioFilePath }
story     → { sceneDescription, narrative, characters }
storyboard→ { shot, composition, lighting, visualElements, atmosphere, motionLevel, negativePrompt }
audio     → { dialogue, sfx, bgm }
pacing    → { transitionIn, transitionOut, keyMoments }
```

---

### 节点 7：Shot Video Gen（逐镜头真实视频生成）

| 属性 | 值 |
|------|-----|
| 工具 | `generateSceneVideo()`（模型无关抽象层 `lib/tools/video-generation/`） |
| 适配器 | `happyhorse-1.1-r2v`（DashScope 异步：创建→轮询→下载） |
| 并发 | `AI_VIDEO_CONCURRENCY`（默认 2）窗口内逐镜头并行 |
| 校验 | 每个镜头写出后 **ffprobe** 校验真实生成成功并取实际时长 |

**输入**: `sceneSpecs`（SceneVideoSpec[]，来自 assembler）

**输出** (`sceneVideos: SceneVideoResult[]`): 每镜头 `{ sceneId, videoUrl, durationSec, status: 'done' }`，产物落 `storage/scenes/{jobId}/{sceneId}.mp4`（另写 `scene-specs.json` 审计）

**关键点**:
1. 视频模型 API 结构各异 → 抽象层收敛统一请求 `VideoGenRequest`，`createVideoAdapter(model)` 按模型名分派；当前仅实现 `happyhorse-1.1-r2v`，未知模型零容错抛错
2. 首帧硬依赖：`sceneImageUrl` 必须为公网 http(s) URL，缺失直接抛错
3. 时长钳制 [3,15]；`spec.resolution`（宽x高）经 `resolutionToTier` 映射为档位（854x480→480P）
4. 任一镜头失败 → 整体失败（零容错），失败后不再排新任务

---

### 节点 8：Video Merge（FFmpeg 拼接）

| 属性 | 值 |
|------|-----|
| 工具 | `videoMergeNode`（fluent-ffmpeg concat） |

**输入**: `videoScript.pacingScript`（镜头顺序）+ `sceneVideos` + `audioSegments`

**输出**: `mergedVideoUrl`（`storage/output/{jobId}.mp4`）+ `mergeLog` + `durationSec`

按 pacing 顺序排列逐镜头视频与音频，FFmpeg 分别 concat 视频流 + 音轨流，转码 h264/AAC（`complexFilter` 先设 output 再挂 filter，避免重复 -map）。

---

## 六、素材系统

### 素材库（本地已有资源）

```
storage/library/characters/{groupId}/
├── front.jpeg / back.jpeg / left.jpeg / right.jpeg   # 一组 = 一个角色
└── meta.json                                          # description/tags/applicable + remoteViews
```

当前已有 `char_userd_1_male`（男剑客）、`char_userd_1_female`（女法师）两对主角。

### 交付契约：AssetManifest

**asset_gen 向下只交付一份 `AssetManifest`，全部为相对路径**。两个来源接口（本地库 / AI 生成）产出同一结构，下游消费无感知差异。

### AssetStore（`lib/store/asset-store.ts`）

| 方法 | 作用 |
|------|------|
| `store(relPath, buffer)` | 写本地文件 |
| `resolve(relPath)` | 本地绝对路径（预览/本地消费） |
| `getCharacterGroup(groupId)` | 库角色「一组拿」：meta + 四视图 |
| `getLatestCharacterGroup()` | 选角占位：取最新库组 |
| `publish(relPath)` | 本地路径 → OSS 公网 URL；库素材回填 meta 缓存，跨任务复用 |
| `publishManifest(manifest)` | 整份 manifest 解析为公网 URL |

**OSS key 镜像相对路径**：`assets/34/scenes/scene_visual-1.png` → `openmontage/assets/34/scenes/scene_visual-1.png`；`library/...` key 跨任务稳定 → 首传后永久复用。

---

## 七、核心类型体系

### 数据流类型链

```
userPrompt (string)
    │
    ▼ [research]
ResearchReport
    │
    ▼ [generate_proposal]
Proposal
    │
    ▼ [script_generation]
VideoScript（四子脚本）
    │
    ├─► [asset_gen] → AssetManifest（Record<charId> + Record<ref> + sceneRefs）
    ├─► [tts]       → audioSegments[]
    │
    ▼ [scene_json_assembler]
SceneVideoSpec[]（每镜头完整视频生成规格，素材公网 URL + 音频路径）
```

### 关键类型

| 类型 | 用途 |
|------|------|
| `TaskData` / `TaskResult` / `TaskSummary` | BullMQ 任务数据 / 返回 / 摘要 |
| `ResearchReport` | 调研报告（需求提取 + 就绪度评估） |
| `Character` | 角色定义（appearance/personality/role） |
| `Proposal` | 角色 + 蓝图 + sceneVisuals（scenes 含 appearCharId） |
| `VideoScript` | 四子脚本（story/storyboard/audio/pacing） |
| `StoryboardScriptScene` | 分镜（appearCharId + resourceRefs.sceneImageRef + 视觉参数） |
| `CharacterAsset` / `SceneAsset` | 素材条目（source/sourceRef/views 或 image） |
| `AssetManifest` | 素材清单（交付契约） |
| `SceneVideoSpec` | 单镜头视频生成完整规格（assembler 输出） |

---

## 八、API 路由

### `POST /api/tasks` — 创建任务

```typescript
// 请求体: { text: string }（≤2000 字）
// 流程: 校验 → BullMQ 入队 → 返回 { id, status: 'waiting' }
// 响应: 201 { id, status: 'waiting' }；队列不可用 → 503
```

### `GET /api/tasks` — 任务列表

```typescript
// 查询最近 50 个任务（所有状态），按 createdAt 降序
// 响应: { tasks: TaskSummary[] }
```

### `GET /api/tasks/[id]` — 单个任务状态

```typescript
// 响应: TaskSummary | 404
```

### `GET /api/tasks/[id]/download` — 下载视频

```typescript
// 未完成 → 409；远程 URL → 307 重定向；本地文件 → 流式传输
// 路径校验: 确保不越出 STORAGE_DIR；文件缺失 → 410
```

---

## 九、BullMQ 队列系统

### 队列配置

```typescript
// lib/queue.ts
const QUEUE_NAME = 'video-generation';
// 连接: REDIS_HOST:REDIS_PORT（默认 localhost:6379）
```

### Worker 进程（`workers/video-worker.ts`）

- 消费 `video-generation` 队列，`concurrency: 1`
- 每任务调用 `executeTask(job, STORAGE_DIR)` → `videoGraph.invoke({ userPrompt, jobId })`
- 进度：开始 10% → 完成 100%
- 事件：`ready` / `completed` / `failed`（展开 LangGraph 多节点并行错误）/ `error`
- 优雅关闭：SIGINT/SIGTERM

### executeTask（`lib/orchestrator.ts`）

```typescript
const result = await videoGraph.invoke({ userPrompt: text, jobId });
return {
  videoPath: result.mergedVideoUrl（相对 storage 归一化）,
  durationSec: result.durationSec,
};
```

---

## 十、环境变量一览

### LLM（调研/提案/脚本）
| 变量 | 说明 |
|------|------|
| `RESEARCH_API_KEY` / `RESEARCH_BASE_URL` / `RESEARCH_LLM_MODEL` | 调研 LLM |
| `PROPOSAL_API_KEY` / `PROPOSAL_BASE_URL` / `PROPOSAL_LLM_MODEL` | 提案 LLM |
| `PROPOSAL_DEFAULT_DURATION_PER_SCENE` / `PROPOSAL_MAX_SCENES` | 提案默认参数 |
| `SCRIPT_API_KEY` / `SCRIPT_BASE_URL` / `SCRIPT_LLM_MODEL` | 脚本 LLM ★ |

### AI 服务（DashScope）
| 变量 | 说明 |
|------|------|
| `AI_ASSET_API_KEY` / `AI_ASSET_BASE_URL` / `AI_ASSET_MODEL` | 图片生成（素材） |
| `AI_VIDEO_API_KEY` / `AI_VIDEO_BASE_URL` / `AI_VIDEO_MODEL` | 视频生成（happyhorse-r2v 适配器，预留，当前节点不调用） |
| `AI_VIDEO_RESOLUTION` / `AI_VIDEO_CONCURRENCY` / `AI_VIDEO_STYLE_STRENGTH` | 视频分辨率档位 / 并发窗口（默认 2）/ 风格强度（默认 0.85），预留 |
| `AI_TTS_API_KEY` / `AI_TTS_BASE_URL` / `AI_TTS_MODEL` / `AI_TTS_VOICE` / `AI_TTS_SPEED` | TTS |

### OSS（公网 URL，视频生成硬依赖）
| 变量 | 说明 |
|------|------|
| `OSS_REGION` / `OSS_BUCKET` / `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | 阿里云 OSS |

### 基础设施
| 变量 | 说明 |
|------|------|
| `REDIS_HOST` / `REDIS_PORT` | Redis 地址 |
| `FFMPEG_PATH` | ffmpeg 可执行路径（可选，缺省用系统 PATH） |

---

## 十一、日志与可观测性

### 阶段审计日志（`lib/log/procedure.ts`）

`saveStageLog(jobId, stageName, entry)` 追加写入 `log/procedure/job-<id>/procedure.json`：

```json
{
  "jobId": "…",
  "startedAt": "…",
  "stages": {
    "research": { "startedAt", "durationSec", "model", "retries",
                  "input", "output", "tokenUsage", "cost" }
  }
}
```

- `calculateCost(model, usage)` 按 DeepSeek 定价表计算输入/输出费用
- 当前 research 节点已接入；其余节点后续扩展

### 存储路径

```
log/procedure/job-<jobId>/procedure.json
```

---

## 十二、关键设计决策

1. **节点独立可替换**：每个节点只依赖 state 中的上游字段，与具体节点实现解耦。

2. **Send API 并行**：`asset_gen` 和 `tts` 无相互依赖，通过 `Send` 并行分发（带 `jobId`），减少总耗时。

3. **零容错**：所有 AI 节点不静默降级，任何异常直接抛出使任务失败。LLM 工具内部最多 3 次指数退避重试，重试仍失败则抛错。

4. **manifest 只存相对路径**：`AssetManifest` 是 source of truth；公网 URL 是派生物，由 `AssetStore.publish()` 按需生成。消费方不关心「本地还是远端」。

5. **素材两来源接口，单一交付契约**：本地库引用 + AI 生成产出同一 `AssetManifest` 结构，下游无感知差异；`source` 字段留给未来选角匹配逻辑审计。

6. **库素材按引用不复制**：任务不复制库文件，`library/...` 的 OSS key 跨任务稳定，公网 URL 回填组 meta 后永久复用。

7. **appearCharId 显式引用**：角色→图片映射由 `proposal/storyboard.scenes[].appearCharId` 明文给出，取代旧的 `_default` 后缀字符串约定；角色素材按唯一 charId 生成。

8. **Prompt 与代码分离**：prompt 集中在 `lib/prompts/`，新 prompt 在 `new_prompts/` 迭代评测后再落地。

9. **视频模型抽象层**：不同视频模型 API 结构各异，统一收敛为 `VideoGenRequest` + `VideoModelAdapter` 接口 + `createVideoAdapter(model)` 工厂；当前仅实现 `happyhorse-1.1-r2v`，未知模型零容错抛错。

10. **端到端到视频**：`scene_json_assembler → shot_video_gen（并发真实生成 + ffprobe 校验）→ video_merge（FFmpeg 拼接）→ END`，任务产出可下载 MP4。

---

## 十三、已知限制

1. **选角为占位逻辑**：`getLatestCharacterGroup()` 取最新库组，多个角色会映射到同一组；appearance ↔ meta 的匹配逻辑待专门设计。

2. **前端为单文件 SPA**：`app/page.tsx` 包含全部 UI 逻辑，未拆分组件。

3. **无认证系统**：任务全局可见，无用户隔离。

4. **视频引擎单一**：当前仅实现 `happyhorse-1.1-r2v` 适配器；`sceneVideos.durationSec` 为 ffprobe 实测时长。

---

## 十四、启动方式

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env  # 并填写各 API Key

# 3. 启动 Redis
docker compose up -d   # 或 redis-server

# 4. 启动 Next.js + Worker（并行）
npm run dev:all

# 或分别启动:
npm run dev                           # 终端 1: Web 服务
npm run worker                        # 终端 2: Worker

# 5. 运行测试
npm test
```
