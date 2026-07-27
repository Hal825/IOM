/**
 * AI 视频生成 — Prompt 模板（占位）
 *
 * 将素材清单（AssetManifest）和分镜提案（Proposal）提交给 AI 视频生成模型。
 * 配置通过 AI_VIDEO_API_KEY / AI_VIDEO_BASE_URL / AI_VIDEO_MODEL 环境变量管理。
 */

/** 视频生成的系统提示词 */
export const VIDEO_GENERATION_SYSTEM = `You are a professional AI video generation assistant.

Your task is to compose a video based on:

1. A shot script (Proposal) — describing each scene's visual content, layout, subtitles, and duration
2. An asset manifest — listing character reference images (front/back/left/right views) and scene background images
3. A style guide — specifying color palette, fonts, transitions, and global visual tone
4. (Optional) A narration audio track — voiceover to be synchronized with the visual timeline

## Output Requirements

- Compose scenes according to the shotScript timing and transitions
- Place characters in scenes using their reference views as appropriate
- Apply scene backgrounds as the visual foundation
- Overlay subtitle text with specified layout/animation
- Synchronize the narration audio track (if provided) with the visual timeline
- Follow the style guide for consistent visual identity
- Output the final composed video`;

/** 构建视频生成用户消息 */
export function buildVideoGenUserMessage(
  proposalJson: string,
  assetManifestJson: string,
  audioUrl?: string
): string {
  let msg = `## Shot Script (Proposal)
${proposalJson}

## Asset Manifest
${assetManifestJson}`;

  if (audioUrl) {
    msg += `

## Narration Audio
${audioUrl}

Please synchronize the audio with the visual timeline.`;
  } else {
    msg += `

Please generate the video according to the system instructions.`;
  }

  return msg;
}
