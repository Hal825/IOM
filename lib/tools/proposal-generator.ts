import { PROPOSAL_SYSTEM } from '@/lib/prompts/proposal';
import type { ResearchReport, Proposal, Character } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';
import { fetchWithTimeout, extractJsonObject } from './http';

/**
 * Proposal 工具 — 基于 ResearchReport 调用 LLM 生成视频制作提案。
 *
 * 策略：
 * 1. 调用 AI API，要求返回 Proposal JSON（新版结构：characters / blueprint / sceneVisuals / styleProfile）
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
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

function isValidTone(v: unknown): v is Proposal['styleProfile']['tone'] {
  return typeof v === 'string' &&
    ['professional', 'lively', 'serious', 'inspirational', 'minimal'].includes(v);
}

function parseAndValidateProposal(raw: string): Proposal {
  const jsonStr = extractJsonObject(raw); // 找不到对象时直接抛错

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
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
  if (!isValidAspectRatio(blueprint.aspectRatio)) {
    throw new Error(`[proposal] blueprint.aspectRatio 无效: ${blueprint.aspectRatio}`);
  }

  // ── characters 校验（可为空数组）──
  const characters: Character[] = [];
  if (obj.characters !== undefined && !Array.isArray(obj.characters)) {
    throw new Error('[proposal] characters 必须为数组');
  }
  const charsRaw = Array.isArray(obj.characters) ? (obj.characters as unknown[]) : [];
  for (let i = 0; i < charsRaw.length; i++) {
    const c = charsRaw[i] as Record<string, unknown> | undefined;
    if (!c) continue;
    if (typeof c.characterId !== 'string' || !c.characterId.trim()) {
      throw new Error(`[proposal] characters[${i}].characterId 缺失`);
    }
    if (typeof c.name !== 'string' || !c.name.trim()) {
      throw new Error(`[proposal] characters[${i}].name 缺失`);
    }
    if (typeof c.type !== 'string' || !['protagonist', 'supporting'].includes(c.type)) {
      throw new Error(`[proposal] characters[${i}].type 无效: ${c.type}`);
    }
    if (typeof c.appearance !== 'string' || !c.appearance.trim()) {
      throw new Error(`[proposal] characters[${i}].appearance 缺失`);
    }
    characters.push({
      characterId: c.characterId as string,
      name: c.name as string,
      type: c.type as 'protagonist' | 'supporting',
      appearance: c.appearance as string,
      personality: (typeof c.personality === 'string' ? c.personality : '') as string,
      role: (typeof c.role === 'string' ? c.role : '') as string,
    });
  }

  // ── sceneVisuals 校验 ──
  const sceneVisuals = obj.sceneVisuals as unknown[];
  if (!Array.isArray(sceneVisuals) || sceneVisuals.length === 0) {
    throw new Error('[proposal] sceneVisuals 缺失或为空');
  }

  const parsedSceneVisuals: Proposal['sceneVisuals'] = [];
  for (let i = 0; i < sceneVisuals.length; i++) {
    const sv = sceneVisuals[i] as Record<string, unknown> | undefined;
    if (!sv) throw new Error(`[proposal] sceneVisuals[${i}] 无效`);
    if (typeof sv.visualId !== 'string' || !sv.visualId.trim()) {
      throw new Error(`[proposal] sceneVisuals[${i}].visualId 缺失`);
    }
    if (typeof sv.description !== 'string' || !sv.description.trim()) {
      throw new Error(`[proposal] sceneVisuals[${i}].description 缺失`);
    }
    const scenes = Array.isArray(sv.scenes) ? (sv.scenes as unknown[]) : [];
    if (scenes.length === 0) {
      throw new Error(`[proposal] sceneVisuals[${i}].scenes 为空`);
    }
    const parsedScenes: Proposal['sceneVisuals'][number]['scenes'] = [];
    for (let j = 0; j < scenes.length; j++) {
      const sc = scenes[j] as Record<string, unknown> | undefined;
      if (!sc) throw new Error(`[proposal] sceneVisuals[${i}].scenes[${j}] 无效`);
      if (typeof sc.sceneId !== 'string' || !sc.sceneId.trim()) {
        throw new Error(`[proposal] sceneVisuals[${i}].scenes[${j}].sceneId 缺失`);
      }
      if (typeof sc.sceneDescription !== 'string' || !sc.sceneDescription.trim()) {
        throw new Error(`[proposal] sceneVisuals[${i}].scenes[${j}].sceneDescription 缺失`);
      }
      if (typeof sc.duration !== 'number') {
        throw new Error(`[proposal] sceneVisuals[${i}].scenes[${j}].duration 缺失`);
      }
      if (!Array.isArray(sc.appearCharId)) {
        throw new Error(`[proposal] sceneVisuals[${i}].scenes[${j}].appearCharId 缺失`);
      }
      parsedScenes.push({
        sceneId: sc.sceneId as string,
        sceneDescription: sc.sceneDescription as string,
        appearCharId: sc.appearCharId as string[],
        duration: sc.duration as number,
      });
    }
    parsedSceneVisuals.push({
      visualId: sv.visualId as string,
      
      description: sv.description as string,
      visualHints: (typeof sv.visualHints === 'string' ? sv.visualHints : '') as string,
      scenes: parsedScenes,
    });
  }

  // ── styleProfile 校验 ──
  const styleProfile = obj.styleProfile as Record<string, unknown> | undefined;
  if (!styleProfile) throw new Error('[proposal] styleProfile 缺失');
  if (!isValidTone(styleProfile.tone)) {
    throw new Error(`[proposal] styleProfile.tone 无效: ${styleProfile.tone}`);
  }
  if (typeof styleProfile.visualStyle !== 'string' || !styleProfile.visualStyle.trim()) {
    throw new Error('[proposal] styleProfile.visualStyle 缺失');
  }
  if (typeof styleProfile.suggestedBGM !== 'string' || !styleProfile.suggestedBGM.trim()) {
    throw new Error('[proposal] styleProfile.suggestedBGM 缺失');
  }

  // ── 时长一致性校验 ──
  const totalSceneDuration = parsedSceneVisuals.reduce(
    (sum, sv) => sum + sv.scenes.reduce((s, sc) => s + sc.duration, 0),
    0
  );
  if (Math.abs(totalSceneDuration - (blueprint.totalDuration as number)) > 1) {
    throw new Error(
      `[proposal] scenes 时长合计 ${totalSceneDuration}s ≠ blueprint.totalDuration ${blueprint.totalDuration}s`
    );
  }

  // ── 构建并返回 ──
  return {
    characters,
    blueprint: {
      title: blueprint.title as string,
      totalDuration: blueprint.totalDuration as number,
      aspectRatio: blueprint.aspectRatio as Proposal['blueprint']['aspectRatio'],
    },
    sceneVisuals: parsedSceneVisuals,
    styleProfile: {
      tone: styleProfile.tone as Proposal['styleProfile']['tone'],
      visualStyle: styleProfile.visualStyle as string,
      suggestedBGM: styleProfile.suggestedBGM as string,
    },
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

  const resp = await fetchWithTimeout(`${PROPOSAL_BASE_URL}/chat/completions`, {
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

  const sceneCount = result.sceneVisuals.reduce((sum, sv) => sum + sv.scenes.length, 0);
  const charInfo = result.characters.length
    ? `, ${result.characters.length} 个角色`
    : '';

  console.log(
    `[proposal] ${PROPOSAL_LLM_MODEL} 生成完成：` +
      `${result.sceneVisuals.length} 个空间，${sceneCount} 个镜头，` +
      `${result.blueprint.totalDuration}s${charInfo}` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    proposal: {
      characters: result.characters,
      blueprint: result.blueprint,
      sceneVisuals: result.sceneVisuals,
      styleProfile: result.styleProfile,
    },
    model: PROPOSAL_LLM_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
