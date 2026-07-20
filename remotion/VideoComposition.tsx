import React from 'react';
import {
  AbsoluteFill,
  Html5Audio as AudioPlayer,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  type CalculateMetadataFunction,
} from 'remotion';
import { VIDEO_FPS, type VideoCompositionProps } from '../lib/types';

/** 出入场淡入淡出的帧数 */
const FADE_FRAMES = 12;

/** 按脚本最后一帧动态计算视频总时长 */
export const calculateVideoMetadata: CalculateMetadataFunction<
  VideoCompositionProps
> = ({ props }) => {
  const lastFrame = props.script.length
    ? Math.max(...props.script.map((s) => s.endFrame))
    : VIDEO_FPS * 5;
  return {
    durationInFrames: Math.max(VIDEO_FPS, lastFrame),
  };
};

/**
 * 视频画面：背景画面（图片/纯色）+ 居中字幕 + 底部进度条 + 音轨。
 *
 * Phase 2 新增：每个场景支持独立的背景画面素材（来自 Unsplash/Pexels/纯色兜底）。
 */
export const VideoComposition: React.FC<VideoCompositionProps> = ({
  script,
  audioUrl,
  visuals,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = script.length
    ? Math.max(...script.map((s) => s.endFrame))
    : 1;

  const currentScene = script.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  // 字幕透明度（淡入淡出）
  let textOpacity = 0;
  if (currentScene) {
    const sceneLength = currentScene.endFrame - currentScene.startFrame;
    const fade = Math.min(FADE_FRAMES, Math.floor(sceneLength / 3));
    textOpacity = interpolate(
      frame,
      [
        currentScene.startFrame,
        currentScene.startFrame + fade,
        currentScene.endFrame - fade,
        currentScene.endFrame,
      ],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // 当前场景的画面素材
  const currentVisual = (() => {
    if (!visuals || !currentScene) return null;
    const idx = script.indexOf(currentScene);
    return visuals.find((v) => v.sceneIndex === idx) ?? null;
  })();

  const progress = Math.min(1, frame / totalFrames);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 背景画面 */}
      {currentVisual && (() => {
        if (currentVisual.type === 'image') {
          return (
            <AbsoluteFill>
              <Img
                src={currentVisual.url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* 暗色遮罩提升字幕可读性 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                }}
              />
            </AbsoluteFill>
          );
        }
        // solid 纯色
        return (
          <AbsoluteFill
            style={{ backgroundColor: currentVisual.url }}
          />
        );
      })()}

      {/* 音轨 */}
      {audioUrl ? <AudioPlayer src={staticFile(audioUrl)} /> : null}

      {/* 字幕 */}
      {currentScene ? (
        <div
          style={{
            opacity: textOpacity,
            color: '#f8fafc',
            fontSize: 56,
            fontWeight: 700,
            fontFamily:
              '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif',
            textAlign: 'center',
            maxWidth: '85%',
            lineHeight: 1.5,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            zIndex: 1,
          }}
        >
          {currentScene.text}
        </div>
      ) : null}

      {/* 底部进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 8,
          width: `${progress * 100}%`,
          backgroundColor: '#38bdf8',
          zIndex: 2,
        }}
      />

      {/* 左上角水印 */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
          color: 'rgba(248,250,252,0.35)',
          fontSize: 24,
          fontFamily: 'sans-serif',
          letterSpacing: 2,
          zIndex: 2,
        }}
      >
        OpenMontage
      </div>
    </AbsoluteFill>
  );
};
