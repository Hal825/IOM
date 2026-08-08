# OpenMontage · 前端设计系统（design.md）

> 单一事实来源：`docs/layout-blueprint.html`（已冻结，2026-08-03 确认）。
> 本文档由蓝图派生，是配色 / 字体 / 间距 / 动效的完整规格与组件映射，也是接入真实组件时的实现依据。

---

## 0. 产品定位与设计原则

OpenMontage = 文本生成视频的「单屏工作台」。用户提交一段文本，后端自动跑完
调研 → 提案 → 脚本 → 素材 → 逐镜头视频 → 拼接 六阶段，产出 MP4。

设计原则：

1. **创作优先**：手机上内容区 / 输入区优先，任务列表退居下方（单列堆叠顺序 = 页头 → 内容区 → 输入区 → 侧边栏 → 状态栏）。
2. **诚实约束**：API 层进度字段仍只有 `0 / 10 / 100` 三档；但流水线八阶段按**真实节点事件**逐节点着色（节点一旦产卡即标绿），不伪造未发生阶段的进度。
3. **对话时间线（human-in-loop 已实现）**：内容区按任务渲染对话时间线 —— 用户描述气泡 → 节点结果卡逐张流入（agent 决定卡片类型 + 可选点评）→ 决策点提问气泡（`等待回复`）→ 用户回复 → … → 成片卡。向下追加、由时间线滚动自然容纳。
4. **单屏不滚动**：整体 Grid 填满视口（`min-height: 100dvh`），滚动只发生在内部区域（任务列表、对话时间线）。

---

## 1. 布局系统（Layout）

CSS Grid `3 列 × 4 行`，`gap: 0`（真实界面由卡片间距承担，不再用蓝图里的 6px 分区缝）：

| 行 | 区域 | 说明 |
|----|------|------|
| 1 | **header** | 横跨全部列，固定 56px，白底 + 靛蓝品牌 |
| 2–3 | **rail** | 第 1 列固定 `280px`，跨 2~3 行通高；琥珀浅底 |
| 2 | **stage** | 第 2 列 `minmax(0,1fr)`，可滚动的对话时间线 |
| 3 | **composer** | 第 2 列底部，编辑器式输入栏 |
| 2–3 | **成品库** | 第 3 列固定 `260px`，跨 2~3 行通高；浅绿底（2026-08-08 新增） |
| 4 | **status** | 横跨全部列，固定 28px；石板浅底 |

- `minmax(0,1fr)` 而非裸 `1fr`：防止子内容过宽把网格撑破。
- **移动端单列同样用 `grid-cols-1`（= `repeat(1, minmax(0,1fr))`）**，不能裸 `grid`（无模板 = `auto` 列，长任务文本 max-content 会把列撑破成 1000px+，实测横向溢出）；配合 grid 子项 `min-w-0`。
- rail 跨行：侧边栏整条通高，输入区只占右列底部 —— 编辑器式布局。
- 成品库跨行：与任务栏对称，是「已完成任务成片」的常驻清单（点击切主区详情）。
- **栏可收起（2026-08-08）**：左右两栏各自可收起为 `44px` 窄条（`RailCollapseStrip`：桌面竖排展开按钮 + 旋转标签；移动端横排全宽保持可展开入口），列宽在 `280/44 × 260/44` 四种组合间切换；偏好写 `localStorage`（`om:rail-left-collapsed` / `om:rail-right-collapsed`），刷新后保持。

### 移动端折叠（≤960px）
单列堆叠，顺序 = **页头 → 内容区 → 输入区 → 成品库 → 侧边栏 → 状态栏**（创作与结果优先，任务列表退到成品库之后）。

---

## 2. 配色（Color）

最终值，与蓝图 CSS `0.5 设计色板` 一致。Tailwind v4 在 `app/globals.css` 的 `@theme inline` 中定义。

### 2.1 区域色

