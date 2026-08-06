# 重构后 Bug 记录

> 记录 LangGraph 流程骨架引入后，各节点联调时遇到的 bug 及修复方案。

---

## 目录

| # | 模块 | 现象 | 根因 | 状态 |
|---|---|---|---|---|
| 1 | video-gen | 查询任务返回 400 | 查询 URL 拼装错误 | ✅ |
| 2 | video-gen | Field required: input.media | 首帧 URL 为本地路径 | ✅ |
| 3 | tts | 响应中未找到音频数据 | 请求体格式错误（voice 混入 input） | ✅ |
| 4 | tts | 400 InvalidParameter | 误用 input.messages 格式 | ✅ |
| 5 | tts | audio.startsWith is not a function | resolveAudio 未处理对象类型 | ✅ |
| 6 | video-gen | 任务成功但未找到视频 URL | 响应字段兼容不足 | ✅ |
| 7 | video-gen | duration must be 3-15s | proposal 总时长超出模型限制 | ✅ |
| 8 | script | 每次 script_generation 必失败 | characterImageRefs 幽灵校验残留 | ✅ |
| 9 | coordinator | 陈旧回复静默跳过决策点 / 误恢复手动暂停 | submitReply 无条件清 paused | ✅ |
| 10 | 全链路 | 任一第三方请求挂起 → 队列永久阻塞 | 所有 HTTP 调用无超时 | ✅ |
| 11 | script/research/proposal | JSON 提取截错/漏段 | 贪婪正则 `/\{[\s\S]*\}/` 脆弱 | ✅ |

---

## 1. video-gen 查询任务返回 400

**文件**: `lib/tools/video-generation/`

**现象**:
```
[video-gen] 查询任务返回 400
```

**根因**: DashScope 异步任务的**创建端点**和**查询端点**是不同路径：
- 创建: `POST https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis`
- 查询: `GET https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}`

代码用 `${AI_VIDEO_BASE_URL}/tasks/${taskId}` 拼 URL，实际发出的是：
```
GET .../video-synthesis/tasks/xxx  ← 此端点不存在
```

**修复**:
1. 新增 `AI_VIDEO_TASK_URL`，从 `AI_VIDEO_BASE_URL` 的 origin 推导出正确的 `/api/v1/tasks`
2. 4xx 错误立即失败（不再无效轮询 10 分钟）

---

## 2. video-gen Field required: input.media

**文件**: `lib/tools/video-generation/` + `lib/tools/asset-generator.ts`

**现象**:
```
[video-gen] 任务失败: Field required: input.media
```

**根因**: `happyhorse-1.1-i2v` 是 image-to-video 模型，**必须**传入首帧公网 HTTP URL。但 `generateSceneBackground` 下载图片后，用本地路径替换了 DashScope 返回的远程 URL。`getFirstFrameUrl` 拿到 `D:\...\scene_000.png`，不满足 `startsWith('http')`，导致 `input.media` 为空。

**修复**:
1. `SceneAsset` 新增 `remoteUrl?` 字段保留原始远程 URL
2. `generateSceneBackground` 同时保存 `remoteUrl`（公网）和 `imageUrl`（本地）
3. `getFirstFrameUrl` 优先取 `remoteUrl`

---

## 3. TTS 响应中未找到音频数据

**文件**: `lib/tools/tts-generator.ts`

**现象**:
```
[tts] 响应中未找到音频数据
[tts] 无可用 API，生成占位标记
```

**根因**: 请求体使用了 火山引擎 Seed-Audio 的格式，所有参数（voice, rate, pitch）都混在 `input` 对象中。DashScope 多模态生成 API 将 voice 等视为 `parameters`，放在 `input` 中会被忽略，导致模型未正确生成音频。

原请求体：
```json
{
  "model": "qwen3-tts-flash",
  "input": { "text": "...", "voice": "Cherry", "rate": 1.0, "pitch": 1.0, ... }
}
```

