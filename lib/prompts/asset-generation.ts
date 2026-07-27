/**
 * AI 素材生成 — Prompt 模板
 *
 * 为角色生成前后左右 4 视角视图，为场景生成背景图。
 * 通过 AI_ASSET_MODEL / AI_ASSET_API_KEY / AI_ASSET_BASE_URL 配置。
 */

// ── 角色视图生成 ────────────────────────────────────

/** 角色单视图生成的系统提示词（每次调用只生成一个视角） */
export const CHARACTER_VIEW_SYSTEM = `You are a professional character designer and illustrator.

Your task is to generate a SINGLE full-body character view from a specific camera angle.

## Critical Requirements

- Generate ONLY ONE view per image — this is a single angle, NOT a character sheet or multi-panel composition.
- Full body visible from head to toe, centered in frame.
- Clean, solid neutral background (white or light gray #f0f0f0) — NO other objects or characters.
- Art style: 2D digital illustration, clean line art with flat colors, suitable for animation reference.
- The character should occupy roughly 70-80% of the frame height.
- Output a single standalone character image at exactly the specified angle.`;

/** 构建角色四视图 batch prompt（一次 API 调用生成 4 张独立图片） */
export function buildCharacterViewPrompt(
  characterName: string,
  appearance: string
): string {
  return `Generate 4 SEPARATE full-body character images for "${characterName}". ${appearance}.

Each image is a STANDALONE single view — NOT a multi-panel composition:

1. Image 1: FRONT view — character facing directly at the camera
2. Image 2: BACK view — character facing away from the camera
3. Image 3: LEFT side profile
4. Image 4: RIGHT side profile

All 4 images must share identical outfit, hairstyle, body proportions, and color palette.
Full body from head to toe, centered, 70-80% of frame height.
Clean solid white background. 2D digital illustration with flat colors.`;
}

// ── 场景背景生成 ────────────────────────────────────

/** 场景背景图生成的系统提示词 */
export const SCENE_BACKGROUND_SYSTEM = `You are a professional background artist and matte painter for video production.

Your task is to generate a cinematic wide-angle background image suitable for video scenes.

## Requirements

- 16:9 landscape aspect ratio, cinematic composition
- High quality, photorealistic or highly polished digital art
- Rich atmospheric lighting and depth
- Suitable as a video background (leave space for text overlay, preferably top 1/3 or center area less cluttered)
- Match the described mood, setting, and visual style exactly`;

/** 构建场景背景图 prompt */
export function buildSceneBackgroundPrompt(visualDescription: string): string {
  return `cinematic landscape, 16:9 wide angle, high quality, photorealistic — ${visualDescription}`;
}

// ── 资产清单 JSON Schema（给 LLM 的结构化输出指令）──

/** 素材生成节点的输出格式描述（嵌入 system prompt 尾部） */
export const ASSET_MANIFEST_SCHEMA_DESCRIPTION = `
Output a JSON object with the following structure:

{
  "characters": [
    {
      "characterId": "char-1",
      "name": "角色名",
      "views": {
        "front": "front view image URL or description",
        "back": "back view image URL or description",
        "left": "left view image URL or description",
        "right": "right view image URL or description"
      },
      "prompt": "The prompt used to generate this character"
    }
  ],
  "scenes": [
    {
      "sceneId": "shot-1",
      "imageUrl": "generated image URL or data",
      "prompt": "The prompt used to generate this scene background"
    }
  ]
}`;
