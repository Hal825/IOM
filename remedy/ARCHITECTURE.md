# OpenMontage — 项目架构与完成度总览

> 生成时间：2026-07-22 | 分支：main

---

## 一、系统全景图

```
┌────────────────────────────────────────────────────────────┐
│                      用户 / 前端                            │
│          POST /api/tasks  ← 文本 →  GET /api/tasks/:id     │
│                       GET /api/tasks/:id/download           │
└─────────────────────────┬──────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                   Next.js API Routes                        │
│         app/api/tasks/route.ts  (POST + GET 列表)           │
│         app/api/tasks/[id]/route.ts  (GET 单个)             │
│         app/api/tasks/[id]/download/route.ts (流式下载)      │
└─────────────────────────┬──────────────────────────────────┘
                          │ videoGraph.invoke()
┌─────────────────────────▼──────────────────────────────────┐
│              LangGraph 状态机 (app/lib/agent/)              │
│                                                             │
│   __start__                                                 │
│       │                                                     │
│   script_ai  ← DeepSeek LLM (回退: 规则切句)                │
│       │                                                     │
│   fanout ────────── Send ────────── Send                    │
│     │                               │                       │
│   ttsNode                    matchVisualNode                │
│   (Edge-TTS 语音合成)          (关键词→Unsplash/Pexels)      │
│     │                               │                       │
│     └─────── composeVideoNode ───────┘                      │
│                  │ (帧区间+画面 对齐)                        │
│              queueNode                                      │
│                  │ (BullMQ 入队)                             │
│                 END                                         │
└─────────────────────────┬──────────────────────────────────┘
                          │ BullMQ Queue (Redis)
┌─────────────────────────▼──────────────────────────────────┐
│              Worker 进程 (workers/video-worker.ts)          │
│                                                             │
│   renderVideo()                                             │
│     ├─ prepareVisuals()    图片下载 + AI 生图 + Base64      │
│     ├─ getBundle()         Remotion bundle (惰性缓存)       │
│     └─ renderMedia()       h264 MP4 输出                    │
│                                                             │
│   output → storage/output/<jobId>.mp4                       │
└────────────────────────────────────────────────────────────┘
```

---

## 二、模块清单（按目录）

### 2.1 `lib/prompts/` — 提示词集中管理 ✅ 已完成

| 文件 | 导出 | 用途 | 状态 |
|---|---|---|---|
| `script-generation.ts` | `SCRIPT_GENERATION_SYSTEM` | 脚本切句 LLM 提示词 | ✅ |
| `keyword-extraction.ts` | `KEYWORD_EXTRACTION_SYSTEM` | 单条关键词提取 | ✅ |
| | `BATCH_KEYWORD_EXTRACTION_SYSTEM` | 批量关键词提取（6 场景→1 次调用） | ✅ |
| `image-generation.ts` | `buildImageGenPrompt(sceneText)` | AI 图片生成提示词包装函数 | ✅ |

### 2.2 `lib/tools/` — 核心工具

| 文件 | 主要导出 | 功能 | 状态 |
|---|---|---|---|
| `script-generator.ts` | `generateScript()` | 规则切句（标点分割+合并短句） | ✅ 完成 |
| | `assignFrames()` | 按字符占比分配帧区间 | ✅ 完成 |
| `ai-script-generator.ts` | `generateScriptWithAI()` | DeepSeek LLM 脚本生成 + 指数退避重试(最多3次) + 回退规则 | ✅ 完成 |
| `tts.ts` | `synthesizeSpeech()` | Edge-TTS 语音合成 (mp3) + 音频时长读取 | ✅ 完成 |
| `keyword-extractor.ts` | `extractKeywords()` | 单条关键词提取（LLM + 规则回退） | ✅ 完成 |
| | `extractKeywordsWithDetail()` | 单条提取 + token 记录 | ✅ 完成 |
| | `batchExtractKeywords()` | **批量**关键词提取（N 场景→1 次 LLM） | ✅ 完成 |
| `image-matcher.ts` | `matchVisuals()` | 画面匹配（简单版，逐个提取） | ✅ 完成 |
| | `matchVisualsWithDetail()` | 画面匹配（详细版，**批量提取** + token 统计） | ✅ 完成 |
| `image-downloader.ts` | `prepareVisuals()` | 远程图片下载 + AI 生图 + **Base64 内联** | ✅ 完成 |
| `renderer.ts` | `renderVideo()` | Remotion bundle + renderMedia 渲染 | ✅ 完成 |
| | `getBundle()` | 惰性创建+缓存 Remotion bundle | ✅ 完成 |
| | `warmUp()` | Worker 启动预热 | ✅ 完成 |
| `script-generator.test.ts` | — | 规则切句单元测试 | ✅ 完成 |

### 2.3 `app/lib/agent/` — LangGraph 状态机

