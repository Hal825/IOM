import { PROPOSAL_SYSTEM } from '@/lib/prompts/proposal';
import type { ResearchReport, Proposal } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

/**
 * Proposal 工具 — 基于 ResearchReport 调用 LLM 生成视频制作提案。
 *
 * 策略（与 ai-script-generator.ts 一致）：
 * 1. 调用 AI API，要求返回 Proposal JSON
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 * 3. 全部失败时回退到规则生成（fallbackProposal）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const PROPOSAL_API_KEY = process.env.PROPOSAL_API_KEY;
const PROPOSAL_BASE_URL = process.env.PROPOSAL_BASE_URL;
const PROPOSAL_LLM_MODEL = process.env.PROPOSAL_LLM_MODEL;
const PROPOSAL_DEFAULT_DURATION_PER_SCENE =
  Number(process.env.PROPOSAL_DEFAULT_DURATION_PER_SCENE) || 8;
const PROPOSAL_MAX_SCENES =
  Number(process.env.PROPOSAL_MAX_SCENES) || 15;

const MAX_RETRIES = 3;
const MAX_TOKENS = 3000;

// ── 类型 ────────────────────────────────────────────

export interface ProposalResult {
  proposal: Proposal;
  model: string;
  retries: number;
  tokenUsage?: TokenUsage;
}

interface ChatResponse {
  choices: Array<{
    message: { content: string };
  }>;
  usage?: TokenUsage;
}

// ── JSON 解析 + 结构校验 ───────────────────────────

function isValidAspectRatio(v: unknown): v is Proposal['blueprint']['aspectRatio'] {// 校验宽高比
  return typeof v === 'string' && ['16:9', '9:16', '1:1'].includes(v);
}

function isValidTextPosition(v: unknown): v is 'center' | 'top' | 'bottom' {// 校验文本位置
  return typeof v === 'string' && ['center', 'top', 'bottom'].includes(v);
}

function isValidAnimation(v: unknown): v is 'fade' | 'slide' | 'typing' | 'none' {// 校验动画类型
  return typeof v === 'string' && ['fade', 'slide', 'typing', 'none'].includes(v);
}

function isValidTransitions(v: unknown): v is 'smooth' | 'cut' | 'zoom' {// 校验过渡效果
  return typeof v === 'string' && ['smooth', 'cut', 'zoom'].includes(v);
}

function isValidRiskLevel(v: unknown): v is 'low' | 'medium' | 'high' {// 校验风险等级
  return typeof v === 'string' && ['low', 'medium', 'high'].includes(v);
}

function parseAndValidateProposal(raw: string): Proposal {// 解析 LLM 输出的 Proposal JSON，并进行结构校验
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('[proposal] 响应中未找到 JSON 对象');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('[proposal] JSON 解析失败');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('[proposal] 输出不是有效对象');
  }

  const obj = parsed as Record<string, unknown>;

  // ── blueprint 校验 ──
  const blueprint = obj.blueprint as Record<string, unknown> | undefined;
  if (!blueprint) throw new Error('[proposal] blueprint 缺失');
  if (typeof blueprint.title !== 'string' || !blueprint.title.trim()) {
    throw new Error('[proposal] blueprint.title 缺失');
  }
  if (typeof blueprint.totalDuration !== 'number') {
    throw new Error('[proposal] blueprint.totalDuration 缺失');
  }
  if (typeof blueprint.sceneCount !== 'number') {
    throw new Error('[proposal] blueprint.sceneCount 缺失');
  }
  if (!isValidAspectRatio(blueprint.aspectRatio)) {
    throw new Error(`[proposal] blueprint.aspectRatio 无效: ${blueprint.aspectRatio}`);
  }

  // ── shotScript 校验 ──
  const shotScript = obj.shotScript as unknown[];
  if (!Array.isArray(shotScript) || shotScript.length === 0) {
    throw new Error('[proposal] shotScript 缺失或为空');
  }

  for (let i = 0; i < shotScript.length; i++) {
    const shot = shotScript[i] as Record<string, unknown> | undefined;
    if (!shot) throw new Error(`[proposal] shotScript[${i}] 无效`);

    if (typeof shot.sceneId !== 'string' || !shot.sceneId.trim()) {
      throw new Error(`[proposal] shotScript[${i}].sceneId 缺失`);
    }
    if (typeof shot.duration !== 'number') {
      throw new Error(`[proposal] shotScript[${i}].duration 缺失`);
    }
    if (typeof shot.visualDescription !== 'string' || !shot.visualDescription.trim()) {
      throw new Error(`[proposal] shotScript[${i}].visualDescription 缺失`);
    }
    if (typeof shot.subtitleText !== 'string' || !shot.subtitleText.trim()) {
      throw new Error(`[proposal] shotScript[${i}].subtitleText 缺失`);
    }

    // layout 校验
    const layout = shot.layout as Record<string, unknown> | undefined;
    if (!layout) throw new Error(`[proposal] shotScript[${i}].layout 缺失`);
    if (!isValidTextPosition(layout.textPosition)) {
      throw new Error(`[proposal] shotScript[${i}].layout.textPosition 无效`);
    }
    if (typeof layout.backgroundColor !== 'string' || !layout.backgroundColor.trim()) {
      throw new Error(`[proposal] shotScript[${i}].layout.backgroundColor 缺失`);
    }
    if (!isValidAnimation(layout.animation)) {
      throw new Error(`[proposal] shotScript[${i}].layout.animation 无效`);
    }

    // audioTts 校验
    const audioTts = shot.audioTts as Record<string, unknown> | undefined;
    if (!audioTts) throw new Error(`[proposal] shotScript[${i}].audioTts 缺失`);
    if (typeof audioTts.text !== 'string' || !audioTts.text.trim()) {
      throw new Error(`[proposal] shotScript[${i}].audioTts.text 缺失`);
    }
    if (typeof audioTts.speed !== 'number') {
      throw new Error(`[proposal] shotScript[${i}].audioTts.speed 缺失`);
    }
    if (typeof audioTts.voice !== 'string' || !audioTts.voice.trim()) {
      throw new Error(`[proposal] shotScript[${i}].audioTts.voice 缺失`);
    }
  }

  // ── styleGuide 校验 ──
  const styleGuide = obj.styleGuide as Record<string, unknown> | undefined;
  if (!styleGuide) throw new Error('[proposal] styleGuide 缺失');
  if (typeof styleGuide.globalTone !== 'string' || !styleGuide.globalTone.trim()) {
    throw new Error('[proposal] styleGuide.globalTone 缺失');
  }
  if (!Array.isArray(styleGuide.colorPalette)) {
    throw new Error('[proposal] styleGuide.colorPalette 缺失');
  }
  if (typeof styleGuide.fontFamily !== 'string' || !styleGuide.fontFamily.trim()) {
    throw new Error('[proposal] styleGuide.fontFamily 缺失');
  }
  const bgMusic = styleGuide.backgroundMusic as Record<string, unknown> | undefined;
  if (!bgMusic || typeof bgMusic.style !== 'string' || !bgMusic.style.trim()) {
    throw new Error('[proposal] styleGuide.backgroundMusic 缺失');
  }
  if (!isValidTransitions(styleGuide.transitions)) {
    throw new Error(`[proposal] styleGuide.transitions 无效: ${styleGuide.transitions}`);
  }

  // ── feasibility 校验 ──
  const feasibility = obj.feasibility as Record<string, unknown> | undefined;
  if (!feasibility) throw new Error('[proposal] feasibility 缺失');
  if (!isValidRiskLevel(feasibility.riskLevel)) {
    throw new Error(`[proposal] feasibility.riskLevel 无效: ${feasibility.riskLevel}`);
  }
  if (typeof feasibility.estimatedRenderTime !== 'number') {
    throw new Error('[proposal] feasibility.estimatedRenderTime 缺失');
  }
  if (!Array.isArray(feasibility.suggestions)) {
    throw new Error('[proposal] feasibility.suggestions 缺失');
  }

  return parsed as Proposal;
}

// ── LLM API 调用 ────────────────────────────────────

async function callProposalLLM(
  researchReport: ResearchReport | null,
  userPrompt: string,
  styleHint?: string
): Promise<{ content: string; usage?: TokenUsage }> {
  if (!PROPOSAL_API_KEY || !PROPOSAL_BASE_URL || !PROPOSAL_LLM_MODEL) {
    throw new Error(
      'Proposal 环境变量未配置（PROPOSAL_API_KEY / PROPOSAL_BASE_URL / PROPOSAL_LLM_MODEL）'
    );
  }

  // 构建用户消息：优先使用 ResearchReport，否则用原始文本
  let userContent: string;
  if (researchReport) {
    userContent = `以下是对用户文本的调研分析报告（JSON 格式）：\n${JSON.stringify(researchReport, null, 2)}\n\n请基于以上报告生成视频制作方案。`;
  } else {
    userContent = `用户文本：\n${userPrompt}\n\n请基于以上文本直接生成视频制作方案（先自行分析文本结构）。`;
  }

  if (styleHint) {
    userContent += `\n\n用户偏好风格：${styleHint}`;
  }

  const resp = await fetch(`${PROPOSAL_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PROPOSAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: PROPOSAL_LLM_MODEL,
      messages: [
        { role: 'system', content: PROPOSAL_SYSTEM },
        { role: 'user', content: userContent },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.6,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(
      `Proposal API 返回 ${resp.status}: ${errText.slice(0, 200)}`
    );
  }

  const data = (await resp.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('Proposal API 返回空内容');
  }

  return { content, usage: data.usage };
}

// ── 指数退避重试 ────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<{ result: T; retries: number }> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { result, retries: attempt };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === maxRetries) break;

      const delay = Math.pow(2, attempt) * 1000;
      console.warn(
        `[proposal] 第 ${attempt + 1} 次失败: ${lastError.message}，` +
          `${delay / 1000}s 后重试...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error('[proposal] 未知错误');
}

// ── 规则兜底 ────────────────────────────────────────

const FALLBACK_COLORS = ['#0a1628', '#1a1a2e', '#16213e', '#0f3460', '#1a1a3e'];

/**
 * 基于规则生成 Proposal。
 * 不调用任何 API，纯本地处理。
 */
