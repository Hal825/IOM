# OpenMontage-Web (TS 版 MVP)

基于 TypeScript 的网页版视频生成工具：输入文本 → LangGraph 状态机编排（脚本 + TTS）→ BullMQ 入队 → Remotion 渲染 → 下载 MP4。

## 技术栈

| 组件 | 选型 |
|---|---|
| 前端 + API | Next.js 16 (App Router) |
| 流程编排 | LangGraph (`@langchain/langgraph`) |
| 任务队列 | BullMQ + Redis (Docker) |
| 视频渲染 | Remotion 4 (服务端渲染) |
| 语音合成 | msedge-tts (微软 Edge 免费在线 TTS，需联网) |
| 测试 | Vitest |

## 快速开始

前置要求：Node.js ≥ 20、Docker Desktop（用于 Redis）。

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

开发时需要 **2 个进程**（一条命令搞定）：

```bash
npm run redis:up   # 启动 Redis 容器（需先启动 Docker Desktop，只需运行一次）
npm run dev:all    # 同时启动 Next.js (web) 和任务 Worker
```

也可以分开在两个终端跑：`npm run dev`（前端 + API → http://localhost:3000）和 `npm run worker`（消费队列、执行渲染）。

> 说明：API 层通过 LangGraph 状态机执行脚本切分和 TTS 语音合成（约 1–2 秒），然后将渲染任务入队。Worker 独立进程消费队列并执行 Remotion 渲染（分钟级 CPU 密集操作，不能放在 Next.js 进程里）。

> **首次运行提示**：Worker 首次渲染会自动下载 Chrome Headless Shell（约 200MB）和 FFmpeg 到 `node_modules`，需要几分钟，请耐心等待。

打开 http://localhost:3000，输入一段文本（如"你好世界。这是一个测试视频。"），点击"生成视频"，等待任务完成后下载 MP4。

## 常用命令

```bash
npm test                 # 单元测试
npm run remotion:studio  # Remotion Studio 预览视频组件
npm run redis:down       # 停止 Redis 容器
```

## 项目结构

```
├── app/                  # Next.js App Router（页面 + API）
│   ├── page.tsx          # 首页：任务提交 + 任务列表（轮询）
│   ├── api/tasks/        # POST/GET 任务、查状态、下载 MP4
│   └── lib/agent/        # LangGraph 状态机
│       ├── state.ts      # 状态定义（Annotation.Root）
│       ├── nodes.ts      # 节点：script / tts / queue
│       └── graph.ts      # 工作流编译 + 导出
├── lib/
│   ├── types.ts          # 公共类型
│   ├── queue.ts          # BullMQ 队列单例
│   ├── tasks.ts          # 任务序列化辅助
│   ├── orchestrator.old.ts  # 【归档】旧编排器，Worker 兼容路径引用
│   └── tools/            # 工具模块
│       ├── script-generator.ts  # 文本切分为字幕场景
│       ├── tts.ts               # Edge TTS 封装
│       └── renderer.ts          # Remotion bundle/render 封装
├── workers/video-worker.ts  # BullMQ Worker 独立进程（双模式：LangGraph 直渲 + 旧流水线兼容）
├── remotion/             # 视频组件（字幕 + 音轨 + 动画）
├── storage/              # 生成产物（audio/ + output/，已 gitignore）
├── remedy/               # 项目规划文档
│   ├── parse1.md         # Phase 1: LangGraph 流程骨架（✅ 已完成）
│   └── parse2.md         # Phase 2: AI 脚本 + 画面分镜（📋 规划中）
└── docker-compose.yml    # Redis 容器
```

## 任务流程与进度

```
POST /api/tasks
  │
  └─→ LangGraph 状态机（API 层，~1-2s）
        ├── scriptNode   → 规则切句（generateScript）
        ├── ttsNode      → Edge TTS 合成 + 帧区间回填（assignFrames）
        └── queueNode    → BullMQ 入队（payload: script + audioPath）
                              │
Worker 消费队列                 │
  ├── [LangGraph 模式] 直接渲染（script + audioPath 已就绪）
  └── [旧模式兼容] 完整流水线 executeTask()
                              │
  10%  脚本已就绪（API 层完成）
  50%~95%  Remotion 渲染（字幕按文字长度占比分配帧区间）
  100% 完成(completed) → 可下载
```

任务状态直接存储在 BullMQ (Redis) 中，未引入额外数据库；完成/失败记录各保留最近 100 条。

### 架构演进

| 阶段 | 状态 | 说明 |
|---|---|---|
| Phase 1: LangGraph 骨架 | ✅ 已完成 | 引入状态机编排，脚本+TTS 移至 API 层，Worker 双模式兼容 |
| Phase 2: AI + 画面分镜 | 📋 规划中 | LLM 脚本生成、画面自动匹配、人工审核中断、并行编排 |

详见 [`remedy/`](./remedy/) 目录。

## 已知限制（MVP）

- TTS 依赖微软在线服务，断网时任务会失败
- 脚本生成为规则切句，未接入 AI（Phase 2 计划）
- 视频画面仅为纯色背景 + 字幕，未做画面匹配（Phase 2 计划）
- 单 Worker 串行渲染（`concurrency: 1`）
- 无用户系统，任务全局可见

## 注意事项

- **Remotion License**：Remotion 对公司使用有许可要求（个人/小团队免费，详见 [remotion.dev/license](https://www.remotion.dev/license)）
- Redis 容器数据存于 docker volume `redis_data`，`npm run redis:down` 不会清除
