# OpenMontage — 项目逻辑文档

## 一、项目概述

OpenMontage 是一个基于 **Next.js + TypeScript** 的网页版 AI 视频自动生成工具。用户输入文本后，系统通过 **LangGraph** 状态图编排 6 个 AI 节点，全自动完成从文本分析到最终视频输出的完整管线。

### 技术栈

| 层 | 技术 |
|---|------|
| Web 框架 | Next.js (App Router) |
| 编排引擎 | `@langchain/langgraph` (StateGraph + Send API) |
| 任务队列 | BullMQ (Redis 后端) |
| AI 图片 | DashScope qwen-image-2.0 |
| AI 视频 | DashScope happyhorse-1.1-i2v |
| AI 语音 | DashScope qwen3-tts-flash |
| LLM (调研/提案/脚本) | DeepSeek v4-pro (兼容 OpenAI API) |
| Worker 进程 | 独立 `workers/video-worker.ts` |
| 存储 | 本地文件系统 (`storage/`) |

---

## 二、全局架构

```
┌─────────────┐  POST /api/tasks   ┌──────────────────────────┐
│   Frontend   │ ────────────────► │  Next.js API Route        │
│  (page.tsx)  │                   │  videoGraph.invoke()      │
└──────┬───────┘                   │  (同步执行整个 LangGraph)   │
       │                           └──────────┬───────────────┘
       │  GET /api/tasks (3s 轮询)             │ videoUrl 写回
       │                           ┌──────────┴───────────────┐
       │                           │  BullMQ Queue             │
       │                           │  (video_gen 入队结果)      │
       │                           └──────────┬───────────────┘
       │                                      │
       │                           ┌──────────┴───────────────┐
       │                           │  Video Worker (独立进程)   │
       │                           │  · 有 videoUrl → 仅归档    │
       ▼                           │  · 无 videoUrl → 兜底执行  │
  GET /download              ┌──────────────┐
  (流式传输 MP4)               │  本地存储     │
                              │  storage/     │
                              └──────────────┘
```

**关键架构决策：LangGraph 管线在 API 请求中同步运行**（非 Worker）。Worker 负责日志归档和兜底模式。

### 核心流程

1. **用户提交文本** → `POST /api/tasks` 直接调用 `videoGraph.invoke()`
2. **6 个节点在 API 进程中同步执行** → 节点间通过 StateGraph state 传递数据
3. **video_gen 完成后入队 BullMQ** → 作为状态追踪，供前端轮询
4. **前端 3s 轮询** `GET /api/tasks` → 拿到进度 + 下载链接
5. **Worker 双模式**：已有 `videoUrl` 则仅归档日志；否则兜底执行完整管线

---

## 三、文件结构