**修复**: 将 voice, format, sample_rate, rate 移入 `parameters`。

---

## 4. TTS 400 InvalidParameter

**文件**: `lib/tools/tts-generator.ts`

**现象**:
```
[tts] API 返回 400: "Due to invalid text, invalid audio was returned."
```

**根因**: 上轮修复误用了 `input.messages`（LLM 对话格式），但 `qwen3-tts-flash` 的输入是 `input.text`。

错误格式：
```json
{ "input": { "messages": [{ "role": "user", "content": [{ "text": "..." }] }] } }
```

**修复**: 改回 `input.text`，仅将配置项留在 `parameters`：
```json
{ "input": { "text": "..." }, "parameters": { "voice": "Cherry", "format": "mp3", ... } }
```

---

## 5. TTS audio.startsWith is not a function

**文件**: `lib/tools/tts-generator.ts`

**现象**:
```
[tts] API 异常: audio.startsWith is not a function
```

**根因**: `resolveAudio` 函数签名是 `(audio: string)`，假设返回的 audio 一定是字符串。但 DashScope 实际返回的 `audio` 字段可能是**对象** `{ url: "...", data: "..." }`，调用 `.startsWith()` 直接抛异常。

**修复**: 重写 `resolveAudio` 为 `(audio: unknown)`，按类型分发：
| 类型 | 处理 |
|---|---|
| 对象 `{ url }` | 下载 URL |
| 对象 `{ data }` | 递归处理 data |
| 字符串 URL | 下载 |
| 字符串 data URI | 提取 base64 解码 |
| 字符串 Base64 | 直接解码 |

---

## 6. video-gen 任务成功但未找到视频 URL

**文件**: `lib/tools/video-generation/`

**现象**:
```
[video-gen] 任务 SUCCEEDED
[video-gen] 任务成功但未找到视频 URL
```

**根因**: DashScope 响应中 `video_url` 可能直接在 `output` 根级别，而非必定在 `output.results[0].video_url`。代码只检查了后者。

**修复**:
1. 新增 `output.video_url` 字段类型
2. 取值逻辑改为 `output.video_url ?? output.results[0].video_url`
3. 未找到时打印完整 `output` 以便排查

---

## 7. video-gen duration 超出模型限制 ✅（预留）

**文件**: `lib/tools/video-generation/util.ts`

**现象**:
```
[video-gen] 任务失败: duration must be between 3 and 15 seconds, got 24
```

**根因**: `happyhorse-1.1-i2v` 单次生成限制 3-15 秒，但 proposal 的 `totalDuration`（sceneCount × 8s）可能超过 15 秒。

**修复（预留）**: `lib/tools/video-generation/util.ts` 提供 `clampDuration(sec, 3, 15)`。当前 `shot_video_gen` 只做脚本交接（不真正生成），待真实视频生成接入时对每个镜头时长钳制后再传给视频 API。

---

## 8. script 每次 script_generation 必失败（characterImageRefs 幽灵校验） ✅

**文件**: `lib/tools/script-generator.ts`

**现象**: 管线到 script_generation 节点必然抛错 → 3 次重试 → 任务失败（代码审查 Wave 1 发现）。

**根因**: asset-gen 重构把旧字段 `resourceRefs.characterImageRefs` 替换为 `appearCharId`（见 memory：appearCharId 取代 characterImageRefs），但校验器 `parseAndValidateScript` 仍强制要求 `characterImageRefs` 为数组。`lib/types.ts` 的 `resourceRefs` 只剩 `sceneImageRef`，prompt 全文也只教 LLM 输出 `sceneImageRef` + `appearCharId`——LLM 按 prompt 输出必然命中幽灵校验。

**修复**:
1. 删除 `characterImageRefs` 幽灵校验（`script-generator.ts:111-113`）
2. 改为校验真实契约 `appearCharId` 存在（纯视觉镜头为空数组）
3. `parseAndValidateScript` 改为导出，补回归测试（`lib/tools/script-generator.test.ts`：合法输出通过 / 缺 appearCharId 抛错 / 幽灵字段向后兼容）

