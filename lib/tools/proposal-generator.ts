import { PROPOSAL_SYSTEM } from '@/lib/prompts/proposal';
import type { ResearchReport, Proposal, Character } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

/**
 * Proposal 工具 — 基于 ResearchReport 调用 LLM 生成视频制作提案。
 *
 * 策略：
 * 1. 调用 AI API，要求返回 Proposal JSON
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 * 3. 全部失败时回退到规则生成（fallbackProposal）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const PROPOSAL_API_KEY = process.env.PROPOSAL_API_KEY;
const PROPOSAL_BASE_URL = process.env.PROPOSAL_BASE_URL;
const PROPOSAL_LLM_MODEL = process.env.PROPOSAL_LLM_MODEL;
const MAX_RETRIES = 3;
const MAX_TOKENS = 20000;

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

function isValidAspectRatio(v: unknown): v is Proposal['blueprint']['aspectRatio'] {
  return typeof v === 'string' && ['16:9', '9:16', '1:1'].includes(v);
}

function isValidTextPosition(v: unknown): v is 'center' | 'top' | 'bottom' {
  return typeof v === 'string' && ['center', 'top', 'bottom'].includes(v);
}

function isValidAnimation(v: unknown): v is 'fade' | 'slide' | 'typing' | 'none' {
  return typeof v === 'string' && ['fade', 'slide', 'typing', 'none'].includes(v);
}

function isValidTransitions(v: unknown): v is 'smooth' | 'cut' | 'zoom' {
  return typeof v === 'string' && ['smooth', 'cut', 'zoom'].includes(v);
}

function isValidRiskLevel(v: unknown): v is 'low' | 'medium' | 'high' {
  return typeof v === 'string' && ['low', 'medium', 'high'].includes(v);
}

function isValidTransitionType(v: unknown): v is 'none' | 'fade' | 'zoom' | 'pan' | 'slide' | 'cut' {
  return typeof v === 'string' &&
    ['none', 'fade', 'zoom', 'pan', 'slide', 'cut'].includes(v);
}

function toTransitionType(v: unknown): 'none' | 'fade' | 'zoom' | 'pan' | 'slide' | 'cut' {
  return isValidTransitionType(v) ? v : 'cut';
}

function parseAndValidateProposal(raw: string): Proposal {
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
    // summary 校验（新字段，替代 visualDescription）
    if (typeof shot.summary !== 'string' || !shot.summary.trim()) {
      throw new Error(`[proposal] shotScript[${i}].summary 缺失`);
    }
    if (typeof shot.subtitleText !== 'string' || !shot.subtitleText.trim()) {
      throw new Error(`[proposal] shotScript[${i}].subtitleText 缺失`);
    }

    // transition 校验（新字段，必需）
    const transition = shot.transition as Record<string, unknown> | undefined;
    if (!transition) throw new Error(`[proposal] shotScript[${i}].transition 缺失`);

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

  // ── characters 校验（可选）──
  let characters: Character[] | undefined;
  if (obj.characters && Array.isArray(obj.characters)) {
    const chars = obj.characters as unknown[];
    characters = [];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i] as Record<string, unknown> | undefined;
      if (!c) continue;
      if (typeof c.characterId !== 'string' || !c.characterId.trim()) continue;
      if (typeof c.name !== 'string' || !c.name.trim()) continue;
      if (typeof c.appearance !== 'string' || !c.appearance.trim()) continue;

      characters.push({
        characterId: c.characterId as string,
        name: c.name as string,
        appearance: c.appearance as string,
        role: (typeof c.role === 'string' ? c.role : '角色') as string,
        appearsInScenes: (Array.isArray(c.appearsInScenes)
          ? c.appearsInScenes.filter((s): s is string => typeof s === 'string')
          : []) as string[],
      });
    }
    if (characters.length === 0) characters = undefined;
  }

  // ── videoGen 校验（可选）──
  let videoGen: Proposal['videoGen'] | undefined;
  if (obj.videoGen && typeof obj.videoGen === 'object') {
    const vg = obj.videoGen as Record<string, unknown>;
    videoGen = {
      style: (typeof vg.style === 'string' ? vg.style : 'cinematic documentary') as string,
      duration: (typeof vg.duration === 'number' ? vg.duration : blueprint.totalDuration) as number,
    };
  }

  // ── extraction 校验（新字段，兼容旧格式）──
  const extraction: Proposal['extraction'] = (() => {
    const extr = obj.extraction as Record<string, unknown> | undefined;
    const rawScenes = Array.isArray(extr?.rawScenes)
      ? extr.rawScenes.map((r) => {
          const rs = r as Record<string, unknown>;
          return {
            id: (rs.id as string) ?? '',
            content: (rs.content as string) ?? '',
          };
        }).filter((r) => r.id && r.content)
      : [];
    return { rawScenes };
  })();

  // ── optimizationLog 校验（新字段，兼容旧格式）──
  const optimizationLog: Proposal['optimizationLog'] = Array.isArray(obj.optimizationLog)
    ? obj.optimizationLog.map((o) => {
        const entry = o as Record<string, unknown>;
        const result: Proposal['optimizationLog'][number] = {
          action: ((entry.action as string) ?? 'keep') as Proposal['optimizationLog'][number]['action'],
        };
        if (entry.sourceId) result.sourceId = entry.sourceId as string;
        if (entry.sourceIds && Array.isArray(entry.sourceIds)) {
          result.sourceIds = (entry.sourceIds as unknown[]).filter((s): s is string => typeof s === 'string');
        }
        if (entry.mergedContent) result.mergedContent = entry.mergedContent as string;
        if (entry.revisedContent) result.revisedContent = entry.revisedContent as string;
        if (entry.addedContent) result.addedContent = entry.addedContent as string;
        if (entry.reason) result.reason = entry.reason as string;
        return result;
      })
    : [];

  // ── _expansionApplied 校验（新字段，兼容旧格式）──
  const _expansionApplied: Proposal['_expansionApplied'] = (() => {
    const ea = obj._expansionApplied as Record<string, unknown> | null | undefined;
    if (!ea) return null;
    return {
      expansions: Array.isArray(ea.expansions)
        ? ea.expansions.filter((e): e is string => typeof e === 'string')
        : [],
      reason: (ea.reason as string) ?? '',
    };
  })();

  // ── 构建并返回 ──
  return {
    blueprint: {
      title: blueprint.title as string,
      totalDuration: blueprint.totalDuration as number,
      sceneCount: blueprint.sceneCount as number,
      aspectRatio: blueprint.aspectRatio as Proposal['blueprint']['aspectRatio'],
    },
    shotScript: shotScript.map((s) => {
      const shot = s as Record<string, unknown>;
      const layout = shot.layout as Record<string, unknown>;
      const transition = shot.transition as Record<string, unknown> | undefined;
      return {
        sceneId: shot.sceneId as string,
        duration: shot.duration as number,
        summary: shot.summary as string,
        layout: {
          textPosition: layout.textPosition as 'center' | 'top' | 'bottom',
          backgroundColor: layout.backgroundColor as string,
          animation: layout.animation as 'fade' | 'slide' | 'typing' | 'none',
        },
        subtitleText: shot.subtitleText as string,
        transition: {
          from: {
            sceneId: (transition?.from as Record<string, unknown> | null)?.sceneId as string | null ?? null,
            type: toTransitionType((transition?.from as Record<string, unknown> | null)?.type),
            visualLink: ((transition?.from as Record<string, unknown> | null)?.visualLink as string) ?? '',
          },
          to: {
            sceneId: (transition?.to as Record<string, unknown> | null)?.sceneId as string | null ?? null,
            type: toTransitionType((transition?.to as Record<string, unknown> | null)?.type),
            visualLink: ((transition?.to as Record<string, unknown> | null)?.visualLink as string) ?? '',
          },
        },
        cast: Array.isArray(shot.cast)
          ? shot.cast.filter((c): c is string => typeof c === 'string')
          : [],
      };
    }),
    extraction,
    optimizationLog,
    styleGuide: {
      globalTone: styleGuide.globalTone as string,
      colorPalette: styleGuide.colorPalette as string[],
      fontFamily: styleGuide.fontFamily as string,
      backgroundMusic: {
        style: (bgMusic.style as string) ?? 'ambient',
        source: bgMusic.source as string | undefined,
      },
      transitions: styleGuide.transitions as 'smooth' | 'cut' | 'zoom',
    },
    feasibility: {
      riskLevel: feasibility.riskLevel as 'low' | 'medium' | 'high',
      estimatedRenderTime: feasibility.estimatedRenderTime as number,
      suggestions: feasibility.suggestions as string[],
    },
    characters,
    videoGen,
    _expansionApplied,
  };
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

// ── 公开 API ────────────────────────────────────────

/**
 * 基于 ResearchReport 生成视频制作提案。
 * 零容错：API Key 未配置或调用失败直接抛异常。
 */