| 区域 | 背景 | 边框 / 强调 | 角色 |
|------|------|------------|------|
| 全局 | `#f8fafc` slate-50 | — | 页面底色 |
| Header | `#ffffff` | 靛蓝 `#6366f1` | 品牌 |
| Rail | `#fffbeb` amber-50 | 琥珀 `#f59e0b` | 队列 |
| Stage（节点卡） | `#ffffff` | 绿 `#10b981` | 内容 / 成功 |
| Composer | `#ffffff` | 靛蓝 `#6366f1` | 主操作 |
| Status | `#f1f5f9` slate-100 | 石板 `#475569` | 系统 |

### 2.2 语义色

| token | 色值 | 用途 |
|-------|------|------|
| `accent` 靛蓝 | `#6366f1`（hover `#4f46e5`，底 `#eef2ff`） | 品牌 / 主按钮 / 选中态 / 处理中 |
| `success` 绿 | `#10b981` | 已完成 / 成功 |
| `info` 青 | `#0891b2` | 排队中 |
| `warning` 琥珀 | `#f59e0b` | 延迟 / 队列警告 |
| `danger` 红 | `#ef4444` | 失败 / 离线 |
| 元信息紫 | `#9333ea` | 任务详情附加块 |
| `foreground` | `#0f172a` | 主文字 |
| `muted` | `#64748b` | 次文字 / 说明 |
| `border` | `#e2e8f0` | 默认边框 |

### 2.3 文字
主文字 `#0f172a`；次文字 `#64748b`；彩色底上用同色系深一号（如琥珀底 `#92400e` 文字）。

---

## 3. 字体（Typography）

- **品牌 / 标题**：Geist Sans（`next/font/google` 已接入），`font-semibold`，14px。
- **正文**：system-ui 栈（body 继承）。
- **等宽**（任务号 / 时间 / 版本 / 进度）：Geist Mono，`font-mono`。
- **字号阶梯**（工作台密度高，正文 14px）：
  - 状态栏 / 元数据 10–11px
  - 任务行 11–13px
  - 正文 / 输入 14px（text-sm）
  - 品牌 14px semibold

---

## 4. 间距（Spacing）

- 基准：4px 单位。
- 区域 padding：`p-4`（16px），桌面 `md:p-6`（24px）。
- 卡内间距：`gap-3`（12px）移动端 / `gap-4`（16px）桌面。
- 任务行：`px-3 py-2.5`。
- 圆角：卡片 `rounded-xl`，芯片 `rounded-full`，输入 `rounded-lg`。

---

## 5. 动效（Motion）

- **进度条**：不确定动画 `indeterminate 1.4s`（后端三档进度，不做百分比填充）。
- **状态点**：处理中 `animate-pulse` 呼吸。
- **按钮**：hover `-translate-y-0.5` + 阴影抬升；disabled 置灰。
- **任务选中**：`border-l-2 accent` + `accent/8` 底，`transition-colors`。
- **原则**：克制、快（≤200ms）、无意义弹跳一律不要。

---

## 6. 组件映射（Component → Region）

| 区域 | 组件 | 现状 → 目标 |
|------|------|-------------|
| Header | `workbench.tsx` 内联 | 品牌区（左）↔ 队列状态仪表（右，三态圆点） |
| Rail | `TaskSidebar` + `TaskItem` | 顶部「队列概况」（含「＋新建任务」按钮）+ 可滚动「任务列表」；琥珀浅底 |
| Stage | `ChatTimeline` + `cards/*` + `Pipeline` + `EmptyHero` | 两态：初始/新建大输入 / 对话时间线（节点卡 + 决策点回复框） |
| Composer | `EmptyHero` 大输入 | 初始/新建视图用；详情视图的「回复框」内嵌在 ChatTimeline 底部（决策点出现时才激活） |
| 成品库 | `ProductionRail` + 行内下载 | 已完成任务成片清单（#id + 标题 + 时长 + 「⬇ 下载」）；浅绿底 |
| Status | `StatusBar`（新） | 左队列 / Worker 状态；右任务数 / 版本 |

