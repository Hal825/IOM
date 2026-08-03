# Phase 2: 智能脚本 + 画面分镜 + Agent 编排

> 状态：📋 规划中
>
> 目标：在 LangGraph 骨架之上，引入 AI 能力实现智能脚本生成、自动画面匹配，以及更复杂的 Agent 编排模式。

---

## 1. Phase 1 回顾与 Phase 2 起点

Phase 1 已完成 LangGraph 线性流程骨架的引入：

```
__start__ → script(规则切句) → tts(Edge TTS) → queue(BullMQ入队) → END
```

Phase 2 的核心目标是在此骨架上"长出肉来"——用 AI 替换规则逻辑，用条件路由替换线性流转，用并发任务替换串行执行。

---

## 2. 目标架构

### 2.1 理想流程

```
__start__
  │
  ├─→ ① AI脚本生成 (LLM)           ← 替换规则切句，支持风格/长度/语言控制
  │     │
  │     ├─→ ② 脚本审核（可选 interrupt）
  │     │
  │     └─→ ③ 并行任务
  │           ├─→ ③a TTS语音合成    ← 保留现有 Edge TTS
  │           └─→ ③b 画面匹配/生成  ← 新增：为每句脚本匹配或生成画面
  │                 │
  │                 └─→ ④ 视频合成入队
  │                       │
  │                       └─→ ⑤ Worker 渲染 (Remotion)
  │                             │
  │                             └─→ END
```

### 2.2 LangGraph 拓扑

```
                    ┌──────────────┐
                    │  script_ai   │  LLM 脚本生成
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   review     │  人工审核（interrupt）
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   fanout     │  并行分派
                    └──┬───────┬───┘
                       │       │
              ┌────────▼──┐ ┌──▼──────────┐
              │    tts    │ │  match_visual│  TTS + 画面匹配 并发
              └──────┬────┘ └──┬───────────┘
                     │         │
              ┌──────▼─────────▼──┐
              │   compose_video   │  合并结果
              └────────┬──────────┘
                       │
              ┌────────▼──────────┐
              │   queue_render    │  BullMQ 入队
              └────────┬──────────┘
                       │
                      END
```

---

## 3. 子任务拆分

### 3.1 AI 脚本生成节点 (`script_ai`)

**目标**：用 LLM 替换当前的规则切句逻辑。

**技术选型**：
- 方案 A：接入 OpenAI / Anthropic API（推荐起步方案）
- 方案 B：本地模型（Ollama + Qwen/Llama，离线可用但质量可能不如云端）

**节点输入**：
```typescript
{
  userPrompt: string;        // 用户原始输入
  style?: string;             // 风格（新闻/故事/教程/...）
  targetLanguage?: string;    // 目标语言
  maxScenes?: number;         // 最大场景数
}
```

**节点输出**：
```typescript
{
  scriptSegments: ScriptScene[];
  metadata: {
    style: string;
    wordCount: number;
    estimatedDuration: number;  // LLM 预估的朗读时长
  };
}
```

**注意事项**：
- LLM 调用需要 API Key 管理（环境变量 `.env`）
- 需处理 LLM 输出格式不稳定问题（retry + structured output）
- 保留规则切句作为 fallback（`generateScript` 仍可用）

### 3.2 画面匹配/生成节点 (`match_visual`)

**目标**：为每个脚本场景匹配或生成对应的画面/视频素材。

**可选方案**（按复杂度递增）：

| 方案 | 说明 | 优势 | 劣势 |
|---|---|---|---|
| A. 纯色背景 + 字幕 | 当前 MVP 方案 | 零成本，稳定 | 视觉效果单调 |
| B. 关键词搜图 | 提取每句关键词 → Unsplash/Pexels API 搜图 | 免费，素材丰富 | 可能不精准 |
| C. AI 生图 | 每句生成 prompt → Stable Diffusion / DALL-E | 精准匹配 | 成本高，延迟大 |
| D. 视频片段匹配 | 每句搜索短视频素材 → 拼接 | 动态效果好 | 版权风险，技术复杂 |

**推荐渐进路线**：B → C，先用免费图库验证流程，再按需接入 AI 生图。

**节点输出**：
```typescript
{
  visuals: Array<{
    sceneIndex: number;
    type: 'image' | 'video' | 'solid';
    url: string;          // 素材 URL 或本地路径
    duration: number;      // 展示时长
  }>;
}
```