export async function generateProposal(
  report: ResearchReport | null,
  userPrompt: string,
  styleHint?: string
): Promise<ProposalResult> {
  if (!PROPOSAL_API_KEY || !PROPOSAL_BASE_URL || !PROPOSAL_LLM_MODEL) {
    throw new Error('Proposal 环境变量未配置（PROPOSAL_API_KEY / PROPOSAL_BASE_URL / PROPOSAL_LLM_MODEL）');
  }

  const { result, retries } = await withRetry(async () => {
    const { content, usage } = await callProposalLLM(report, userPrompt, styleHint);
    const proposal = parseAndValidateProposal(content);
    return { ...proposal, usage };
  });

  const charInfo = result.characters?.length
    ? `, ${result.characters.length} 个角色`
    : '';

  console.log(
    `[proposal] ${PROPOSAL_LLM_MODEL} 生成完成：` +
      `${result.blueprint.sceneCount} 个镜头，` +
      `${result.blueprint.totalDuration}s${charInfo}` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    proposal: {
      blueprint: result.blueprint,
      shotScript: result.shotScript,
      extraction: result.extraction,
      optimizationLog: result.optimizationLog,
      styleGuide: result.styleGuide,
      feasibility: result.feasibility,
      characters: result.characters,
      videoGen: result.videoGen,
      _expansionApplied: result._expansionApplied,
    },
    model: PROPOSAL_LLM_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
