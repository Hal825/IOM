import { SCRIPT_SYSTEM } from '@/lib/prompts/script-generation';
import type { ResearchReport, Proposal, VideoScript } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

// ── 生成后处理（需求传递 / 转场策略）─────────────────

/** 分辨率档位 → 各比例下的规格（宽x高）。档位小写 key。 */
const RESOLUTION_TIERS: Record<string, { sizes: Record<string, string> }> = {
  '480p': { sizes: { '16:9': '854x480', '9:16': '480x854', '1:1': '480x480' } },
  '720p': { sizes: { '16:9': '1280x720', '9:16': '720x1280', '1:1': '720x720' } },
  '1080p': { sizes: { '16:9': '1920x1080', '9:16': '1080x1920', '1:1': '1080x1080' } },
  '2k': { sizes: { '16:9': '2560x1440', '9:16': '1440x2560', '1:1': '1440x1440' } },
  '4k': { sizes: { '16:9': '3840x2160', '9:16': '2160x3840', '1:1': '2160x2160' } },
};

const RESOLUTION_TIER_ORDER = ['4k', '2k', '1080p', '720p', '480p'] as const;

/** 从 research 需求中提取分辨率档位（如 '480p'），无则返回 null */
export function extractResolutionDemand(researchReport: ResearchReport | null): string | null {
  if (!researchReport) return null;
  for (const d of researchReport.user_demand.demands) {
    const text = `${d.description} ${d.originalPhrase}`.toLowerCase();
    for (const tier of RESOLUTION_TIER_ORDER) {
      if (text.includes(tier)) return tier;
    }
  }
  return null;
}

/**
 * 脚本生成后处理（确定性，覆盖 LLM 输出）：
 * 1. 分辨率需求传递：research 提取了分辨率档位（如 480p）→ 按 aspectRatio 覆盖 storyboard 各镜头 resolution
 * 2. 取消边界淡入淡出：首镜头 transitionIn、末镜头 transitionOut 强制为 cut（手机随拍等风格用硬切）
 */
export function applyPostProcess(
  script: VideoScript,
  proposal: Proposal,
  researchReport: ResearchReport | null
): VideoScript {
  // 1) 分辨率需求 → 覆盖 storyboard
  const tier = extractResolutionDemand(researchReport);
  const resolved = tier ? RESOLUTION_TIERS[tier]?.sizes[proposal.blueprint.aspectRatio] : undefined;
  if (resolved) {
    for (const b of script.storyboardScript.scenes) {
      b.resolution = resolved;
    }
  }

  // 2) 取消边界 fade
  const pacing = script.pacingScript.scenes;
  if (pacing.length > 0) {
    pacing[0].transitionIn = { type: 'cut', durationSec: 0 };
    pacing[pacing.length - 1].transitionOut = { type: 'cut', durationSec: 0 };
  }

  return script;
}

