# OpenMontage

基于 TypeScript 的 AI 视频生成工具：输入文本 → LangGraph 状态机编排（调研 → 提案 → 脚本 → 素材 + TTS → 逐镜头视频 → FFmpeg 拼接）→ 下载 MP4。

## 技术栈

| 组件 | 选型 |
|---|---|
| 前端 + API | Next.js 16 (App Router) |
| 流程编排 | LangGraph (`@langchain/langgraph`) |
| 任务队列 | BullMQ + Redis (Docker) |
| AI 文本分析 | 兼容 OpenAI 接口的模型（DeepSeek 等） |
| AI 图片生成 | DashScope qwen-image-2.0 |
| AI 视频生成 | DashScope happyhorse-1.1-r2v |
| AI 语音合成 | DashScope qwen3-tts-flash |
| 对象存储 | 阿里云 OSS（角色/场景素材上传） |
| 视频拼接 | FFmpeg (fluent-ffmpeg) |
| 测试 | Vitest |

## 快速开始

前置要求：Node.js ≥ 20、Docker Desktop（用于 Redis）。

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

### 配置 AI 服务

编辑 `.env`，按需配置各节点的 API Key。未配置的节点会在运行时直接报错（零容错策略）：

```bash
# ── 调研节点（Research）── 文本分析与结构识别 ──
RESEARCH_API_KEY=your_api_key
RESEARCH_BASE_URL=https://api.deepseek.com/v1
RESEARCH_LLM_MODEL=deepseek-v4-flash

# ── 提案节点（Proposal）── 分镜脚本与风格指南 ──
PROPOSAL_API_KEY=your_api_key
PROPOSAL_BASE_URL=https://api.deepseek.com/v1
PROPOSAL_LLM_MODEL=deepseek-v4-flash

# ── 脚本生成节点（Script）── 逐镜头生产脚本 ──
SCRIPT_API_KEY=your_api_key
SCRIPT_BASE_URL=https://api.deepseek.com/v1
SCRIPT_LLM_MODEL=deepseek-v4-flash

# ── AI 素材生成（场景背景 + 角色四视图）──
AI_ASSET_API_KEY=your_dashscope_key
AI_ASSET_BASE_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
AI_ASSET_MODEL=qwen-image-2.0

# ── AI 视频生成 ──
AI_VIDEO_API_KEY=your_dashscope_key
AI_VIDEO_BASE_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis
AI_VIDEO_MODEL=happyhorse-1.1-r2v
# AI_VIDEO_CONCURRENCY=2          # 逐镜头视频生成并发窗口（默认 2）
# AI_VIDEO_STYLE_STRENGTH=0.85    # 与参考图风格相似度 0-1（默认 0.85）

# ── AI 语音合成（TTS）──
AI_TTS_API_KEY=your_dashscope_key
AI_TTS_BASE_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
AI_TTS_MODEL=qwen3-tts-flash
AI_TTS_VOICE=Cherry

# ── OSS 对象存储（角色/场景图上传，供视频 API 引用）──
OSS_REGION=oss-cn-shenzhen
OSS_BUCKET=openmontage
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
```

### 启动

开发时需要 **2 个进程**（一条命令搞定）：

```bash
npm run redis:up   # 启动 Redis 容器（首次需先启动 Docker Desktop）
npm run dev:all    # 同时启动 Next.js (web) 和任务 Worker
```

也可以分开在两个终端跑：`npm run dev`（前端 + API → http://localhost:3000）和 `npm run worker`（消费队列、执行视频生成管线）。

打开 http://localhost:3000，输入一段文本，点击"生成视频"，等待任务完成后下载 MP4。

## 常用命令

```bash
npm test              # 单元测试
npm run test:watch    # 监视模式
npm run redis:down    # 停止 Redis 容器
```

## 工作流

```
__start__
    │
research              ← LLM 文本分析：语义分段 + 风格识别 + 角色检测
    │
generate_proposal     ← LLM 分镜提案：角色设计 + 场景分组 + 风格指南
    │
script_generation     ← LLM 逐镜头脚本：四子脚本（含 appearCharId / sceneImageRef）
    │
fanout (Send)         ← 并行分派（带 jobId）
  ╱       ╲
asset_gen   tts       ← 并发：素材生成（本地库引用 + AI 生成）∥ 分段语音合成
  ╲       ╱
scene_json_assembler  ← 组装单镜头完整视频生成 JSON（素材公网 URL + 音频路径）
    │
shot_video_gen        ← 逐镜头真实视频生成（模型无关适配器，并发窗口 + ffprobe 校验）
    │
video_merge           ← FFmpeg 拼接逐镜头视频 + 合成音轨 → output/{jobId}.mp4
    │
   END
```

