import { SCRIPT_SYSTEM } from '@/lib/prompts/script-generation';
import type { ResearchReport, Proposal, VideoScript } from '@/lib/types';
import type { TokenUsage } from '@/lib/log/procedure';

/**
 * Script 工具 — 基于 Proposal + ResearchReport 调用 LLM 生成逐镜头生产脚本。
 *
 * 策略：
 * 1. 调用 AI API，要求返回 VideoScript JSON
 * 2. 轻量结构校验 → 不合法则重试（最多 3 次，指数退避）
 * 3. 全部失败时回退到规则生成（fallbackScript）
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

  // ── narrativeDesign 校验 ──
  const narrativeDesign = obj.narrativeDesign as Record<string, unknown> | undefined;
  if (!narrativeDesign) throw new Error('[script] narrativeDesign 缺失');
  if (typeof narrativeDesign.hook !== 'string' || !narrativeDesign.hook.trim()) {
    throw new Error('[script] narrativeDesign.hook 缺失');
  }
  if (!Array.isArray(narrativeDesign.emotionalArc)) {
    throw new Error('[script] narrativeDesign.emotionalArc 缺失');
  }

  const pacingMap = narrativeDesign.pacingMap as Record<string, unknown> | undefined;
  if (!pacingMap) throw new Error('[script] narrativeDesign.pacingMap 缺失');
  if (typeof pacingMap.tempo !== 'string' ||
      !['slow', 'medium', 'fast'].includes(pacingMap.tempo)) {
    throw new Error('[script] narrativeDesign.pacingMap.tempo 无效');
  }
  if (!Array.isArray(pacingMap.accelerationAt)) {
    throw new Error('[script] narrativeDesign.pacingMap.accelerationAt 缺失');
  }

  // ── sceneScripts 校验 ──
  const sceneScripts = obj.sceneScripts as unknown[];
  if (!Array.isArray(sceneScripts) || sceneScripts.length === 0) {
    throw new Error('[script] sceneScripts 缺失或为空');
  }

  for (let i = 0; i < sceneScripts.length; i++) {
    const ss = sceneScripts[i] as Record<string, unknown> | undefined;
    if (!ss) throw new Error(`[script] sceneScripts[${i}] 无效`);

    if (typeof ss.sceneId !== 'string' || !ss.sceneId.trim()) {
      throw new Error(`[script] sceneScripts[${i}].sceneId 缺失`);
    }
    if (typeof ss.duration !== 'number') {
      throw new Error(`[script] sceneScripts[${i}].duration 缺失`);
    }

    // resourceRefs 校验
    const resourceRefs = ss.resourceRefs as Record<string, unknown> | undefined;
    if (!resourceRefs) throw new Error(`[script] sceneScripts[${i}].resourceRefs 缺失`);
    if (resourceRefs.characterImageRef !== undefined && resourceRefs.characterImageRef !== null &&
        typeof resourceRefs.characterImageRef !== 'string') {
      throw new Error(`[script] sceneScripts[${i}].resourceRefs.characterImageRef 无效`);
    }
    if (typeof resourceRefs.sceneImageRef !== 'string' || !resourceRefs.sceneImageRef.trim()) {
      throw new Error(`[script] sceneScripts[${i}].resourceRefs.sceneImageRef 缺失`);
    }

    // videoGenPrompt 校验
    const videoGenPrompt = ss.videoGenPrompt as Record<string, unknown> | undefined;
    if (!videoGenPrompt) throw new Error(`[script] sceneScripts[${i}].videoGenPrompt 缺失`);
    if (typeof videoGenPrompt.motionDescription !== 'string' || !videoGenPrompt.motionDescription.trim()) {
      throw new Error(`[script] sceneScripts[${i}].videoGenPrompt.motionDescription 缺失`);
    }
    if (typeof videoGenPrompt.negativePrompt !== 'string') {
      throw new Error(`[script] sceneScripts[${i}].videoGenPrompt.negativePrompt 缺失`);
    }
    if (typeof videoGenPrompt.styleStrength !== 'number') {
      throw new Error(`[script] sceneScripts[${i}].videoGenPrompt.styleStrength 缺失`);
    }

    // audio 校验（必须存在）
    const audio = ss.audio as Record<string, unknown> | undefined;
    if (!audio) throw new Error(`[script] sceneScripts[${i}].audio 缺失`);
    if (!Array.isArray(audio.dialogues)) {
      throw new Error(`[script] sceneScripts[${i}].audio.dialogues 缺失`);
    }
    if (!Array.isArray(audio.soundEffects)) {
      throw new Error(`[script] sceneScripts[${i}].audio.soundEffects 缺失`);
    }

    // textOverlays 校验
    if (!Array.isArray(ss.textOverlays)) {
      throw new Error(`[script] sceneScripts[${i}].textOverlays 缺失`);
    }

    // transition 校验
    const transition = ss.transition as Record<string, unknown> | undefined;
    if (!transition) throw new Error(`[script] sceneScripts[${i}].transition 缺失`);
  }

  // ── 构建并返回 ──
  return {
    narrativeDesign: {
      hook: narrativeDesign.hook as string,
      emotionalArc: (narrativeDesign.emotionalArc as unknown[]).filter(
        (e): e is string => typeof e === 'string'
      ),
      pacingMap: {
        tempo: pacingMap.tempo as VideoScript['narrativeDesign']['pacingMap']['tempo'],
        accelerationAt: (pacingMap.accelerationAt as unknown[]).filter(
          (n): n is number => typeof n === 'number'
        ),
      },
    },
    sceneScripts: sceneScripts.map((s) => {
      const ss = s as Record<string, unknown>;
      const rRefs = ss.resourceRefs as Record<string, unknown>;
      const vgp = ss.videoGenPrompt as Record<string, unknown>;
      const aud = ss.audio as Record<string, unknown>;
      const trans = ss.transition as Record<string, unknown>;

      // narration 解析
      const narrationRaw = aud.narration as Record<string, unknown> | null | undefined;
      const narration: VideoScript['sceneScripts'][number]['audio']['narration'] = narrationRaw
        ? {
            text: (narrationRaw.text as string) ?? '',
            speaker: (narrationRaw.speaker as string) ?? 'narrator',
            emotion: (narrationRaw.emotion as string) ?? 'calm',
            speed: typeof narrationRaw.speed === 'number' ? narrationRaw.speed : 1.0,
            pauseAfter: typeof narrationRaw.pauseAfter === 'number' ? narrationRaw.pauseAfter : 0.5,
          }
        : null;

      // dialogues 解析
      const dialogues = (Array.isArray(aud.dialogues) ? aud.dialogues : []) as unknown[];
      const parsedDialogues: VideoScript['sceneScripts'][number]['audio']['dialogues'] =
        dialogues.map((d) => {
          const dd = d as Record<string, unknown>;
          return {
            characterId: (dd.characterId as string) ?? '',
            text: (dd.text as string) ?? '',
            emotion: (dd.emotion as string) ?? 'neutral',
            speed: typeof dd.speed === 'number' ? dd.speed : 1.0,
          };
        });

      // soundEffects 解析
      const soundEffects = (Array.isArray(aud.soundEffects) ? aud.soundEffects : []) as unknown[];
      const parsedSFX: VideoScript['sceneScripts'][number]['audio']['soundEffects'] =
        soundEffects.map((sfx) => {
          const s = sfx as Record<string, unknown>;
          return {
            type: (s.type as string) ?? '',
            timing: typeof s.timing === 'number' ? s.timing : 0,
            duration: typeof s.duration === 'number' ? s.duration : 0,
            description: (s.description as string) ?? '',
          };
        });

      // musicOverride 解析
      const musicRaw = aud.musicOverride as Record<string, unknown> | null | undefined;
      const musicOverride: VideoScript['sceneScripts'][number]['audio']['musicOverride'] = musicRaw
        ? {
            genre: (musicRaw.genre as string) ?? '',
            intensity: (musicRaw.intensity as string) ?? 'medium',
            fadeIn: typeof musicRaw.fadeIn === 'boolean' ? musicRaw.fadeIn : false,
          }
        : null;

      // textOverlays 解析
      const overlays = (Array.isArray(ss.textOverlays) ? ss.textOverlays : []) as unknown[];
      const parsedOverlays: VideoScript['sceneScripts'][number]['textOverlays'] =
        overlays.map((ov) => {
          const o = ov as Record<string, unknown>;
          const timing = o.timing as Record<string, unknown> | undefined;
          return {
            content: (o.content as string) ?? '',
            position: (o.position as string) ?? 'center',
            style: (o.style as string) ?? '',
            animation: (o.animation as string) ?? 'fade',
            timing: {
              in: typeof timing?.in === 'number' ? timing.in : 0,
              out: typeof timing?.out === 'number' ? timing.out : 0,
            },
          };
        });

      return {
        sceneId: ss.sceneId as string,
        duration: ss.duration as number,
        resourceRefs: {
          characterImageRef: (rRefs.characterImageRef as string | null) ?? null,
          sceneImageRef: rRefs.sceneImageRef as string,
        },
        videoGenPrompt: {
          motionDescription: vgp.motionDescription as string,
          negativePrompt: vgp.negativePrompt as string,
          styleStrength: vgp.styleStrength as number,
        },
        audio: {
          narration,
          dialogues: parsedDialogues,
          soundEffects: parsedSFX,
          musicOverride,
        },
        textOverlays: parsedOverlays,
        transition: {
          transitionType: (trans.transitionType as string) ?? '',
          visualLink: (trans.visualLink as string) ?? '',
          fromPrevious: (trans.fromPrevious as string) ?? '',
          toNext: (trans.toNext as string) ?? '',
        },
      };
    }),
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
      `${result.sceneScripts.length} 个镜头脚本` +
      (retries > 0 ? `（重试 ${retries} 次）` : '')
  );

  return {
    script: {
      narrativeDesign: result.narrativeDesign,
      sceneScripts: result.sceneScripts,
    },
    model: SCRIPT_LLM_MODEL,
    retries,
    tokenUsage: result.usage,
  };
}
