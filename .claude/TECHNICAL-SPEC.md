# OpenMontage · 技术规范（给 Claude 的操作手册）

> 定位：**协作精简版** —— 讲「怎么在这套代码里干活、什么不能动、出问题怎么查」。
> 架构细节（图拓扑 / 节点 / 类型 / API / env）读 `PROJECT.md`，本文件不重复。
> 前端设计读 `docs/design.md` 与 `docs/layout-blueprint.html`。

---

## 0. 文档地图

| 文件 | 负责什么 | 何时读 |
|------|----------|--------|
| `CLAUDE.md` | 入口（本文件 + AGENTS.md + 英文教练规则） | 每次会话自动加载 |
| `AGENTS.md` | Next.js 断裂变更警告 | 写任何 Next.js 代码前 |
| `PROJECT.md` | 系统架构全貌：LangGraph 图 / 八节点 / 类型链 / API / env / 设计决策 | 理解或改动后端架构时 |
| `docs/design.md` | 前端设计系统规格（配色/字体/间距/动效/组件映射） | 改前端时 |
| `docs/layout-blueprint.html` | 前端布局蓝图（已冻结，用户在此标注设计变更） | 改前端布局/设计时 |
| `docs/bugs/README.md` | 历史 bug 记录（现象/根因/修复/经验总结） | 排查后端节点问题前先翻一遍 |
| `docs/archive/` | 历史阶段文档（ARCHITECTURE / parse1 / parse2，已归档） | 参考历史规划时 |
| 全局 memory | 会话状态（`C:\Users\34395\.claude\projects\D--Code-VScode-openmontage\memory\`） | 跨会话的项目进度/决策 |

---

## 1. 工作总则（Operating Rules）

**验证（必须遵守）**
- 类型检查：`npx tsc --noEmit`
- 单测：`npx vitest run`
- **验证期间禁止调用付费 API**（视频/素材/LLM 生成）。只跑纯函数单测 + tsc。真实管线验证（`verify-graph-full` / `test-video-gen`）只在用户明确要求时运行。

**文档同步铁律（必须遵守）**
- 任何文件 **增 / 改 / 删 / 移** 操作完成后，都必须同步更新 `PROJECT.md`（尤其 §三 文件结构），保证文档与真实目录一致。
- 涉及前端设计 → 同步 `docs/design.md` 与蓝图；涉及本规范 → 检查 `.claude/TECHNICAL-SPEC.md` 的文档地图与引用。

**写 Next.js 代码前**
- 先读 `AGENTS.md`，再读 `node_modules/next/dist/docs/` 中相关指南。本项目的 Next.js 16.2.10 与训练数据有断裂变更（dev 用 Turbopack）。**沿用现有能工作的写法**是最安全的路径。

**改前端设计**
- 用户在 `docs/layout-blueprint.html` 里改/标注设计，用蓝图交流。不要凭空重构设计。配色/字体/间距规格见 `docs/design.md`。

**启动方式**
```bash
npm install
cp .env.example .env      # 填 API Key
npm run redis:up          # Docker 起 Redis（若本机已有 Redis 在 6379 则跳过）
npm run dev:all           # web + worker 并行
# 或分开: npm run dev（终端1）/ npm run worker（终端2）
npm test                  # vitest run
```

**测试**
- `app/components/task-detail.test.tsx`、`lib/*.test.ts`、`lib/tools/video-generation/*.test.ts` 等纯函数单测。

---

## 2. 架构不变量（绝不能破坏的规则）

提炼自 `PROJECT.md §十二`，重构时逐条对照：

1. **零容错**：所有 AI 节点不静默降级，异常直接抛出使任务失败。LLM 工具内部最多 3 次指数退避重试，重试仍失败则抛错。
2. **Worker 跑图，API 只入队**：LangGraph 在 `workers/video-worker.ts` 进程运行，`/api/tasks` 只校验 + 入队 + 查询。
3. **manifest 只存相对路径**：`AssetManifest` 是 source of truth；公网 URL 是派生物，由 `AssetStore.publish()` 按需生成。
4. **素材两来源单一契约**：本地库引用 + AI 生成产出同一 `AssetManifest` 结构，`source` 字段区分，下游无感知。
5. **库素材按引用不复制**：`library/...` 的 OSS key 跨任务稳定，公网 URL 回填组 meta 后永久复用。
6. **appearCharId 显式引用**：角色→图片映射由 `proposal/storyboard.scenes[].appearCharId` 明文给出，角色素材按唯一 charId 生成。
7. **Prompt 与代码分离**：prompt 在 `lib/prompts/`，新 prompt 在 `new_prompts/` 迭代评测后落地。
8. **视频模型走适配器**：统一 `VideoGenRequest` + `VideoModelAdapter` + `createVideoAdapter(model)` 工厂，未知模型零容错抛错。
9. **Send API 并行**：`asset_gen` 与 `tts` 无相互依赖，并行分发（带 jobId）。
10. **节点独立**：每个节点只依赖 state 中上游字段，与具体实现解耦。

---

## 3. 重构规范（Refactoring Checklist）

改动前先读对应架构文档，改动后逐条自检：

**通用**
- [ ] 沿用现有文件组织与命名（工具在 `lib/tools/`、prompt 在 `lib/prompts/`、前端组件在 `app/components/`）。
- [ ] 数据契约（`lib/types.ts`）一旦改动，**前后端 + Worker 全部同步**（三处共用同一类型文件）。
- [ ] 改完跑 `npx tsc --noEmit` + `npx vitest run`，全绿才交付。
- [ ] 纯函数逻辑（格式化/解析/工具函数）补/改单测，不调 API。

**后端节点重构**
- [ ] 节点只读它声明的上游 state 通道（`lib/agent/state.ts`），不越界取他人字段。
- [ ] 新增状态通道要在 `state.ts` 声明 reducer（LastValue 或自定义覆盖）。
- [ ] 模型/分辨率/并发等外部可变参数走 env，不硬编码。
- [ ] LLM 输出结构变化必须同步 `lib/types.ts` 与 `parseAndValidate*` 校验器。

**视频/素材**
- [ ] 新增视频模型 = 实现 `VideoModelAdapter`（模板：`lib/tools/video-generation/adapters/happyhorse-r2v.ts`）→ 注册进 `createVideoAdapter`。
- [ ] 任何镜头产物写出后保持 ffprobe 校验；`sceneImageUrl` 必须公网 http(s) URL。
- [ ] 不破坏 manifest 相对路径契约。

**前端重构**
- [ ] 主题 token 在 `app/globals.css` 的 `@theme inline` 里改（Tailwind v4），组件用语义类名（`bg-accent`/`text-muted` 等）。
- [ ] 布局高度：外层用固定高度（`md:h-dvh`），卡片填充用 `flex-1`；**不要**只给 `min-h-dvh` 或 `min-h-full`（见 §6 坑 3）。
- [ ] 不要用多行 JSX 块注释 `{/* ... */}` 写长说明（见 §6 坑 2）。
- [ ] 设计变更同步改 `docs/design.md` 与蓝图（单一事实来源）。

---

## 4. Bug 处理流程（Runbook）

按顺序排查，每步记录「已排除的假设」，避免重复定位。

**第 1 步：复现 + 收现场**
- 前端：跑 `npm run dev`，用浏览器 / 无头 Chrome 打开 `http://localhost:3000`。
- 后端管线：`scripts/eval-{proposal,research,script}.ts`（节点级）→ `scripts/verify-graph-full.ts`（完整图，调付费 API，仅授权时跑）→ `scripts/test-video-gen.ts`（精简真实视频）。
- 收集任务 id、报错原文、触发条件。