---

## 7. 组件细节规格

### 7.1 成片播放（对话时间线内）

成片卡 = 对话时间线的最后一张节点卡，内含 `<video controls>`（`aspect-video` 黑底）+ 时长 + 「⬇ 下载 MP4」。只在真正产出成片（`video_merge` 节点事件）后渲染，不渲染虚假的「等待视频」。

### 7.2 流水线八节点（Pipeline）

节点：`调研 → 提案 → 脚本 → 素材 → 配音 → 组装 → 逐镜头视频 → 拼接`。

**诚实约束（升级）**：不再整条统一着色 —— 对话时间线里每张节点卡来自真实节点事件，流水线据此逐节点着色：

| 节点状态 | 外观 |
|----------|------|
| 已完成（节点已产卡） | 绿 chip |
| 当前阶段（首个未完成） | active → 靛蓝 + 脉冲；failed → 红；paused → 灰 |
| 未到 | 灰（idle） |

每节点为一个小芯片（flex 横排，窄屏 `flex-wrap`）；active 时附加不确定进度条。

### 7.7 对话时间线 + 节点卡（ChatTimeline，2026-08-05）

**结构**（自上而下）：

1. **任务头**：`#id` + 状态芯片 + （决策点时）`等待回复` 徽标 + 相对时间 + 操作行（暂停/继续、删除两步确认、完成后下载）。
2. **消息列表**（滚动）：用户描述气泡（靛蓝右对齐，`你的描述` 标注）→ 节点卡逐张流入 → 决策点提问气泡（青色描边，`?` 徽标）→ 用户回复气泡 → 系统状态行（居中灰字）。
3. **流水线八节点**（真实事件着色）。
4. **决策点回复框**：出现 `等待回复` 时激活（青色描边）。**「继续 →」主按钮（accent 实底，无输入直接放行，2026-08-08）** + 文本框（可选写修改意见）+ 「发送」次按钮（info 描边，有文字才启用）。任意文本 = 继续 + 记录反馈。否则显示虚线占位提示。

**节点卡**（agent 决定呈现形态）：卡片外壳 = 标签（调研/提案/脚本/素材/配音/场景规格/逐镜头视频/成片）+ 节点名 + 时间戳 + 可选 LLM 点评行（斜体灰字）+ 卡主体。主体由 `cards/registry.tsx` 按 CardType 映射：
- research：需求提取 + 就绪度分数（绿/琥珀/红）+ 短板
- proposal：标题 + 角色数 + 空间/镜头数 + 时长/比例 + 风格
- script：镜头数 + 四子脚本 + 含台词镜头数 + 开场叙事
- assets：角色素材/场景背景数量（库/AI 分类）
- audio：配音段数 + 每段 sceneId/时长
- scenes：镜头规格数 + 分辨率/引擎
- shots：已生成镜头数 + 每镜实测时长
- video：播放器 + 时长 + 下载

**气泡/状态用色**：用户气泡靛蓝实底白字；决策点提问 `info` 青描边浅底；系统行灰。

**思考中状态（2026-08-07）**：任务 `busy`（排队/处理中）且消息列表还没有任何节点成果卡时，消息列表显示 `ThinkingCard` —— 居中转圈（accent 圆环 `animate-spin`）+ 轮播趣味对话行（研究节点/导演/编剧/美术/配音/摄影机/剪辑师轮流「思考中」，每 2.5s 切换并有 `animate-fade-in` 淡入）。第一张成果卡（SSE `card` 事件）到达即自动切回节点卡时间线；文案为占位，改设计经蓝图交流。

### 7.8 成品库（右栏，2026-08-08）

**位置**：第三列固定 `260px` 通高，浅绿底（`bg-emerald-50`，`emerald-900` 文字），左缘 `border-l`。桌面三列对称；移动端折叠在内容区之后、任务列表之前。

