# OpenMontage

基于 TypeScript 的网页版视频生成工具：输入文本 → LangGraph 状态机编排（调研 → 提案 → AI 脚本 → TTS + 画面匹配）→ BullMQ 入队 → Remotion 渲染 → 下载 MP4。

## 技术栈

| 组件 | 选型 |
|---|---|
| 前端 + API | Next.js 16 (App Router) |
| 流程编排 | LangGraph (`@langchain/langgraph`) |
| 任务队列 | BullMQ + Redis (Docker) |
| 视频渲染 | Remotion 4 (服务端渲染) |
| 语音合成 | msedge-tts (微软 Edge 免费在线 TTS，需联网) |
| AI 能力 | 兼容 OpenAI 接口的任意模型（DeepSeek / 火山引擎 / GLM 等） |
| 画面素材 | Unsplash + Pexels 双路故障转移 |
| 测试 | Vitest |

## 快速开始

前置要求：Node.js ≥ 20、Docker Desktop（用于 Redis）。

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

### 配置 AI（可选但推荐）

编辑 `.env`，填入任意兼容 OpenAI 接口的 API Key。不配置时各节点自动回退到规则引擎：

```bash
# AI 脚本生成
AI_SCRIPT_API_KEY=your_api_key
AI_SCRIPT_BASE_URL=https://api.deepseek.com/v1
AI_SCRIPT_MODEL=deepseek-v4-flash

# Research 节点（文本分析）
RESEARCH_API_KEY=your_api_key
RESEARCH_BASE_URL=https://api.deepseek.com/v1
RESEARCH_LLM_MODEL=deepseek-v4-flash

# Proposal 节点（分镜提案）
PROPOSAL_API_KEY=your_api_key
PROPOSAL_BASE_URL=https://api.deepseek.com/v1
PROPOSAL_LLM_MODEL=deepseek-v4-flash

# 画面匹配（Unsplash + Pexels 双路图库）
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PEXELS_API_KEY=your_pexels_api_key
```

### 启动

开发时需要 **2 个进程**（一条命令搞定）：

```bash
npm run redis:up   # 启动 Redis 容器（需先启动 Docker Desktop，只需运行一次）
npm run dev:all    # 同时启动 Next.js (web) 和任务 Worker
```

也可以分开在两个终端跑：`npm run dev`（前端 + API → http://localhost:3000）和 `npm run worker`（消费队列、执行渲染）。

> 说明：API 层通过 LangGraph 状态机执行调研、提案、脚本切分、TTS 语音合成和画面匹配（约 3–10 秒），然后将渲染任务入队。Worker 独立进程消费队列并执行 Remotion 渲染（分钟级 CPU 密集操作，不能放在 Next.js 进程里）。

> **首次运行提示**：Worker 首次渲染会自动下载 Chrome Headless Shell（约 200MB）和 FFmpeg 到 `node_modules`，需要几分钟，请耐心等待。

打开 http://localhost:3000，输入一段文本，点击"生成视频"，等待任务完成后下载 MP4。

## 常用命令

```bash
npm test                 # 单元测试
npm run remotion:studio  # Remotion Studio 预览视频组件
npm run redis:down       # 停止 Redis 容器
```

## 工作流

```
__start__
    │
research            ← LLM 文本分析：语义分段 + 风格识别（无 AI 时规则回退）
    │
generate_proposal   ← LLM 分镜提案：镜头脚本 + 风格指南 + 可行性评估
    │
script_ai           ← 从 Proposal 映射 ScriptScene[]，或回退 AI/规则切句
    │
fanout (Send)       ← 并行分派
  ╱       ╲
tts     match_visual  ← 并发执行（无依赖关系）
  ╲       ╱
compose_video       ← 同步点：帧区间 + 画面按 sceneIndex 对齐
    │
queue               ← BullMQ 入队
    │
Worker 消费队列      ← Remotion 渲染
    │
完成 → 下载 MP4
```

## 项目结构