```
openmontage/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 主页面（单文件 SPA，无 components/）
│   ├── layout.tsx                # 根布局（Geist 字体，zh-CN）
│   ├── globals.css               # Tailwind v4 + CSS 自定义属性
│   ├── api/tasks/
│   │   ├── route.ts              # POST 创建 / GET 列表
│   │   └── [id]/
│   │       ├── route.ts          # GET 单个任务状态
│   │       └── download/
│   │           └── route.ts      # GET 流式下载 MP4
│   └── lib/agent/
│       └── nodes.ts              # 节点实现（较新：含 audioUrl 透传）
├── lib/                          # 核心库
│   ├── agent/
│   │   ├── graph.ts              # LangGraph 状态图定义
│   │   ├── state.ts              # 状态通道定义 (Annotation.Root)
│   │   └── nodes.ts              # 节点实现（被 graph.ts 引用）
│   ├── tools/
│   │   ├── research-generator.ts # 调研工具 (DeepSeek LLM)
│   │   ├── proposal-generator.ts # 提案工具 (DeepSeek LLM)
│   │   ├── script-generator.ts   # 脚本生成工具 (DeepSeek LLM) ★
│   │   ├── asset-generator.ts    # 素材生成 (DashScope 图片)
│   │   ├── tts-generator.ts      # 语音合成 (DashScope TTS)
│   │   └── video-generator.ts    # 视频生成 (DashScope 视频)
│   ├── prompts/
│   │   ├── research.ts           # 调研 system prompt
│   │   ├── proposal.ts           # 提案 system prompt
│   │   ├── script-generation.ts  # 脚本生成 system prompt ★
│   │   ├── asset-generation.ts   # 图片生成 prompt 构建器
│   │   ├── tts.ts                # TTS 文本构建器 + 默认参数
│   │   └── video-generation.ts   # 视频生成 system prompt
│   ├── log/
│   │   └── procedure.ts          # 全流程日志 (ProcedureLog)
│   ├── queue.ts                  # BullMQ 队列单例
│   ├── tasks.ts                  # jobToSummary 辅助 + STORAGE_DIR
│   ├── orchestrator.ts           # executeTask() 入口
│   ├── orchestrator.test.ts      # 编排器单元测试
│   ├── queue.test.ts             # 队列单元测试
│   └── types.ts                  # 全部公共类型
├── workers/
│   └── video-worker.ts           # BullMQ Worker (双模式)
├── docs/
│   ├── ARCHITECTURE.md           # 架构文档
│   ├── bugs/README.md            # 已知 bug 日志
│   ├── parse1.md, parse2.md      # 解析设计笔记
├── storage/                      # 输出产物 (gitignored)
│   ├── assets/<jobId>/           # 角色图 + 场景图
│   ├── audio/<jobId>/            # TTS 音频
│   └── output/<jobId>.mp4        # 最终视频
├── log/procedure/                # 流程日志 (gitignored)
│   └── job-<N>/procedure.json
├── docker-compose.yml            # Redis 7 Alpine
├── vitest.config.ts              # 测试配置
├── vitest.setup.ts
├── .env                          # 活跃配置
├── .env.example                  # 模板
├── package.json
└── tsconfig.json
```

---

## 四、LangGraph 状态图（核心编排引擎）

### 图拓扑

```
__start__
    │
    ▼
┌──────────┐
│ research │   ← 节点 1：文本内容分析与结构识别
│  调研    │     输入: userPrompt
└────┬─────┘     输出: researchReport
     │
     ▼
┌──────────────────┐
│ generate_proposal│ ← 节点 2：视频分镜方案 + 角色设计
│   提案           │     输入: researchReport + userPrompt
└────┬─────────────┘     输出: proposal
     │
     ▼
┌──────────────────┐
│ script_generation│ ← 节点 3：逐镜头生产脚本 ★NEW★
│   脚本生成       │     输入: proposal + researchReport
└────┬─────────────┘     输出: videoScript
     │
     ▼
┌──────────────────────┐
│     fanout (Send)    │ ← 条件边：并行分发
│    ┌──────┐ ┌─────┐ │
└────┤asset ├─┤ tts ├─┘
     │_gen  │ │     │
     └──┬───┘ └──┬──┘
        │        │        ← 节点 4a/4b：并行执行
        ▼        ▼           asset_gen: proposal → assetManifest
     ┌──────────────┐        tts: proposal → audioUrl
     │  video_gen   │    ← 节点 5：汇聚点
     │  视频生成    │      输入: proposal + videoScript + assetManifest + audioUrl
     └──────┬───────┘      输出: videoUrl + durationSec
            │
            ▼
           END
```

### 状态通道（VideoGenState）

所有通道使用 `LastValue` reducer 策略，`_procedureLog` 使用自定义 deep-merge reducer：

| 通道 | 类型 | 来源节点 |
|------|------|----------|
| `userPrompt` | `string` | 输入 |
| `style` | `string` | 输入 |
| `researchReport` | `ResearchReport \| null` | research |
| `proposal` | `Proposal \| null` | generate_proposal |
| `videoScript` | `VideoScript \| null` | script_generation ★ |
| `assetManifest` | `AssetManifest \| null` | asset_gen |
| `audioUrl` | `string` | tts |
| `audioDuration` | `number` | tts |
| `videoUrl` | `string` | video_gen |
| `durationSec` | `number` | video_gen |
| `videoGenStatus` | `string` | video_gen |
| `jobId` | `string` | 输入 / video_gen |
| `error` | `string` | 异常时 |
| `_procedureLog` | `unknown` (custom) | 所有节点累积 |

### Fanout 路由（Send API）