**结构**（自上而下）：
1. **头部**：`成品库` 标题 + 完成数（`font-mono`）。
2. **成品列表**（滚动，`flex-1 overflow-y-auto`）：仅渲染 `status === 'completed'` 的任务。每行 = `#id` + 右侧「⬇ 下载」（绿描边小按钮）→ 标题（`task.text` 截断）→ 时长（`result.durationSec`，`x.x s`）+ 相对时间。
3. **空态**：`暂无已完成任务，成片会出现在这里`（虚线框占位）。

**交互**：点击整行 = `onSelect(id)` → 主区切到该任务对话时间线（与左栏任务行同源 `handleSelect`）。「⬇ 下载」用 `stopPropagation` 只触发下载、不选中行。

**收起/展开（2026-08-08）**：栏头右侧小按钮（`⟨` 收起任务栏 / `⟩` 收起成品库）→ 收起为 `44px` 窄条；窄条顶部展开按钮（方向图标反向）+ 竖排小标签，桌面 `md:h-full` 填满通高，移动端横排全宽。偏好由 `Workbench` 统一存 `localStorage`，左右独立。

**诚实约束**：只列真实完成（`completed`）且带产物的任务，不伪造等待/处理中任务的预览；成片即任务详情里的 `video_merge` 产出。

### 7.3 任务元信息
`#id` + 状态芯片 + 提交时间 + 用户原始文本（`whitespace-pre-wrap`）。
完成后：时长 + 「下载 MP4」；失败：失败原因块。

### 7.4 队列状态仪表（Header 右 / Rail 队列概况共用）
三态：
- **空闲**：灰圆点
- **渲染中**：靛蓝圆点 + `animate-pulse`（任一任务 active）
- **离线**：红圆点（轮询失败 / Redis 不可达）

实现为可复用 `QueueIndicator`。

### 7.5 新任务创建（EmptyHero）

蓝图 v2（2026-08-04 简化）：可动区域仅「内容区 + 输入区」，其余（页头 / 侧栏 / 状态栏）格式冻结。

**入口**：侧栏「队列概况」行内「＋ 新建任务」按钮（靛蓝圆角，`px-3 py-1.5 text-xs`）→ 回到初始状态页。

**内容区两态**：

| 状态 | 内容区 | 输入区 |
|------|--------|--------|
| 初始 / 新建（默认进入） | 置空 | `EmptyHero`：大输入框横跨「内容区 + 输入区」，`max-w-xl` 居中 |
| 详情 | `ChatTimeline` 对话时间线（任务头 + 节点卡 + 流水线 + 决策点回复框） | 回复框内嵌（决策点 `等待回复` 时激活） |

**默认进入初始状态页**（而非自动选中最新任务）：点选侧栏任务 → 详情；点「＋新建任务」→ 回初始状态页；提交成功 → 详情。

**大输入框（`LargeComposer`，EmptyHero 内部）**：`rounded-2xl border-accent/40`；textarea `min-h-[110px]`；提交按钮嵌框内右下（`px-6 py-2`）；字符计数 `0/2000`；`Ctrl / ⌘+Enter` 快速提交；错误横幅复用 danger 样式。

**视频生成方式切换（2026-08-08）**：大输入框底部左侧一个分段开关 —— `视频 API`（auto，项目调视频 API）/ `Claude 生成`（claude，方案 B，暂停等 Claude 用套餐模型生成；选中时旁边显示「需 Claude 在线接管视频节点」提示）。随任务提交存 `job.data.videoMode`。

**诚实约束**：与 `Composer` 共用 `submitting` / `error` 状态；示例提示词留待后续实现。

### 7.6 任务操作（暂停 / 继续 / 删除）

补充（2026-08-04）：任务详情卡底部「操作行」。

