import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface SubtitleScene {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface SubtitlesProps {
  scenes: SubtitleScene[];
  fps: number;
  /** 淡入/淡出时长（秒），默认 0.2 */
  fadeDuration?: number;
}

/**
 * 动态字幕组件 — 根据当前帧自动匹配对应场景的字幕文本，
 * 底部居中显示，半透明背景，入场/出场淡入淡出动画。
 */
export const Subtitles: React.FC<SubtitlesProps> = ({
  scenes,
  fps,
  fadeDuration = 0.2,
}) => {
  const frame = useCurrentFrame();

  // 找到当前帧所在的场景
  const activeScene = scenes.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  if (!activeScene) return null;

  const fadeFrames = fadeDuration * fps;

  // 入场淡入：从 startFrame 开始，fadeFrames 帧内从 0 → 1
  const opacityIn = interpolate(
    frame,
    [activeScene.startFrame, activeScene.startFrame + fadeFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 出场淡出：在 endFrame 之前的 fadeFrames 帧内从 1 → 0
  const opacityOut = interpolate(
    frame,
    [activeScene.endFrame - fadeFrames, activeScene.endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 取两者最小值实现双向淡入淡出
  const opacity = Math.min(opacityIn, opacityOut);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity,
        zIndex: 1,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '12px 24px',
          borderRadius: 8,
          maxWidth: '80%',
          color: 'white',
          fontFamily:
            '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif',
          fontSize: 36,
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.6,
          letterSpacing: 1,
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        {activeScene.text}
      </div>
    </div>
  );
};
