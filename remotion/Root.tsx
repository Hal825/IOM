import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition, calculateVideoMetadata } from './VideoComposition';
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  type VideoCompositionProps,
} from '../lib/types';

const defaultProps: VideoCompositionProps = {
  script: [
    { text: '欢迎使用 OpenMontage', startFrame: 0, endFrame: 90 },
    { text: '输入文本，自动生成视频', startFrame: 90, endFrame: 180 },
  ],
  audioUrl: '',
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VideoComposition"
      component={VideoComposition}
      durationInFrames={VIDEO_FPS * 10}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={defaultProps}
      calculateMetadata={calculateVideoMetadata}
    />
  );
};