**第 2 步：查审计日志（优先）**
- 路径：`log/procedure/job-<jobId>/procedure.json`
- 内容：各阶段 `startedAt / durationSec / model / retries / input / output / tokenUsage / cost`。
- 判断：哪一阶段耗时异常？哪一阶段缺失？retries 是否触发？

**第 3 步：查任务状态与 Worker**
- 任务状态：BullMQ job state（`waiting / active / completed / failed / delayed / paused`）。可用前端 `/api/tasks` 或 Redis 直接查。
- Worker 日志：`npm run worker` 的 stdout（`ready/completed/failed` 事件，失败会展开 LangGraph 多节点并行错误）。
- 看失败原因：job.failedReason（前端 TaskSummary.failedReason 也能看到）。

**第 4 步：定位节点**
- 八节点链路：research → generate_proposal → script_generation → (asset_gen ∥ tts) → scene_json_assembler → shot_video_gen → video_merge。
- 按失败特征归类：
  - **LLM 输出结构错误** → 查对应 `lib/tools/*-generator.ts` 的结构校验器（如 `parseAndValidateScript`），再查 prompt 是否要求了错误结构。
  - **素材/图片问题** → 查 `asset-generator.ts`、`AssetStore`、OSS 上传（`oss-uploader.ts`）。
  - **视频生成失败** → 查 `lib/tools/video-generation/` 适配器、ffprobe 校验、`sceneImageUrl` 是否公网 URL。
  - **拼接失败** → 查 `video_merge`（fluent-ffmpeg，见 §6 坑 6）、音轨对齐。
  - **前端渲染问题** → 查 `docs/design.md` + 蓝图；用无头 Chrome 量几何定位（见 §6 坑 10）。