```typescript
function fanout(state): Send[] {
  return [
    new Send('asset_gen', { proposal, videoScript }),
    new Send('tts',       { proposal, videoScript }),
  ];
}
```

两个分支并行执行，互不依赖。汇聚点 `video_gen` 等待两者完成。

---

## 五、6 个节点详解

### 节点 1：Research（调研）

| 属性 | 值 |
|------|-----|
| 工具 | `analyzeContent()` |
| Prompt | `lib/prompts/research.ts` |
| LLM | `RESEARCH_LLM_MODEL` (DeepSeek v4-pro) |
| 超时 | 30s |
| 重试 | 3 次，指数退避 |

**输入**: `userPrompt`（用户原始文本）

**输出** (`ResearchReport`):
```
metadata         → topic, wordCount, language, contentType,
                   sceneTime[], sceneLocation[], userDemand
contentSkeleton  → segments[] (id/title/originalText/summary/keywords), flow
styleProfile     → tone, pace, visualStyle, suggestedBGM
characterAnalysis→ hasCharacter, characterHints[]
readiness        → overallScore, dimensions{info/logic/visual/emotion/completeness},
                   shortcomings[], expansionHints[], canProceedDirectly
```

**容错**: LLM 调用失败 → 3 次重试 → 规则兜底（`fallbackResearch`），基于标点分段 + 角色关键词检测

---

### 节点 2：Proposal（提案）

| 属性 | 值 |
|------|-----|
| 工具 | `generateProposal()` |
| Prompt | `lib/prompts/proposal.ts` |
| LLM | `PROPOSAL_LLM_MODEL` (DeepSeek v4-pro) |
| 超时 | 30s |
| 重试 | 3 次 |

**输入**: `researchReport` + `userPrompt` + `style`

**输出** (`Proposal`):
```
blueprint       → title, totalDuration, sceneCount, aspectRatio
extraction      → rawScenes[]        (步骤一中间结果)
optimizationLog → action log[]        (步骤二中间结果)
shotScript[]    → sceneId, duration, summary, layout, subtitleText,
                  transition{from/to}, cast[]
styleGuide      → globalTone, colorPalette[], fontFamily, backgroundMusic, transitions
feasibility     → riskLevel, estimatedRenderTime, suggestions[]
characters[]?   → characterId, name, appearance(EN), role, appearsInScenes[]
videoGen?       → style, duration
_expansionApplied → 补全记录 | null
```

**容错**: LLM 失败 → 规则兜底（基于 research segments 构建分镜）

---

### 节点 3：Script Generation（脚本生成）★NEW★

| 属性 | 值 |
|------|-----|
| 工具 | `generateScript()` |
| Prompt | `lib/prompts/script-generation.ts` |
| LLM | `SCRIPT_LLM_MODEL` (DeepSeek v4-pro) |
| 超时 | 60s |
| 重试 | 3 次 |

**输入**: `proposal` + `researchReport` + `userPrompt`

**输出** (`VideoScript`):
```
narrativeDesign → hook, emotionalArc[], pacingMap{tempo, accelerationAt[]}
sceneScripts[]  → 为每个 proposal shot 扩展：
  ├── sceneId, duration
  ├── resourceRefs { characterImageRef, sceneImageRef }
  ├── videoGenPrompt { motionDescription(EN), negativePrompt, styleStrength }
  ├── audio { narration?, dialogues[], soundEffects[], musicOverride? }
  ├── textOverlays[] { content, position, style, animation, timing }
  └── transition { transitionType, visualLink, fromPrevious, toNext }
```

**容错**: LLM 失败 → 基于 proposal.shotScript 生成最小脚本

---

### 节点 4a：Asset Generation（素材生成）

| 属性 | 值 |
|------|-----|
| 工具 | `generateAssets()` |
| API | DashScope qwen-image-2.0 |
| 超时 | 120s |

**输入**: `proposal.characters` + `proposal.shotScript`

**输出** (`AssetManifest`):
```
characters[] → 每个角色生成 4 视图 (front/back/left/right)
scenes[]     → 每个镜头生成场景背景图
```

**流程**:
1. 每个角色 → 1 次 API 调用 → 批量生成 4 张独立图片
2. 每个镜头 → 并行调用 → 生成场景背景（基于 `shot.summary`）
3. 下载到本地 `storage/assets/<jobId>/`
4. API 失败 → 纯色兜底