| 文件 | 导出 | 功能 | 状态 |
|---|---|---|---|
| `state.ts` | `VideoGenState` | 状态定义 + **mergeProcedureLogs reducer** (并行分支合并) | ✅ 完成 |
| `nodes.ts` | `scriptAiNode` | 节点1: AI 脚本生成 | ✅ 完成 |
| | `scriptNode` | 节点1b(保留): 纯规则切句 | ✅ 完成 |
| | `ttsNode` | 节点2: TTS + 帧区间回填 + **日志写入** | ✅ 完成 |
| | `matchVisualNode` | 节点3: 画面匹配 + **日志写入(tokUsage)** | ✅ 完成 |
| | `composeVideoNode` | 节点4: 同步点（帧区间对齐） + **日志写入** | ✅ 完成 |
| | `queueNode` | 节点5: BullMQ 入队 + **日志保存** | ✅ 完成 |
| `graph.ts` | `videoGraph` | 工作流编排 (fan-out Send API) | ✅ 完成 |

### 2.4 `lib/log/` — 可观测性

| 文件 | 导出 | 功能 | 状态 |
|---|---|---|---|
| `procedure.ts` | `ProcedureLog` (类型) | 全流程日志类型定义 | ✅ 完成 |
| | `createProcedureLog()` | 工厂函数 | ✅ 完成 |
| | `saveProcedureLog()` | 持久化到 `log/procedure/job-<id>/` | ✅ 完成 |
| | `findProcedureLog()` | 按 jobId 查找（直接路径，O(1)） | ✅ 完成 |
| | `sumTokenUsage()` | 合并多个阶段的 token | ✅ 完成 |
| | `calculateTotalTokenUsage()` | 汇总全流程 token | ✅ 完成 |
| | `cleanupOldLogs()` | 清理 7 天前日志 | ✅ 完成 |

### 2.5 `remotion/` — 视频组件

| 文件 | 导出 | 功能 | 状态 |
|---|---|---|---|
| `Root.tsx` | `RemotionRoot` | Composition 注册入口 | ✅ 完成 |
| `VideoComposition.tsx` | `VideoComposition` | 画面组件: 背景(Img/纯色) + 字幕 + 音频 + 水印 | ✅ 完成 |
| | `calculateVideoMetadata` | 动态计算视频时长 | ✅ 完成 |
| `Subtitles.tsx` | `Subtitles` | 动态字幕：底部居中 + 半透明背景 + 淡入淡出 | ✅ 完成 |

### 2.6 `app/api/` — HTTP 接口

| 路由 | 方法 | 功能 | 状态 |
|---|---|---|---|
| `/api/tasks` | `POST` | 创建任务 (text → LangGraph → BullMQ) | ✅ 完成 |
| `/api/tasks` | `GET` | 任务列表 (最近50条, 降序) | ✅ 完成 |
| `/api/tasks/[id]` | `GET` | 查询单个任务状态 | ✅ 完成 |
| `/api/tasks/[id]/download` | `GET` | 流式下载 MP4 (防路径穿越) | ✅ 完成 |

### 2.7 `workers/` — 后台进程

| 文件 | 功能 | 状态 |
|---|---|---|
| `video-worker.ts` | BullMQ Worker: 消费队列, 渲染视频, **完善日志** | ✅ 完成 |

### 2.8 `lib/` — 基础设施

| 文件 | 导出 | 功能 | 状态 |
|---|---|---|---|
| `queue.ts` | `getQueue()` | BullMQ 队列单例 (globalThis 防热重载泄漏) | ✅ 完成 |
| | `createRedisConnection()` | Worker 独立连接 | ✅ 完成 |
| | `getRedisConnection()` | API 共享连接 | ✅ 完成 |
| `tasks.ts` | `jobToSummary()` | BullMQ Job → 前端 TaskSummary | ✅ 完成 |
| | `STORAGE_DIR` | 产物根目录: `./storage` | ✅ 完成 |
| `types.ts` | 全部类型 | `TaskData`, `TaskResult`, `ScriptScene`, `VisualAsset`, `VideoCompositionProps`, 常量 | ✅ 完成 |

---

## 三、数据流

```
用户文本
  │
  ├─ [scriptAiNode] ──────────── DeepSeek LLM ────→ ScriptScene[]
  │   (ai-script-generator.ts)   失败 → 规则切句
  │
  ├─ [ttsNode] ∥ [matchVisualNode]  ← 并行 Send
  │     │              │
  │     │    Edge-TTS  │    batchExtractKeywords() → LLM(1次)
  │     │    → mp3     │    → Unsplash/Pexels/纯色
  │     │              │    → prepareVisuals() 下载+Base64
  │     ▼              ▼
  ├─ [composeVideoNode]  ← 同步点: 帧区间 + 画面 sceneIndex 对齐
  │
  ├─ [queueNode]  ← BullMQ.add()
  │     │
  │     ▼  saveProcedureLog → log/procedure/job-<id>/procedure.json
  │
  ├─ [Worker]  ← video-worker.ts
  │     │
  │     ├─ renderVideo()
  │     │   ├─ prepareVisuals()  下载图片 + Base64 内联
  │     │   ├─ getBundle()       惰性 Remotion bundle
  │     │   └─ renderMedia()     h264 MP4 → storage/output/<id>.mp4
  │     │
  │     └─ saveProcedureLog()  覆盖写入: render 阶段 + totalDurationMs
  │
  └─ GET /api/tasks/:id/download  ← 流式返回 MP4
```