```
├── app/                       # Next.js App Router（页面 + API）
│   ├── page.tsx               # 首页：任务提交 + 任务列表（轮询）
│   ├── api/tasks/             # POST/GET 任务、查状态、下载 MP4
│   └── lib/agent/             # API 层 LangGraph 入口
├── lib/
│   ├── types.ts               # 公共类型（ScriptScene / VisualAsset / Proposal 等）
│   ├── queue.ts               # BullMQ 队列单例
│   ├── tasks.ts               # 任务序列化辅助
│   ├── orchestrator.ts        # 旧编排器（Worker 兼容路径）
│   ├── agent/                 # LangGraph 状态机
│   │   ├── state.ts           # 状态定义（Annotation.Root + 自定义 reducer）
│   │   ├── nodes.ts           # 7 个节点：research / proposal / script_ai / tts / match_visual / compose_video / queue
│   │   └── graph.ts           # 工作流编译（含 Send API 并行分派）
│   ├── tools/                 # 工具模块
│   │   ├── script-generator.ts        # 规则切句 + 帧区间分配
│   │   ├── ai-script-generator.ts     # AI 脚本生成（OpenAI 兼容 API + 回退）
│   │   ├── tts.ts                     # Edge TTS 封装
│   │   ├── renderer.ts                # Remotion bundle/render 封装
│   │   ├── keyword-extractor.ts       # AI 关键词抽取
│   │   ├── image-matcher.ts           # Unsplash → Pexels → 纯色 三路匹配
│   │   ├── image-downloader.ts        # 图片下载
│   │   ├── research-generator.ts      # Research 节点实现
│   │   └── proposal-generator.ts      # Proposal 节点实现
│   ├── prompts/               # LLM 提示词模板
│   │   ├── research.ts                # 文本分析 prompt
│   │   ├── proposal.ts                # 分镜提案 prompt
│   │   ├── script-generation.ts       # 脚本生成 prompt
│   │   ├── keyword-extraction.ts      # 关键词抽取 prompt
│   │   └── image-generation.ts        # 图片生成 prompt
│   └── log/                   # 可观测性
│       └── procedure.ts               # 全流程日志（ProcedureLog）记录与持久化
├── workers/video-worker.ts    # BullMQ Worker 独立进程
├── remotion/                  # 视频组件
│   ├── index.ts               # Remotion 入口
│   ├── Root.tsx               # 根组件（注册 Composition）
│   ├── VideoComposition.tsx   # 画面：背景（图片/纯色）+ 字幕 + 音轨 + 水印
│   └── Subtitles.tsx          # 字幕动画组件
├── storage/                   # 生成产物（audio/ + output/，已 gitignore）
└── docker-compose.yml         # Redis 容器
```

## 进度与状态

任务状态直接存储在 BullMQ (Redis) 中，未引入额外数据库；完成/失败记录各保留最近 100 条。

| 阶段 | 进度 | 说明 |
|---|---|---|
| Phase 1: LangGraph 骨架 | ✅ | 状态机编排，脚本+TTS 移至 API 层，Worker 双模式兼容 |
| Phase 2: AI + 画面分镜 | ✅ | LLM 脚本生成、Unsplash/Pexels 画面自动匹配、TTS ∥ 画面并行 |
| Phase 3: 调研 + 提案 | 🔧 开发中 | Research → Proposal → Script 流水线、风格指南、分镜脚本 |
| Phase 4: 扩散模型画面生成 | 📋 规划中 | AI 图片生成替代图库匹配 |

## 已知限制

- TTS 依赖微软在线服务，断网时任务会失败
- 未配置 AI API Key 时各节点回退到规则引擎（效果有限）
- 未配置 Unsplash/Pexels Key 时画面匹配返回纯色背景
- 单 Worker 串行渲染（`concurrency: 1`）
- 无用户系统，任务全局可见

## 注意事项

- **Remotion License**：Remotion 对公司使用有许可要求（个人/小团队免费，详见 [remotion.dev/license](https://www.remotion.dev/license)）
- Redis 容器数据存于 docker volume `redis_data`，`npm run redis:down` 不会清除