---

### 节点 4b：TTS（语音合成）

| 属性 | 值 |
|------|-----|
| 工具 | `synthesizeSpeech()` |
| API | DashScope qwen3-tts-flash |
| 音色 | `AI_TTS_VOICE` (默认 Cherry) |

**输入**: `proposal.shotScript`

**输出**: `audioUrl`（本地路径）+ `audioDuration`

**流程**:
1. 将 `shotScript[].subtitleText` 串联为 TTS 文本
2. 调用 DashScope TTS API
3. 下载音频到 `storage/audio/<jobId>/`
4. API 失败 → 占位标记

---

### 节点 5：Video Generation（视频生成）

| 属性 | 值 |
|------|-----|
| 工具 | `generateVideo()` |
| API | DashScope happyhorse-1.1-i2v |
| 模式 | 异步（X-DashScope-Async: enable） |
| 超时 | 10 分钟轮询 |
| 轮询间隔 | 5s |

**输入**: `proposal` + `assetManifest` + `audioUrl`

**输出**: `videoUrl` + `durationSec` + `videoGenStatus`

**流程**:
1. 构建 video prompt（从 `shot.summary` + `subtitleText` + `cast` 组装）
2. POST 创建异步任务
3. 轮询任务状态 → SUCCEEDED → 获取 video_url
4. 下载到 `storage/output/<jobId>.mp4`
5. 入队 BullMQ（供前端轮询）
6. 持久化 `procedure.json` 日志

**容错**: API 未配置 / 任务失败 → 占位 JSON 文件

---

## 六、核心类型体系

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
    ▼ [script_generation]  ★NEW★
VideoScript
    │
    ├─► [asset_gen] → AssetManifest (CharacterAsset[] + SceneAsset[])
    ├─► [tts]       → audioUrl + audioDuration
    │
    ▼ [video_gen]
VideoUrl + durationSec → BullMQ Queue → 前端
```

### 辅助类型

| 类型 | 用途 |
|------|------|
| `Character` | 角色定义 (id/name/appearance/role/appearsInScenes) |
| `CharacterAsset` | 角色素材 (4 视图 + prompt) |
| `SceneAsset` | 场景素材 (背景图 + prompt) |
| `AssetManifest` | 素材清单 |
| `TaskData` | BullMQ 任务数据 |
| `TaskResult` | 任务返回结果 |
| `TaskStage` | 任务阶段枚举 |
| `TaskSummary` | 前端任务摘要 |
| `ProcedureLog` | 全流程日志 |
| `TokenUsage` | LLM token 统计 |
| `ProposalResult` | Proposal 工具返回 |
| `ResearchResult` | Research 工具返回 |
| `ScriptResult` | Script 工具返回 |
| `AssetGenResult` | Asset 工具返回 |
| `TtsResult` | TTS 工具返回 |
| `VideoGenResult` | Video 工具返回 |

---

## 七、API 路由

### `POST /api/tasks` — 创建任务 ★ 核心入口

```typescript
// 请求体: { text: string }
// 流程: videoGraph.invoke({ userPrompt: text }) — 同步执行整个 LangGraph 管线
// 响应: 201 { id, status: 'waiting' }
```
**注意**：整个 AI 管线在此 HTTP 请求内同步完成，非异步 Worker 模式。

### `GET /api/tasks` — 任务列表

```typescript
// 查询 BullMQ 中最近 50 个任务，按 createdAt 降序
// 响应: { tasks: TaskSummary[] }
```

### `GET /api/tasks/[id]` — 单个任务状态

```typescript
// 响应: TaskSummary | 404
```

### `GET /api/tasks/[id]/download` — 下载视频 ★

```typescript
// 远程 URL → 307 重定向
// 本地文件 → 流式传输 (Content-Type: video/mp4, Content-Disposition: attachment)
// 路径校验: 确保不越出 STORAGE_DIR
```

---

## 八、BullMQ 队列系统

### 队列配置

```typescript
// lib/queue.ts
const QUEUE_NAME = 'video-generation';
// 连接: localhost:6379 (Redis)
```

### Worker 进程 (`workers/video-worker.ts`)

**双模式行为**：

```typescript
// 模式 1（新）：LangGraph 已在 API 中执行完毕
//   job.data.videoUrl 已存在 → 仅归档日志、更新进度 → 返回结果

