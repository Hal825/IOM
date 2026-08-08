# OpenMontage 前端优化报告（2026-08-08）

## 第二轮：布局与细节（2026-08-08 晚）

冻结蓝图的三列结构与配色未动，以下为精修 + 视觉焕新：

| 类别 | 改动 |
|------|------|
| 无障碍 | `globals.css` 全局 `:focus-visible` 焦点环（accent 描边，仅键盘触发）；新增 `prefers-reduced-motion` 全局降级（关闭旋转/呼吸/过渡）；所有小按钮移动端触摸目标升至 44px（`h-11`/`py-2.5`，桌面保持原密度 `md:` 回落）；琥珀/绿底小字对比度提升（`amber-800/50` → `amber-900/60+`、emerald 同理、`muted/70` → `muted`）；收起窄条展开按钮补 `aria-expanded="false"` |
| 布局精修 | Header 对齐蓝图 56px（`h-14`）；`.rail-list` 底部虚化的融入色改为 CSS 变量 `--rail-fade`，成品库（浅绿）获得与任务列表一致的底部虚化 |
| 图标统一 | 新建 `app/components/icons.tsx`（IconPlay/Pause/Trash/Download/Rerun/Brand，内联 SVG、currentColor、aria-hidden），替换全部 emoji（🗑 ⏸ ▶ ⬇ ↻ ▸），跨平台渲染一致 |
| 视觉焕新 | EmptyHero 初始页品牌化：accent→success 渐变标题「把一段文字，变成一支视频」（h2，避免与页头 h1 冲突）+ 一句话流程副标题 + 3 条示例提示词 chips（点击填入可再编辑，textarea 改为 EmptyHero 受控）——设计文档中「留待后续实现」的示例提示词落地 |
| 代码卫生 | 删除死代码 `composer.tsx`（无引用）、`task-detail.tsx` + `task-detail.test.tsx`（仅自引用，ChatTimeline 之前的遗留） |

验证：tsc 0 错 · ESLint 0 error（7 个 pre-existing warning 未动）· vitest 21 文件 / 100 测试全过（-6 为删除的死代码测试）· 生产构建 ✓（编译/TS/静态页生成通过，仅沙箱清理临时目录被拦，与项目无关）。

## 第一轮：性能优化（2026-08-08 下午）

### 基线指标（生产构建，未压缩）
- 首屏 JS ≈ 662KB：框架运行时 ~456KB + polyfill ~113KB + 页面代码 ~93KB
- CSS ≈ 30KB；无图片资源、无重型三方客户端依赖
- 结论：**包体积健康，瓶颈在运行时行为**，未做拆包

### 已实施优化（全部通过验证）

| # | 问题 | 证据 | 改法 |
|---|------|------|------|
| C1 | 全局 3s 轮询无条件运行，且每次新建数组 → 每 3 秒整树重渲染 | `workbench.tsx` | setTimeout 链替代 setInterval；标签页隐藏暂停、回前台即校准；活跃 3s / 空闲 10s 双档；逐字段浅比较，数据未变保留引用跳过重渲染 |
| C2 | 流式 token 每帧 setState → 整棵时间线逐 token 重渲染 | `chat-timeline.tsx` | delta 先入 ref 缓冲，requestAnimationFrame 合帧 flush；`MessageItem` 加 memo；`runAction`/`handleRerun` useCallback 稳定引用 |
| C3 | 构建期拉 Google Fonts，离线/国内构建机必失败（实测中断 build） | `layout.tsx` | 移除 next/font/google，globals.css 改系统字体栈（中文 UI 本来就走系统字体，零视觉差异、零下载） |
| C4 | 流式期间视图不跟随；smooth 滚动动画互相打断 | `chat-timeline.tsx` | 滚动 effect 依赖加 `streaming`，流式期间 `behavior:'auto'` |
| C5 | 删除确认 setTimeout 卸载未清理；装饰图标未 aria-hidden；textarea 无 label | `chat-timeline.tsx`、`workbench.tsx`、`new-task-page.tsx` | 定时器 id 入 ref + 卸载清理；装饰 ▸ 加 `aria-hidden`；textarea 加 `aria-label="视频描述"` |
| C6 | 派生数据每渲染重算；相对时间永不刷新 | `chat-timeline.tsx`、`task-sidebar.tsx`、`production-rail.tsx` | `completedNodes`/`hasCards` 用 useMemo；两侧栏加 60s tick 保持「N 分钟前」新鲜（C1 引用稳定化的配套） |
| 附 | localStorage 恢复偏好在 effect 体内同步 setState（lint error） | `workbench.tsx` | 改 rAF 回调内 setState，消除 `react-hooks/set-state-in-effect` 报错 |

其他工程改动：
- `next.config.ts`：新增 `distDir: process.env.NEXT_DIST_DIR ?? ".next"`（审计/CI 可用独立产物目录）
- `eslint.config.mjs`：ignores 增加 `.next-audit/**`（此前 lint 扫构建产物目录报 4700+ 条假问题）

## 验证结果
- `tsc --noEmit`：0 错误
- `eslint app/ lib/`：**0 error**（余 7 个 pre-existing warning，均在 `lib/` 未使用变量，未动）
- `vitest run`：**22 文件 / 106 测试全部通过**
- `next build`：编译 ✓、TS ✓、静态页生成 ✓（仅沙箱清理构建临时目录被拦，与项目无关）
- 改动后页面 chunk ~94KB（+1.7KB，即本次新增逻辑），字体请求归零

## 预期收益
- 空闲时后台请求量下降 ~70%（3s → 10s），标签页隐藏时归零；服务端 `/api/tasks`（每次查 6 种状态）压力同步显著减少
- 任务列表无变化时整树重渲染次数趋近于 0
- 流式输出期间渲染次数从「每 token 一次」降为「每帧最多一次」，且历史卡片不再重渲染
- 构建不再依赖外网

## 待办（未做，供后续参考）
- `lib/` 7 个 unused-vars warning（`coordinator.ts:35`、`tools/video-generation/index.ts:10-11`）
- `ProductionRow` 用 div+role=button，可换原生 `<button>`；`aria-expanded` 建议配 `aria-controls` 指向受控区域
- `text-muted`（#64748b）在 amber-50/emerald-50 底色上的小字对比度接近临界，可用更深的 amber-900 系
- 刷新前 scheduled 中的轮询请求未加 AbortController（影响极小）

## 环境备注
本机沙箱会拦截 `next build` 对 `.next` 的清理；验证构建用 `NEXT_DIST_DIR=.next-verify npm run build` 完成，临时产物目录已删除，tsconfig.json 的构建自动改动已还原。