/**
 * Script 工具 — 基于 Proposal + ResearchReport 调用 LLM 生成逐镜头生产脚本。
 *
 * 策略：
 * 1. 调用 AI API，要求返回 VideoScript JSON（新版四子脚本：storyScript / storyboardScript / audioScript / pacingScript）
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const SCRIPT_API_KEY = process.env.SCRIPT_API_KEY;
const SCRIPT_BASE_URL = process.env.SCRIPT_BASE_URL;
const SCRIPT_LLM_MODEL = process.env.SCRIPT_LLM_MODEL;

const MAX_RETRIES = 3;
const MAX_TOKENS = 24000;

// ── 类型 ────────────────────────────────────────────

export interface ScriptResult {
  script: VideoScript;
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

function parseAndValidateScript(raw: string): VideoScript {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('[script] 响应中未找到 JSON 对象');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('[script] JSON 解析失败');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('[script] 输出不是有效对象');
  }

  const obj = parsed as Record<string, unknown>;

  // ── 四子脚本：顶层键存在性 ──
  const subKeys = ['storyScript', 'storyboardScript', 'audioScript', 'pacingScript'] as const;
  for (const key of subKeys) {
    if (!obj[key] || typeof obj[key] !== 'object') {
      throw new Error(`[script] ${key} 缺失或无效`);
    }
  }

  const story = (obj.storyScript as Record<string, unknown>).scenes as unknown[] | undefined;
  const board = (obj.storyboardScript as Record<string, unknown>).scenes as unknown[] | undefined;
  const audio = (obj.audioScript as Record<string, unknown>).scenes as unknown[] | undefined;
  const pacing = (obj.pacingScript as Record<string, unknown>).scenes as unknown[] | undefined;

  if (!Array.isArray(story) || story.length === 0) throw new Error('[script] storyScript.scenes 缺失或为空');
  if (!Array.isArray(board) || board.length !== story.length) {
    throw new Error(`[script] storyboardScript.scenes 长度(${board?.length}) ≠ storyScript(${story.length})`);
  }
  if (!Array.isArray(audio) || audio.length !== story.length) {
    throw new Error(`[script] audioScript.scenes 长度(${audio?.length}) ≠ storyScript(${story.length})`);
  }
  if (!Array.isArray(pacing) || pacing.length !== story.length) {
    throw new Error(`[script] pacingScript.scenes 长度(${pacing?.length}) ≠ storyScript(${story.length})`);
  }

  const sceneIds = story.map((s) => (s as Record<string, unknown>).sceneId);
  for (const [name, arr] of [['storyboardScript', board], ['audioScript', audio], ['pacingScript', pacing]] as const) {
    const ids = arr.map((s) => (s as Record<string, unknown>).sceneId);
    if (JSON.stringify(ids) !== JSON.stringify(sceneIds)) {
      throw new Error(`[script] ${name}.scenes 的 sceneId 与 storyScript 不一致`);
    }
  }

  // ── 逐镜校验 ──
  for (let i = 0; i < story.length; i++) {
    const st = story[i] as Record<string, unknown> | undefined;
    if (!st) throw new Error(`[script] storyScript.scenes[${i}] 无效`);
    if (typeof st.sceneId !== 'string' || !st.sceneId.trim()) {
      throw new Error(`[script] storyScript.scenes[${i}].sceneId 缺失`);
    }
    if (typeof st.sceneDescription !== 'string' || !st.sceneDescription.trim()) {
      throw new Error(`[script] storyScript.scenes[${i}].sceneDescription 缺失`);
    }
    if (!Array.isArray(st.characters)) {
      throw new Error(`[script] storyScript.scenes[${i}].characters 缺失`);
    }

    const b = board[i] as Record<string, unknown> | undefined;
    if (!b) throw new Error(`[script] storyboardScript.scenes[${i}] 无效`);
    const rRefs = b.resourceRefs as Record<string, unknown> | undefined;
    if (!rRefs || typeof rRefs.sceneImageRef !== 'string' || !rRefs.sceneImageRef.trim()) {
      throw new Error(`[script] storyboardScript.scenes[${i}].resourceRefs.sceneImageRef 缺失`);
    }
    if (!Array.isArray(b.appearCharId)) {
      throw new Error(`[script] storyboardScript.scenes[${i}].appearCharId 缺失`);
    }
    const shot = b.shot as Record<string, unknown> | undefined;
    if (!shot || typeof shot.type !== 'string' || !shot.type.trim()) {
      throw new Error(`[script] storyboardScript.scenes[${i}].shot.type 缺失`);
    }
    if (typeof b.motionLevel !== 'number' || b.motionLevel < 1 || b.motionLevel > 5) {
      throw new Error(`[script] storyboardScript.scenes[${i}].motionLevel 无效`);
    }
    if (typeof b.negativePrompt !== 'string') {
      throw new Error(`[script] storyboardScript.scenes[${i}].negativePrompt 缺失`);
    }

    const a = audio[i] as Record<string, unknown> | undefined;
    if (!a) throw new Error(`[script] audioScript.scenes[${i}] 无效`);
    if (a.dialogue !== null && !Array.isArray(a.dialogue)) {
      throw new Error(`[script] audioScript.scenes[${i}].dialogue 无效`);
    }
    if (!Array.isArray(a.sfx)) {
      throw new Error(`[script] audioScript.scenes[${i}].sfx 缺失`);
    }
    if (!a.bgm || typeof a.bgm !== 'object') {
      throw new Error(`[script] audioScript.scenes[${i}].bgm 缺失`);
    }

    const p = pacing[i] as Record<string, unknown> | undefined;
    if (!p) throw new Error(`[script] pacingScript.scenes[${i}] 无效`);
    if (typeof p.duration !== 'number' || p.duration <= 0) {
      throw new Error(`[script] pacingScript.scenes[${i}].duration 缺失`);
    }
    if (!p.transitionIn || typeof p.transitionIn !== 'object') {
      throw new Error(`[script] pacingScript.scenes[${i}].transitionIn 缺失`);
    }
    if (!p.transitionOut || typeof p.transitionOut !== 'object') {
      throw new Error(`[script] pacingScript.scenes[${i}].transitionOut 缺失`);
    }
  }

  // ── 构建并返回 ──
  const buildScene = <T>(arr: unknown[]): T[] =>
    arr.map((s) => s as T);

  return {
    storyScript: { scenes: buildScene<VideoScript['storyScript']['scenes'][number]>(story) },
    storyboardScript: { scenes: buildScene<VideoScript['storyboardScript']['scenes'][number]>(board) },
    audioScript: { scenes: buildScene<VideoScript['audioScript']['scenes'][number]>(audio) },
    pacingScript: { scenes: buildScene<VideoScript['pacingScript']['scenes'][number]>(pacing) },
  };
}

// ── LLM API 调用 ────────────────────────────────────

async function callScriptLLM(
  proposal: Proposal,
  researchReport: ResearchReport | null,
  userPrompt: string
): Promise<{ content: string; usage?: TokenUsage }> {
  if (!SCRIPT_API_KEY || !SCRIPT_BASE_URL || !SCRIPT_LLM_MODEL) {
    throw new Error(
      'Script 环境变量未配置（SCRIPT_API_KEY / SCRIPT_BASE_URL / SCRIPT_LLM_MODEL）'
    );
  }

  const contextParts = [
    `## 用户原始文本\n${userPrompt}`,
    `## 调研报告\n${JSON.stringify(researchReport, null, 2)}`,
    `## 视频提案\n${JSON.stringify(proposal, null, 2)}`,
  ];
  const userContent = contextParts.join('\n\n');

  const resp = await fetch(`${SCRIPT_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SCRIPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: SCRIPT_LLM_MODEL,
      messages: [
        { role: 'system', content: SCRIPT_SYSTEM },
        { role: 'user', content: userContent },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.6,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(
      `Script API 返回 ${resp.status}: ${errText.slice(0, 200)}`
    );
  }

  const data = (await resp.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('Script API 返回空内容');
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
        `[script] 第 ${attempt + 1} 次失败: ${lastError.message}，` +
          `${delay / 1000}s 后重试...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error('[script] 未知错误');
}

// ── 公开 API ────────────────────────────────────────

/**
 * 基于 Proposal + ResearchReport 生成逐镜头生产脚本。
 * 零容错：API Key 未配置或调用失败直接抛异常。
 */
export async function generateScript(
  proposal: Proposal,
  researchReport: ResearchReport | null,
  userPrompt: string
): Promise<ScriptResult> {
  if (!SCRIPT_API_KEY || !SCRIPT_BASE_URL || !SCRIPT_LLM_MODEL) {
    throw new Error('Script 环境变量未配置（SCRIPT_API_KEY / SCRIPT_BASE_URL / SCRIPT_LLM_MODEL）');
  }

  const { result, retries } = await withRetry(async () => {
    const { content, usage } = await callScriptLLM(proposal, researchReport, userPrompt);
    const script = parseAndValidateScript(content);
    return { ...script, usage };
  });

  console.log(
    `[script] ${SCRIPT_LLM_MODEL} 生成完成：` +
      `${result.storyboardScript.scenes.length} 个镜头脚本` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    script: applyPostProcess(
      {
        storyScript: result.storyScript,
        storyboardScript: result.storyboardScript,
        audioScript: result.audioScript,
        pacingScript: result.pacingScript,
      },
      proposal,
      researchReport
    ),
    model: SCRIPT_LLM_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