// 模式 2（旧/兜底）：无 videoUrl
//   调用 executeTask(job, STORAGE_DIR) → 在 Worker 中执行完整 LangGraph 管线
```

**配置**: `concurrency: 1`（串行处理）
**事件**: `ready` / `completed` / `failed` / `error` 均打印到 console
**启动时**: 调用 `cleanupOldLogs(7)` 清理 7 天前日志
**优雅关闭**: 处理 SIGINT/SIGTERM 信号

### 进度报告

| 阶段 | 进度 |
|------|------|
| 任务开始 | 10% |
| 视频生成完成 | 90% |
| 全流程完成 | 100% |

---

## 九、环境变量一览

### LLM (调研/提案/脚本)
| 变量 | 说明 | 当前值 |
|------|------|--------|
| `RESEARCH_API_KEY` | 调研 API Key | DeepSeek |
| `RESEARCH_BASE_URL` | 调研 API 地址 | `https://api.deepseek.com/v1` |
| `RESEARCH_LLM_MODEL` | 调研模型 | `deepseek-v4-pro` |
| `PROPOSAL_API_KEY` | 提案 API Key | DeepSeek |
| `PROPOSAL_BASE_URL` | 提案 API 地址 | `https://api.deepseek.com/v1` |
| `PROPOSAL_LLM_MODEL` | 提案模型 | `deepseek-v4-pro` |
| `PROPOSAL_DEFAULT_DURATION_PER_SCENE` | 默认单镜头时长 | `8` |
| `PROPOSAL_MAX_SCENES` | 最大镜头数 | `15` |
| `SCRIPT_API_KEY` | 脚本 API Key | DeepSeek ★ |
| `SCRIPT_BASE_URL` | 脚本 API 地址 | `https://api.deepseek.com/v1` ★ |
| `SCRIPT_LLM_MODEL` | 脚本模型 | `deepseek-v4-pro` ★ |

### AI 服务 (DashScope)
| 变量 | 说明 | 当前值 |
|------|------|--------|
| `AI_ASSET_API_KEY` | 图片生成 Key | DashScope |
| `AI_ASSET_BASE_URL` | 图片生成地址 | qwen-image-2.0 |
| `AI_ASSET_MODEL` | 图片模型 | `qwen-image-2.0` |
| `AI_VIDEO_API_KEY` | 视频生成 Key | DashScope |
| `AI_VIDEO_BASE_URL` | 视频生成地址 | happyhorse-1.1-i2v |
| `AI_VIDEO_MODEL` | 视频模型 | `happyhorse-1.1-i2v` |
| `AI_VIDEO_RESOLUTION` | 视频分辨率 | `720P` |
| `AI_TTS_API_KEY` | TTS Key | DashScope |
| `AI_TTS_BASE_URL` | TTS 地址 | qwen3-tts-flash |
| `AI_TTS_MODEL` | TTS 模型 | `qwen3-tts-flash` |
| `AI_TTS_VOICE` | TTS 音色 | `Cherry` |
| `AI_TTS_SPEED` | TTS 语速 | `1.0` |

### 基础设施
| 变量 | 说明 | 默认值 |
|------|------|--------|
| `REDIS_HOST` | Redis 地址 | `localhost` |
| `REDIS_PORT` | Redis 端口 | `6379` |

---

## 十、工具设计模式

所有 6 个工具遵循统一的四层架构：

```
┌──────────────────────────────────────────────────┐
│  1. 公开 API (export async function)              │
│     · 检查 API Key → 未配置则直接走规则兜底        │
│     · 调用 withRetry(callLLM + parseAndValidate)  │
│     · 成功 → 返回 typed result                    │
│     · 失败 → fallback + 标记 model: "fallback(…)" │
├──────────────────────────────────────────────────┤
│  2. LLM 调用 (callXxxLLM)                        │
│     · 拼接 context JSON + 发送 chat/completions   │
│     · Bearer Token 鉴权                           │
│     · 返回 { content, usage }                     │
├──────────────────────────────────────────────────┤
│  3. 结构校验 (parseAndValidate)                    │
│     · 正则提取 JSON 对象                          │
│     · 递归校验每个字段的存在性 + 类型              │
│     · 兼容旧格式（可选字段默认值）                  │
├──────────────────────────────────────────────────┤
│  4. 规则兜底 (fallback)                           │
│     · 纯本地处理，不调网络                        │
│     · 基于上游数据构建最小可用结果                │
│     · 保证管线不中断                              │
└──────────────────────────────────────────────────┘
```