## 9. submitReply 无条件清 paused（陈旧回复跳过决策点） ✅

**文件**: `lib/coordinator.ts` + `app/api/tasks/[id]/reply/route.ts`

**现象**: 双击 / 网络重试 / StrictMode 重复调用 `POST reply` → 多条用户消息 + 清掉后续决策点的暂停 → 决策点被静默跳过；手动暂停的任务也会被任意 reply 误恢复（代码审查 Wave 3 发现）。

**根因**: `submitReply` 无条件 `setPaused(false)` + `setAwaiting(false)`，不校验任务是否真停在决策点等待回复；reply 路由也无 `isJobAwaitingReply` 守卫。

**修复**:
1. `CoordinatorDeps.flags` 新增 `isAwaiting`（缺省 `isJobAwaitingReply`）
2. `submitReply` 仅在 `awaiting === true` 时才清 paused/awaiting 并广播 `proceed`；消息与反馈照常落盘
3. 加幂等守卫：同一决策点（gateId）已有回复 → 直接返回现状，不重复追加/放行
4. 补 2 条回归测试（`lib/coordinator.test.ts` R2a/R2b）

---

## 10. 所有第三方 HTTP 调用无超时（单 Worker 队列可永久阻塞） ✅

**文件**: `lib/tools/`（新增 `lib/tools/http.ts` 共享 helper）

**现象**: 任一第三方 API（LLM / 图片 / TTS / OSS / 视频下载）挂起时，`fetch` 无超时；Worker `concurrency: 1`，整个队列被占死，无恢复手段。

**根因**: 全部 `fetch` 无 AbortController。happyhorse 只有轮询有 `MAX_WAIT_MS`，创建任务 fetch 无超时。

**修复**:
1. 新增 `lib/tools/http.ts`：`fetchWithTimeout`（AbortController 超时，默认 120s，`HTTP_TIMEOUT_MS` 可覆盖）
2. 应用到 8 处调用：research / proposal / script / tts / asset-generator / asset-store / oss-uploader / happyhorse（create+poll+download）
3. 超时按零容错抛错（任务失败），而非挂死队列

## 11. LLM JSON 提取贪婪正则脆弱（截错/漏段） ✅

**文件**: `lib/tools/http.ts` + 三个生成器校验器

**现象**: 三个校验器用 `raw.match(/\{[\s\S]*\}/)` 取 JSON：散文里嵌套花括号时截错范围；无花括号时漏取。

**修复**: 新增 `extractJsonObject`：
1. 优先取 ```json ... ``` 代码围栏内容
2. 否则逐候选花括号块做 brace 匹配（忽略字符串内括号）并尝试 `JSON.parse`，返回第一个合法对象
3. 应用到 research / proposal / script 三个校验器；补单测（`lib/tools/http.test.ts`：围栏 / 散文嵌套括号 / 无对象抛错 / 超时）

---

## 经验总结

1. **DashScope 异步任务查询端点与创建端点不同**，需从 origin 推导 `/api/v1/tasks/{id}`
2. **i2v 模型必须公网 HTTP 首帧 URL**，本地素材需保留远程 URL
3. **TTS 请求格式**: `input.text` 放文本，`parameters` 放 voice/format 等配置，不要混入 `input`
4. **API 返回值类型不确定时用 `unknown` + 类型守卫**，避免 `string.startsWith()` 这类直接调用
5. **优先打印原始响应（截断）**，未知字段名时日志就是线索
6. **schema 字段替换时，校验器/prompt/示例/类型四处必须一起改**——`characterImageRefs → appearCharId` 只改了类型和 prompt，漏改校验器导致每次必失败
7. **跨进程放行类操作要有状态守卫 + 幂等**——`submitReply` 这类会推进管线的调用，必须校验「当前是否真的在等它」，并对同一决策点去重