function fallbackProposal(
  report: ResearchReport | null,
  userPrompt: string
): Proposal {
  // 如果有调研报告，从 segments 生成；否则拆分原始文本
  const segments = report?.contentSkeleton.segments;
  const tone = report?.styleProfile.tone ?? 'professional';

  let sceneEntries: Array<{ text: string; title: string; summary: string }>;

  if (segments && segments.length > 0) {
    sceneEntries = segments.map((seg) => ({
      text: seg.originalText,
      title: seg.title,
      summary: seg.summary,
    }));
  } else {
    // 回退：按句子拆分原始文本
    const sentences = userPrompt
      .split(/(?<=[。！？；.!?;])/)
      .filter((s) => s.trim().length > 0);
    // 限制场景数
    const limited = sentences.slice(0, PROPOSAL_MAX_SCENES);
    sceneEntries = limited.map((s, i) => ({
      text: s.trim(),
      title: `段落 ${i + 1}`,
      summary: s.trim().slice(0, 30),
    }));
  }

  const durationPerScene =
    Number(process.env.PROPOSAL_DEFAULT_DURATION_PER_SCENE) || 8;

  const shotScript: Proposal['shotScript'] = sceneEntries.map((entry, i) => ({
    sceneId: `shot-${i + 1}`,
    duration: durationPerScene,
    visualDescription: `Abstract background with modern design, cinematic composition, suitable for ${entry.title}`,
    layout: {
      textPosition: 'center' as const,
      backgroundColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      animation: 'fade' as const,
    },
    subtitleText: entry.summary.slice(0, 30),
    audioTts: {
      text: entry.text,
      speed: 1.0,
      voice: 'zh-CN-XiaoxiaoNeural',
    },
  }));

  const toneMap: Record<string, string> = {
    professional: '专业商务风格',
    lively: '轻松活泼风格',
    serious: '严肃庄重风格',
    inspirational: '激励鼓舞风格',
    minimal: '简洁极简风格',
  };

  return {
    blueprint: {
      title: report?.metadata.topic ?? '视频制作',
      totalDuration: shotScript.length * durationPerScene,
      sceneCount: shotScript.length,
      aspectRatio: '16:9',
    },
    shotScript,
    styleGuide: {
      globalTone: toneMap[tone] ?? tone,
      colorPalette: FALLBACK_COLORS,
      fontFamily: 'sans-serif',
      backgroundMusic: {
        style: report?.styleProfile.suggestedBGM ?? 'ambient instrumental',
      },
      transitions: 'smooth',
    },
    feasibility: {
      riskLevel:
        shotScript.length <= 5 ? 'low' :
        shotScript.length <= 10 ? 'medium' : 'high',
      estimatedRenderTime: shotScript.length * durationPerScene * 1.5,
      suggestions: [],
    },
  };
}