### 重试策略

```
最大重试: 3 次
退避公式: delay = 2^attempt * 1000 ms
即: 1s → 2s → 4s
```

---

## 十一、日志与可观测性

### ProcedureLog 结构

```typescript
{
  jobId, timestamp, totalDurationMs, totalTokenUsage?,
  stages: {
    research:   { input, output, durationMs, error? }
    proposal:   { input, output, durationMs, error? }
    script_gen: { input, output, durationMs, error? }  ★
    asset_gen:  { input, output, durationMs, error? }
    tts:        { input, output, durationMs, error? }
    video_gen:  { input, output, durationMs, error? }
    queue:      { input, output, durationMs, error? }
  },
  finalStatus, globalError?
}
```

### 存储路径

```
log/procedure/job-<jobId>/procedure.json
```

### 日志清理

- 自动清理 7 天前的日志目录
- 在应用启动时调用 `cleanupOldLogs()`
- 超长字段自动截断（2000 字符）

---

## 十二、关键设计决策

1. **节点独立可替换**: 每个节点只依赖 state 中的上游字段，与具体节点实现解耦。例如 `video_gen` 只检查 `state.proposal !== null`，不关心 proposal 是如何生成的。

2. **Send API 并行**: `asset_gen` 和 `tts` 无相互依赖，通过 `Send` 同时分发，减少总耗时。

3. **LLM + 规则双轨容错**: 每个 LLM 调用都有本地规则兜底，确保在 API 故障或配额耗尽时管线不中断。

4. **Prompt 与代码分离**: 所有 prompt 模板集中在 `lib/prompts/`，修改 prompt 不需要动工具代码。

5. **deep-merge reducer**: `_procedureLog` 的自定义 reducer 确保每个节点只写入自己的 stage，不会互相覆盖。

6. **异步视频 + 轮询**: DashScope 视频生成是异步的，`video_gen` 内部实现 task 创建 → 轮询 → 下载的三步流程。

7. **proposal → script_generation 分层**: Proposal 负责"拍什么"（结构），Script 负责"怎么拍"（细节），职责清晰，后续可独立优化。

---

## 十三、已知问题

### 1. `lib/agent/nodes.ts` 与 `app/lib/agent/nodes.ts` 不一致

两个文件共存，均含 6 个节点的完整实现，但存在差异：

| 差异点 | `lib/agent/nodes.ts` | `app/lib/agent/nodes.ts` |
|--------|---------------------|--------------------------|
| 被谁引用 | `graph.ts` (`./nodes`) | 无直接引用 |
| `videoGenNode` 调 `generateVideo` | **3 参数**（无 audioUrl） | **4 参数**（含 audioUrl） |
| 日志获取方式 | 统一 `ensureLog()` | `if (log)` null 检查 |

**影响**: 当前编译结果中 `video_gen` 节点不会将 TTS 音频传递给视频生成 API。

**建议**: 统一为 `app/lib/agent/nodes.ts` 的较新版本，或改为从 state 中读取 `videoScript` 而非依赖两个不一致的文件。

### 2. 前端为单文件 SPA

`app/page.tsx` 是一个 200+ 行的客户端组件，包含所有 UI 逻辑（输入框、提交、轮询、状态展示、下载），未拆分为独立组件。

### 3. 无认证系统

所有任务全局可见，无用户隔离。任务 ID 可被猜测。

---

## 十四、启动方式

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env  # 并填写 API Key

# 3. 启动 Redis
docker compose up -d   # 或 redis-server

# 4. 启动 Next.js 开发服务器 + Worker（并行）
npm run dev:all

# 或分别启动:
npm run dev                           # 终端 1: Web 服务
npx tsx workers/video-worker.ts       # 终端 2: Worker

# 5. 运行测试
npm test
```