## 项目结构

```
├── app/                       # Next.js App Router（页面 + API）
│   ├── page.tsx               # 首页：任务提交 + 任务列表（轮询）
│   └── api/tasks/             # POST 创建任务、GET 任务列表/状态、下载 MP4
├── lib/
│   ├── types.ts               # 公共类型（TaskData / Proposal / VideoScript 等）
│   ├── queue.ts               # BullMQ 队列单例 + Redis 连接工厂
│   ├── tasks.ts               # Job → TaskSummary 序列化
│   ├── orchestrator.ts        # 核心编排器：调用 LangGraph 管线
│   ├── agent/                 # LangGraph 状态机
│   │   ├── state.ts           # 状态定义（Annotation.Root + 自定义 reducer）
│   │   ├── nodes.ts           # 7 个节点实现
│   │   └── graph.ts           # 工作流编译（含 Send API 并行分派）
│   ├── tools/                 # 工具模块
│   │   ├── research-generator.ts      # Research 节点实现
│   │   ├── proposal-generator.ts      # Proposal 节点实现
│   │   ├── script-generator.ts        # Script 节点实现
│   │   ├── asset-generator.ts         # 素材生成（本地库引用 + AI 生成，产出 AssetManifest）
│   │   ├── oss-uploader.ts            # OSS 上传（REST+HMAC，公网 URL）
│   │   ├── tts-generator.ts           # AI 语音合成
│   │   └── video-generation/          # 视频生成抽象层（统一请求 + Adapter 工厂 + happyhorse-r2v）
│   ├── store/                 # 存储层
│   │   └── asset-store.ts             # AssetStore：存储 / 库访问 / OSS 发布
│   ├── prompts/               # LLM 提示词模板
│   │   ├── research.ts                # 文本分析
│   │   ├── proposal.ts                # 分镜提案（scene 含 appearCharId）
│   │   ├── script-generation.ts       # 脚本生成
│   │   └── tts.ts                     # TTS SSML 构建
│   └── log/
│       └── procedure.ts               # TokenUsage 类型定义
├── workers/video-worker.ts    # BullMQ Worker 独立进程
├── storage/                   # 生成产物（library/ 素材库 + assets/ audio/ scenes/ scripts/ output/，已 gitignore）
└── docker-compose.yml         # Redis 容器
```

## 架构决策

- **零容错**：所有 AI 节点不进行自动重试，任何错误直接抛出使任务失败（`attempts: 1`）。保持简单，避免隐式成本。
- **视频模型抽象层**：不同视频模型 API 结构各异，统一收敛为 `VideoGenRequest` + `VideoModelAdapter` 接口 + `createVideoAdapter(model)` 工厂；当前仅实现 `happyhorse-1.1-r2v`，未知模型抛错。
- **脚本后处理**：research 提取的分辨率需求（如 480p）覆盖 storyboard `resolution`；首/末镜头转场强制为 `cut`（不自动 fade）。
- **视频生成 + 拼接**：`shot_video_gen` 逐镜头真实生成（并发窗口 + ffprobe 校验）→ `video_merge` FFmpeg 拼接。
- **单 Worker**：`concurrency: 1`，一次只处理一个任务。
- **无数据库**：任务状态直接存储在 BullMQ (Redis) 中，完成/失败记录各保留最近 100 条。
- **无用户系统**：任务全局可见，MVP 阶段不引入认证。

## 已知限制

- 所有 AI 节点依赖外部 API（DeepSeek + DashScope），网络问题或 API 配额耗尽会导致任务失败
- 视频引擎当前仅实现 `happyhorse-1.1-r2v`，且依赖 DashScope 账户可用额度
- 单 Worker 串行处理（`concurrency: 1`）
- 无用户系统，任务全局可见
- Windows 下 FFmpeg 需要额外配置 `FFMPEG_PATH` 环境变量
