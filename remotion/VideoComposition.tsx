import React from 'react';
import {
  AbsoluteFill,
  Html5Audio as AudioPlayer,
  Img,
  staticFile,
  useCurrentFrame,
  type CalculateMetadataFunction,
} from 'remotion';
import { VIDEO_FPS, type VideoCompositionProps } from '../lib/types';
import { Subtitles } from './Subtitles';

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
 * 视频画面：背景画面（图片/纯色）+ 动态字幕 + 音轨 + 水印。
 *
 * Phase 2 新增：每个场景支持独立的背景画面素材（来自 Unsplash/Pexels/纯色兜底）。
 */
export const VideoComposition: React.FC<VideoCompositionProps> = ({
  script,
  audioUrl,
  visuals,
}) => {
  const frame = useCurrentFrame();

  const currentScene = script.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  // 当前场景的画面素材
  const currentVisual = (() => {
    if (!visuals || !currentScene) return null;
    const idx = script.indexOf(currentScene);
    return visuals.find((v) => v.sceneIndex === idx) ?? null;
  })();

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

      {/* 动态字幕（底部居中，半透明背景，淡入淡出） */}
      <Subtitles scenes={script} fps={VIDEO_FPS} />

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