| 操作 | 行为 | 显示条件 |
|------|------|----------|
| 暂停 / 继续 | `POST /api/tasks/[id]/pause { paused }` → Redis 标志；管线在暂停点阻塞 | `waiting` / `active` / `paused` |
| 删除 | `DELETE /api/tasks/[id]` → 标记删除 + 移除 job + 清理该任务产物；两步确认 | 始终可用 |
| 下载 | `GET /api/tasks/[id]/download` | `completed` |

**逐任务暂停机制**：`lib/pause.ts` 的 Redis 标志 + 管线内 4 个暂停门（research→proposal、script→asset/tts fanout、assembler→shot、shot→merge）+ `executeTask` 前置暂停点。暂停 = 阻塞轮询，恢复 = 放行，删除 = 抛错中止（零容错）。

**4 个暂停门 = 决策点（human-in-loop，2026-08-05）**：`beginDecision(jobId, gateId)` 在进门时自动置暂停标志 + 发布 `gate` 事件（幂等）→ 管线停住；前端显示 `等待回复` 徽标 + 激活回复框；用户回复（或手动「继续」）清标志放行。任意文本回复 = 继续 + 反馈记录（`storage/feedback/{jobId}.json`）。
- 诚实约束：暂停「阶段间生效」——当前阶段跑完后在下一个暂停门停下；视频生成中途暂停要等当前镜头批完成。
- Worker 并发为 1，暂停任务会占住 worker，其他排队任务随之等待。

**删除清理**：`deleteTaskFiles(jobId)` 删 `output/{id}.mp4`、`scenes|scripts|audio|assets/{id}/`、`conversations/{id}/`、`feedback/{id}.json`、`log/procedure/job-{id}/`；**不动**共享素材库。

---

## 8. 数据契约（不变）

- `GET /api/tasks` → `{ tasks: TaskSummary[] }`（最近 50 条，新 → 旧）
- `POST /api/tasks { text, videoMode? }` → `{ id, status }`（成功 201 / 400 文本为空 / 503 队列不可用；`videoMode` 取值 `auto`（缺省）/ `claude`，非法值回退 `auto`）
- `GET /api/tasks/[id]/download` → mp4 流（或 OSS 307）
- `POST /api/tasks/[id]/pause { paused }` → `{ ok, status }`（逐任务暂停/恢复；恢复时清待回复并广播 proceed）
- `DELETE /api/tasks/[id]` → `{ ok }`（删除记录 + 清理产物 + 退订事件，幂等）
- `GET /api/tasks/[id]/stream` → SSE 流（`hello` 重放 + `card`/`gate`/`user`/`proceed`/`status` 事件）
- `POST /api/tasks/[id]/reply { text }` → `{ ok, conversation }`（回复决策点：追加消息 + 反馈落盘 + 放行）
- `GET /api/tasks/[id]/conversation` → `{ conversation: ConversationFile | null }`
- `TaskSummary = { id, status, progress, text, createdAt, result?, failedReason?, awaitingReply? }`，`status` 额外取值 `paused`（waiting/active 被暂停时）

---

## 9. 实现计划（Roadmap）

1. `globals.css` 主题 token 换成「浅色精修」色板（靛蓝主色，琥珀 rail，绿 stage）。
2. `workbench.tsx` 布局重构：header 队列状态仪表 / rail 通高 / stage + composer 右列 / status bar。
3. 新建 `StatusBar`、`QueueIndicator`、`Pipeline`；重构 `TaskSidebar`（队列概况）、`TaskDetail`（节点成果卡 + 视频三态 + 流水线）。
4. `tsc` + `vitest` 验证（不调付费 API，见 `no-paid-api-during-verify`）。
5. 起 `npm run dev`，截图给用户确认。
6. 「新任务创建」蓝图 v2 落地：`EmptyHero` 组件 + workbench 内容区两态（默认初始状态页）+ 侧栏「＋新建任务」按钮（2026-08-04）。
