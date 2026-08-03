# Phase 1: LangGraph 流程骨架引入

> 状态：✅ 已完成（2026-07-19）
>
> 目标：将 LangGraph 作为流程骨架引入项目，所有业务逻辑从 `orchestrator.ts` 移入状态机节点，保持原有功能完全不变。

---

## 1. 背景

原有 `orchestrator.ts` 的 `executeTask()` 是一个单体函数，内部串联了脚本切分、TTS 合成、视频渲染三个阶段。虽然功能正常，但存在以下问题：

- **职责混杂**：三个不同关注点的逻辑耦合在一个函数中，难以单独测试和替换
- **扩展困难**：后续加入 AI 脚本生成、分镜匹配、条件路由等需求时，线性函数无法承载
- **不可观测**：中间状态不可见，调试需要打日志

LangGraph 的状态机模式正好解决以上问题：每个节点只做一件事，状态在节点间显式流转，后续可自然过渡到条件路由、人机协作、Agent 循环等高级模式。

---

## 2. 架构变更

### 2.1 原有架构

```
POST /api/tasks → [入队 text] → BullMQ → Worker → executeTask()
                                                      ├── generateScript
                                                      ├── synthesizeSpeech
                                                      └── renderVideo
```

### 2.2 新架构

```
POST /api/tasks → videoGraph.invoke()
                    ├── scriptNode  → generateScript()
                    ├── ttsNode     → synthesizeSpeech() + assignFrames()
                    └── queueNode   → BullMQ.add(script, audioPath)
                                          ↓
                                     BullMQ → Worker
                                                ├── [LangGraph模式] renderVideo()
                                                └── [旧模式兼容] executeTask()
```

### 2.3 关键决策

| 决策点 | 选择 | 理由 |
|---|---|---|
| 状态定义方式 | `Annotation.Root()` | LangGraph 官方推荐，类型安全，自动推导 State/Update 类型 |
| 节点数量 | 3 个（script / tts / queue） | 按原有三步拆，第一期不引入条件分支 |
| 拓扑结构 | 线性 (`__start__ → script → tts → queue → END`) | 第一期所有请求走相同路径，无需路由 |
| TTS 执行位置 | API 层（非 Worker） | TTS 仅 1–2 秒，同步等待可接受；执行完立即入队，前端即时得到 jobId |
| Worker 兼容策略 | 双模式（payload 检测） | `script + audioPath` 存在则直接渲染，否则走旧 `executeTask`，确保零中断迁移 |

---

## 3. 文件清单

### 3.1 新建

| 文件 | 说明 |
|---|---|
| `app/lib/agent/state.ts` | 使用 `Annotation.Root` 定义 6 个状态通道 |
| `app/lib/agent/nodes.ts` | 三个节点函数：`scriptNode` / `ttsNode` / `queueNode` |
| `app/lib/agent/graph.ts` | 编译 `StateGraph` 并导出 `videoGraph` |
| `docs/archive/parse1.md` | 本文件 |

### 3.2 修改

| 文件 | 变更内容 |
|---|---|
| `app/api/tasks/route.ts` | POST 从直接 `queue.add({ text })` 改为 `videoGraph.invoke({ userPrompt })` |
| `workers/video-worker.ts` | 新增 LangGraph 模式分支（检测 `script + audioPath`），保留旧模式兼容 |
| `lib/types.ts` | `TaskData` 新增可选字段 `script?: ScriptScene[]` 和 `audioPath?: string` |
| `lib/tasks.ts` | `jobToSummary` 兼容新 payload（优先读 script 文本） |
| `package.json` | 新增依赖 `@langchain/langgraph`、`@langchain/core` |

### 3.3 归档

| 文件 | 操作 |
|---|---|
| `lib/orchestrator.ts` → `lib/orchestrator.old.ts` | 重命名保留，Worker 兼容路径仍引用 |

---

## 4. 状态定义

```typescript
// app/lib/agent/state.ts
export const VideoGenState = Annotation.Root({
  userPrompt:      Annotation<string>,         // 输入文本
  scriptSegments:  Annotation<ScriptScene[]>,   // 字幕场景列表
  audioPath:       Annotation<string>,          // TTS 音频路径
  duration:        Annotation<number>,          // 音频时长(秒)
  jobId:           Annotation<string>,          // BullMQ job ID
  error:           Annotation<string>,          // 错误信息
});
```

所有通道采用 `LastValue` 策略（默认），符合线性流水线语义。

---

## 5. 验证结果

- **TypeScript**: `tsc --noEmit` — 0 errors
- **单元测试**: 3 files / 20 tests — all passed
- **向后兼容**: Worker 可同时处理新旧两种 payload 格式

---

## 6. 已知差异（与原始策划方案）

原始策划方案假设了一个略有不同的项目结构（`splitScript` 函数名、`render-video` 队列名等）。实际适配时做了以下调整：

- `splitScript` → `generateScript`（项目实际函数名）
- `render-video` 队列 → `video-generation`（复用现有队列，通过 payload 字段区分模式）
- `app/api/generate/route.ts` → `app/api/tasks/route.ts`（保留现有路由）
- 状态字段 `fullText` / `audioUrl` → 直接用 `ScriptScene[]` 和 `audioPath`（与 Remotion 渲染参数对齐）
- Worker 新增双模式分支（策划方案中认为无需改 Worker，但实际 Worker 原来承担全流程，必须适配）

---

## 7. 后续展望（Phase 2 预览）

- 引入 AI 脚本生成节点（替换规则切句）
- 为每个场景匹配画面/分镜（条件路由）
- 并行 TTS + 画面生成（`Send` API 的 map-reduce 模式）
- 增加人工审核中断点（`interrupt`）
- 接入 LangSmith / LangGraph Studio 可视化调试