---

## 四、完成度总表

| 模块 | 功能 | 状态 |
|---|---|---|
| **提示词管理** | 全部集中到 `lib/prompts/` | ✅ |
| **脚本生成** | AI(DeepSeek) + 规则回退 + 重试 | ✅ |
| **语音合成** | Edge-TTS (免费, mp3) | ✅ |
| **关键词提取** | 批量 LLM (N场景→1次) + 规则回退 | ✅ |
| **画面匹配** | Unsplash → Pexels → 纯色 三级降级 | ✅ |
| **图片下载** | 远程下载 + AI 生图 + Base64 内联 | ✅ |
| **帧区间分配** | 按字符占比 (TTS 回填) | ✅ |
| **LangGraph 编排** | fan-out 并行 + merge reducer | ✅ |
| **日志系统** | 固定目录 + 批量日志合并 + token 统计 + 自动清理 | ✅ |
| **BullMQ 队列** | API 入队 / Worker 消费 | ✅ |
| **Remotion 渲染** | bundle 缓存 + h264 MP4 输出 | ✅ |
| **HTTP API** | CRUD + 流式下载 | ✅ |
| **Worker 进程** | 独立进程, 预热, 优雅关闭 | ✅ |
| **单元测试** | 规则切句 (`script-generator.test.ts`) | ✅ |

---

## 五、已知问题

### 5.1 重复文件
| 文件 | 问题 | 建议 |
|---|---|---|
| `lib/orchestrator.ts` 与 `lib/orchestrator.old.ts` | 内容**完全相同**，Worker 引用 `.old.ts` | 删除 `orchestrator.ts`，或确认两者差异后清理 |

### 5.2 未被引用的代码
| 文件 | 导出 | 说明 |
|---|---|---|
| `app/lib/agent/nodes.ts` | `scriptNode` | 纯规则切句节点已导出但 `graph.ts` 未使用（保留作为显式回退选项） |
| `lib/tools/keyword-extractor.ts` | `extractKeywords`, `extractKeywordsWithDetail` | 单条提取函数保留用于兼容，`matchVisuals` 简单版仍在使用 `extractKeywords` |

---

## 六、Phase 2 里程碑完成度

对比 `remedy/parse2.md` 规划：

| 里程碑 | 状态 | 说明 |
|---|---|---|
| M1: AI 脚本 | ✅ 完成 | `ai-script-generator.ts` + `scriptAiNode` |
| M2: 画面匹配 | ✅ 完成 | `image-matcher.ts` + `image-downloader.ts` (Base64) + `matchVisualNode` |
| M3: 审核流程 | ❌ 未实现 | `interrupt()` 人工审核节点未接入 |
| M4: 并行编排 | ✅ 完成 | `graph.ts` Send API fan-out (tts ∥ match_visual) |

---

## 七、待办 / 待优化

| 优先级 | 模块 | 事项 | 说明 |
|---|---|---|---|
| P2 | 渲染 | audio Base64 内联 | 当前复制到 bundle public/，可进一步优化为内联 |
| P3 | 前端 | 进度轮询 + 视频预览 | 有基础 UI (`app/page.tsx`)，但无视频预览 |
| P3 | 测试 | 集成测试 / E2E | 仅规则切句有单测 (`script-generator.test.ts`) |
| P3 | 部署 | Docker Compose | 当前仅 Redis (`docker-compose.yml`)，App + Worker 需容器化 |
| P4 | 画面 | AI 生图支持更多模型 | 当前兼容 OpenAI 格式 API |
| P4 | 监控 | 日志上报 / 告警 | 仅本地 JSON 日志 (`log/procedure/`) |
| P4 | 代码清理 | 删除 `orchestrator.ts` 重复文件 | 或将 `.old.ts` 归档，保留一个 |

---

## 八、关键优化记录

| 日期 | 优化 | 文件 | 效果 |
|---|---|---|---|
| 2026-07-22 | 图片 Base64 内联 | `image-downloader.ts` | 消除 Remotion 文件路径依赖 |
| 2026-07-22 | 批量关键词 LLM | `keyword-extractor.ts`, `image-matcher.ts` | 6 场景: 6 次 → 1 次 HTTP |
| 2026-07-22 | 固定日志目录 | `procedure.ts` | `job-<id>/` 替代 `<timestamp>_job-<id>/` |
| 2026-07-22 | merge reducer | `state.ts` | 并行分支日志合并而非覆盖 |
| 2026-07-22 | 节点返回日志 | `nodes.ts` | tts/match/compose 补上 `_procedureLog` |
| 2026-07-22 | 提示词集中管理 | `lib/prompts/` | 3 个文件: 脚本/关键词/图片生成 |