**第 5 步：修复 + 验证**
- 修复后：`npx tsc --noEmit` + `npx vitest run` 全绿；纯函数补单测。
- 需要真实管线验证时，向用户确认后再跑（会调付费 API）。
- 修完把根因写进 `docs/`（或 memory），避免复发。

**前端专属排查技巧**
- 布局/几何：无头 Chrome（`--remote-debugging-port`）+ Node CDP 量 `getBoundingClientRect`，确认哪层撑高/漏空。
- 静态结构：`--headless=new --dump-dom` 导渲染后 DOM 核对是否挂载。
- 截图：`--screenshot` 产出 PNG，注意 Windows 下 `/tmp` 路径要先拷进项目内再让用户打开。

---

## 5. 模型切换指南

**各节点 LLM（独立配置，互不影响）**

| 节点 | env |
|------|-----|
| 调研 research | `RESEARCH_API_KEY` / `RESEARCH_BASE_URL` / `RESEARCH_LLM_MODEL` |
| 提案 proposal | `PROPOSAL_API_KEY` / `PROPOSAL_BASE_URL` / `PROPOSAL_LLM_MODEL` |
| 脚本 script | `SCRIPT_API_KEY` / `SCRIPT_BASE_URL` / `SCRIPT_LLM_MODEL` |

- 换模型 = 改 env 的 `*_MODEL`（和必要时的 `*_BASE_URL`/`*_API_KEY`）。
- 模型行为差异 → 改对应 prompt（`lib/prompts/`），用 `scripts/eval-*.ts` 评测再落地。
- 费用：`lib/log/procedure.ts` 的 `calculateCost(model, usage)` 按 DeepSeek 定价表计算，换模型后核对价格表。

**素材/视频/TTS（DashScope）**
- 图片素材：`AI_ASSET_*`；TTS：`AI_TTS_*`（qwen3-tts-flash，SSML）。
- 视频：`AI_VIDEO_*`。**新增视频模型** = 实现 `VideoModelAdapter`（模板 `happyhorse-r2v.ts`）→ 注册 `createVideoAdapter(model)`。未知模型零容错抛错。
- 视频参数：`AI_VIDEO_RESOLUTION` / `AI_VIDEO_CONCURRENCY`（默认 2）/ `AI_VIDEO_STYLE_STRENGTH`（默认 0.85）。

