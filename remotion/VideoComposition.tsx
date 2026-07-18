import React from 'react';
import {
  AbsoluteFill,
  Audio,
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
 * 视频画面：深色背景 + 居中字幕逐条淡入淡出 + 底部进度条 + 音轨
 */
export const VideoComposition: React.FC<VideoCompositionProps> = ({
  script,
  audioUrl,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = script.length
    ? Math.max(...script.map((s) => s.endFrame))
    : 1;

  const currentScene = script.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  let opacity = 0;
  if (currentScene) {
    const sceneLength = currentScene.endFrame - currentScene.startFrame;
    const fade = Math.min(FADE_FRAMES, Math.floor(sceneLength / 3));
    opacity = interpolate(
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

  const progress = Math.min(1, frame / totalFrames);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {audioUrl ? <Audio src={staticFile(audioUrl)} /> : null}

      {currentScene ? (
        <div
          style={{
            opacity,
            color: '#f8fafc',
            fontSize: 56,
            fontWeight: 700,
            fontFamily:
              '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif',
            textAlign: 'center',
            maxWidth: '85%',
            lineHeight: 1.5,
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
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
        }}
      >
        OpenMontage
      </div>
    </AbsoluteFill>
  );
};