// ── 公开 API ────────────────────────────────────────

/**
 * 基于 ResearchReport 生成视频制作提案。
 * - 已配置 API Key → 调用 LLM，失败回退规则生成
 * - 未配置 → 直接走规则生成
 */
export async function generateProposal(
  report: ResearchReport | null,//调研报告（可为 null）
  userPrompt: string,//用户原始文本
  styleHint?: string//用户偏好风格提示（可选）
): Promise<ProposalResult> {
  // 未配置 API Key → 静默回退
  if (!PROPOSAL_API_KEY) {
    console.log('[proposal] 未配置 PROPOSAL_API_KEY，使用规则生成');
    return {
      proposal: fallbackProposal(report, userPrompt),
      model: 'rule-based',
      retries: 0,
    };
  }

  try {// 调用 LLM 生成 Proposal
    const { result, retries } = await withRetry(async () => {
      const { content, usage } = await callProposalLLM(
        report,//调研报告
        userPrompt,//用户原始文本
        styleHint//用户偏好风格提示
      );
      const proposal = parseAndValidateProposal(content);//解析并校验 Proposal
      return { ...proposal, usage };//返回 Proposal 和 token 使用情况
    });

    console.log(
      `[proposal] ${PROPOSAL_LLM_MODEL} 生成完成：` +
        `${result.blueprint.sceneCount} 个镜头，` +
        `${result.blueprint.totalDuration}s` +
        (retries > 0 ? `（重试 ${retries} 次）` : '')
    );

    return {//返回最终结果
      proposal: {
        blueprint: result.blueprint,//蓝图信息
        shotScript: result.shotScript,//镜头脚本
        styleGuide: result.styleGuide,//风格指南
        feasibility: result.feasibility,//可行性分析
      },
      model: PROPOSAL_LLM_MODEL!,//使用的 LLM 模型
      retries,//重试次数
      tokenUsage: result.usage,//token 使用情况
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);//获取错误信息
    console.error(`[proposal] 失败，回退规则生成: ${message}`);

    return {
      proposal: fallbackProposal(report, userPrompt),//回退到规则生成
      model: `fallback(${PROPOSAL_LLM_MODEL ?? 'unknown'})`,//标记为回退模型
      retries: MAX_RETRIES,//最大重试次数
    };
  }
}
