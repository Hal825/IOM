import { buildPipelineConversation } from '@/lib/prompts/pipeline';
import type { ResearchReport, Proposal, VideoScript } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';
import { extractJsonObject } from './http';
import { callChatCompletion, withRetry } from './llm';

/**
 * Script 工具 — 基于 Proposal + ResearchReport 调用 LLM 生成逐镜头生产脚本。
 *
 * 策略：
 * 1. 用 buildPipelineConversation 构造追加式对话（[0..7]：proposal 的完整前缀 + TASK_SCRIPT），
 *    命中 research/proposal 轮缓存；styleHint 必须与 proposal 轮传同一值（保持前缀一致）。
 * 2. 要求返回 VideoScript JSON（四子脚本），轻量结构校验 → 不合法则重试（最多 3 次，指数退避）。
 */

// ── 配置（三文本节点共用 LLM_TEXT_*，前缀一致的前提）──

const LLM_TEXT_API_KEY = process.env.LLM_TEXT_API_KEY;
const LLM_TEXT_BASE_URL = process.env.LLM_TEXT_BASE_URL;
const LLM_TEXT_MODEL = process.env.LLM_TEXT_MODEL;

const MAX_TOKENS = 24000;

// ── 类型 ────────────────────────────────────────────

export interface ScriptResult {
  script: VideoScript;
  model: string;
  retries: number;
  tokenUsage?: TokenUsage;
}

// ── JSON 解析 + 结构校验 ───────────────────────────

export function parseAndValidateScript(raw: string): VideoScript {
  const jsonStr = extractJsonObject(raw); // 找不到对象时直接抛错

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
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
    // C1：旧 schema 的 characterImageRefs 已由 appearCharId 取代（asset-gen 重构），
    // 幽灵校验会让每次 script_generation 必失败。改验真实契约字段 appearCharId。
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
    storyScript: { scenes: buildScene<VideoScript['storyScript']['scenes'][number]>(story) },// 这里的类型断言是安全的，因为我们已经在上面做了严格的校验
    storyboardScript: { scenes: buildScene<VideoScript['storyboardScript']['scenes'][number]>(board) },//
    audioScript: { scenes: buildScene<VideoScript['audioScript']['scenes'][number]>(audio) },
    pacingScript: { scenes: buildScene<VideoScript['pacingScript']['scenes'][number]>(pacing) },
  };
}

// ── 公开 API ────────────────────────────────────────

/**
 * 基于 Proposal + ResearchReport 生成逐镜头生产脚本。
 * 零容错：API Key 未配置或调用失败直接抛异常。
 */
export async function generateScript(
  proposal: Proposal,
  researchReport: ResearchReport | null,
  userPrompt: string,
  styleHint?: string
): Promise<ScriptResult> {
  if (!LLM_TEXT_API_KEY || !LLM_TEXT_BASE_URL || !LLM_TEXT_MODEL) {
    throw new Error('文本 LLM 环境变量未配置（LLM_TEXT_API_KEY / LLM_TEXT_BASE_URL / LLM_TEXT_MODEL）');
  }

  const messages = buildPipelineConversation({ userPrompt, styleHint, researchReport, proposal });

  const { result, retries } = await withRetry(
    async () => {
      const { content, usage } = await callChatCompletion({
        apiKey: LLM_TEXT_API_KEY,
        baseUrl: LLM_TEXT_BASE_URL,
        model: LLM_TEXT_MODEL,
        messages,
        maxTokens: MAX_TOKENS,
        temperature: 0.6,
        label: 'script',
      });
      const script = parseAndValidateScript(content);
      return { ...script, usage };
    },
    { label: 'script' }
  );

  console.log(
    `[script] ${LLM_TEXT_MODEL} 生成完成：` +
      `${result.storyboardScript.scenes.length} 个镜头脚本` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    script: {
      storyScript: result.storyScript,
      storyboardScript: result.storyboardScript,
      audioScript: result.audioScript,
      pacingScript: result.pacingScript,
    },
    model: LLM_TEXT_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