**换模型的自检清单**
- [ ] 新模型输出结构与 `lib/types.ts` 一致（尤其 research 的 `user_demand`、proposal 的 `sceneVisuals`、script 的四子脚本）。
- [ ] 校验器通过（`parseAndValidate*`）。
- [ ] 用 eval 脚本对比质量 + token 费用。

---

## 6. 已知坑清单（Gotchas）

从本会话 + 历史积累，遇到类似症状先对号入座：

1. **Next.js 16 断裂变更**：App Router 约定与训练数据可能不同，Turbopack dev。写代码前读 `node_modules/next/dist/docs/`，沿用现有工作代码的模式。
2. **多行 JSX 块注释解析崩溃**：`{/* 长说明 */}` 会让 Turbopack/SWC 报 `Expected ',', got 'ident'`。长注释用 JSX **外**的 `//` 注释。
3. **flex 高度被撑爆**：外层容器必须**固定高度**（`md:h-dvh`）而非只给 `min-h-dvh` —— flex-grow 在非固定高度容器里失控，实测把整页撑到 2980px。节点卡填充用 `flex-1` 而非 `min-h-full`（百分比高度依赖父容器高度，不可靠）。
4. **端口冲突 / 杀进程**：`npm run dev` 重复启动第二个会自动退出；杀 npm wrapper PID 不杀 server 子进程。停服务用 `netstat -ano | grep :3000` 找监听 PID → `taskkill //PID <pid> //F`。
5. **Windows curl GBK 乱码**：Windows 终端 curl 中文输出乱码属正常，用 UTF-8 终端或重定向读文件。
6. **fluent-ffmpeg 拼接坑**：`video_merge` 需 `complexFilter` 先设 output 再挂 filter，避免重复 `-map`（PROJECT.md §节点8）。TTS 用 `apad` 对齐镜头时长，纯视觉镜头生成静音。
7. **验证勿调付费 API**：验证 = tsc + vitest，真实管线调用需用户授权。
8. **Docker 起 Redis**：`docker compose up -d`；docker daemon 可能未运行（npipe 连接失败）。若本机已有 Redis 在 6379 则直接用。
9. **OSS 公网 URL 硬依赖**：`sceneImageUrl` 必须是公网 http(s)，否则视频节点直接抛错。
10. **无头 Chrome 验证的 Windows 细节**：截图落 `/tmp` 后 Read 工具解析不了 Git Bash 路径——先 `cp` 进项目内；`--dump-dom` 核对渲染；几何用 CDP `getBoundingClientRect` 分层测量。

---

## 7. 前端设计速查

- **设计源**：`docs/design.md`（完整规格）+ `docs/layout-blueprint.html`（冻结蓝图，用户改设计就在这里）。
- **主题**：`app/globals.css` 的 `@theme inline`（Tailwind v4）。色板：页头靛蓝 `#6366f1`、侧栏琥珀 `#fffbeb`、内容区绿 `#10b981`、状态栏石板 `#f1f5f9`。
- **布局**：Grid 2×4 —— 页头 56 / 侧栏 280 通高 / 内容区 stage + 输入区 composer / 状态栏 28。桌面固定视口高度（`md:h-dvh`），移动端折叠为 页头→内容区→输入区→侧边栏→状态栏。
- **Stage = 对话时间线**：现在只渲染「节点成果卡」（视频预览三态 + 元信息 + 流水线六阶段）；不设预留区域，未来多轮对话卡直接向下追加，滚动自然容纳。
- **诚实约束**：后端进度仅 0/10/100 三档，流水线按任务状态整体着色、不伪造逐阶段百分比。
- **前端数据契约**：`GET/POST /api/tasks`、`GET /api/tasks/[id]/download`；`TaskSummary` 见 `lib/types.ts`。
