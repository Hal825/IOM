# Research 节点 Prompt 评测 — 新旧对比

**评测脚本**：`scripts/eval-research.ts`（原版走 `generateProposal` 链路 / 新版裸调 LLM）
**测试用例**：`请帮我制作一个30秒左右的科普视频，介绍人工智能如何改变医疗诊断，要有科技感，背景音乐舒缓一些`
**评测日志**：`log/eval/eval-2026-07-31T07-04-12-077Z/comparison.json`

## 指标对比

| 指标 | 旧版 (3533 字符) | 新版 (3745 字符) | 差异 |
|---|---|---|---|
| 耗时 | 44.9s | 18s | -59.9% |
| Token 总计 | 3250 | 2803 | -13.8% |
| 费用 | $0.00148 | $0.00109 | -26.1% |
| 重试次数 | 1 | 0 | - |

## 输出结构对比

| 项 | 旧版 | 新版 |
|---|---|---|
| 顶层键 | `metadata` / `contentSkeleton` / `styleProfile` / `characterAnalysis` / `readiness` | `user_text` / `user_demand` / `content_readiness_assessment` |
| 用户要求提取 | `metadata.userDemand`（拼接字符串） | `user_demand.demands[]`（按 category 分类的结构化条目 + summary） |
| 就绪度 | `readiness.overallScore`（0-100）+ 5 维 numeric | `content_readiness_assessment.overallScore` + 6 维 `{score, comment}` + `strengths/weaknesses/recommendation` |
| 内容结构 | `contentSkeleton.segments[]`（强制拆段） | 无分段；保留原文 `user_text` |

## 质量结论

- **旧版**：把一句需求陈述强行当成完整内容分析，造出了 1 个 segment、narrative flow、professional tone，readiness 给了 20 分——对低质量输入存在"脑补"虚假结构的问题（本轮评测 retries=1，即发生过解析/校验重试）。
- **新版**：如实反映——`hasExplicitDemand: true` 正确提取 4 条需求（时长/主题/风格/BGM）；`overallScore: 5, level: insufficient`，6 维全部 0 分（因为输入只是需求陈述、无实质内容）；`weaknesses` 精准指出 4 个问题。
- **结论**：新版更诚实、更快更省，对低质量输入不会被 LLM 强行脑补出虚假结构，建议采用。