### 3.3 人工审核中断 (`review`)

**目标**：在脚本生成后、渲染前插入可选的审核步骤。

**LangGraph 实现**：
```typescript
// 使用 interrupt() 暂停执行
import { interrupt } from '@langchain/langgraph';

const reviewNode = (state: State) => {
  const approved = interrupt({
    question: '是否确认此脚本？',
    script: state.scriptSegments,
  });
  if (!approved) {
    return { error: '用户取消' };
  }
  return {};
};
```

**前端配合**：
- API 返回 `interrupt` 状态 + 脚本预览
- 前端展示审核 UI（确认/修改/取消）
- 确认后调用 `graph.invoke(Command({ resume: ... }))` 继续执行

### 3.4 并行执行 (`fanout` + `tts` + `match_visual`)

**目标**：TTS 和画面匹配无依赖关系，应并发执行以减少总耗时。

**LangGraph 实现**：
```typescript
// 方案：使用 Send API 实现 map-reduce
import { Send } from '@langchain/langgraph';

const fanoutNode = (state: State) => {
  return [
    new Send('tts', { scriptSegments: state.scriptSegments }),
    new Send('match_visual', { scriptSegments: state.scriptSegments }),
  ];
};
```

**预期收益**：TTS（~1-2s）和画面匹配（~0.5-3s）并发后，总耗时从串行 3-5s 降至并行 2-3s。

---

## 4. 状态扩展

Phase 2 需要在 Phase 1 的 `VideoGenState` 基础上扩展字段：

```typescript
export const VideoGenState = Annotation.Root({
  // === Phase 1 保留字段 ===
  userPrompt: Annotation<string>,
  scriptSegments: Annotation<ScriptScene[]>,
  audioPath: Annotation<string>,
  duration: Annotation<number>,
  jobId: Annotation<string>,
  error: Annotation<string>,

  // === Phase 2 新增字段 ===
  style: Annotation<string>,                    // 脚本风格
  visuals: Annotation<VisualAsset[]>,           // 画面素材列表
  reviewStatus: Annotation<'pending' | 'approved' | 'rejected'>,
  aiModel: Annotation<string>,                  // 使用的模型名称（可观测性）
  retryCount: Annotation<number>,               // 重试计数
});
```

---

## 5. 依赖安装（预估）

```bash
# AI 脚本生成
npm install @langchain/openai          # 如果用 OpenAI
# 或
npm install @langchain/anthropic       # 如果用 Anthropic
# 或
npm install @langchain/ollama          # 如果用本地 Ollama

# 画面匹配
npm install unsplash-js                # Unsplash 图库 SDK

# 可观测性（可选）
npm install @langchain/langsmith       # LangSmith 追踪
```

---

## 6. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| LLM 输出格式不稳定 | 脚本生成失败 | Structured output + retry + 规则 fallback |
| API 费用不可控 | 成本超预算 | 限制 maxTokens + 本地缓存 + 用量监控 |
| TTS + 画面匹配并发写状态冲突 | 状态覆盖 | 使用 `Annotation` 的 reducer 合并，或分 key 写入 |
| 审核中断后用户无响应 | 任务悬挂 | 设置超时 + 自动取消 |

---

## 7. 里程碑

| 里程碑 | 内容 | 预计产出 |
|---|---|---|
| M1: AI 脚本 | LLM 脚本生成节点 + 规则 fallback | 可切换 AI/规则的脚本生成 |
| M2: 画面匹配 | 关键词搜图 + Remotion 图片组件 | 有画面的视频（非纯字幕） |
| M3: 审核流程 | interrupt 暂停 + 前端审核 UI | 人机协作流程闭环 |
| M4: 并行编排 | Send API + 并发 TTS/画面 | 流程加速 + 状态机可视化 |

---

## 8. 开放问题（待决策）

1. **LLM 选型**：优先接入哪个模型？（OpenAI / Anthropic / 本地 Ollama）
2. **画面素材来源**：首选用 Unsplash API 还是直接用 AI 生图？
3. **审核是否必须**：MVP 阶段是否先跳过人工审核，直接自动流转？
4. **LangSmith**：是否需要接入 LangSmith 做调试追踪？
5. **前端改造**：Phase 2 的审核 UI 是否在当前简单的单页应用上改，还是需要重构前端？
