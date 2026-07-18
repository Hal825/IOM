import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  type ScriptScene,
  type VideoCompositionProps,
  VIDEO_FPS,
} from '../types';

/**
 * Remotion 渲染工具 — bundle 一次复用，renderMedia 输出 MP4。
 * 音频通过复制到 bundle 的 public/ 目录供 staticFile() 访问
 * （Remotion 渲染服务器从磁盘实时读取 bundle 目录，后放入的文件也能被服务）。
 */

let bundlePromise: Promise<string> | null = null;

/** 获取（惰性创建并缓存的）Remotion bundle */
export function getBundle(): Promise<string> {
  if (!bundlePromise) {
    console.log('[renderer] 正在打包 Remotion bundle（首次较慢）...');
    bundlePromise = bundle({
      entryPoint: path.resolve('./remotion/index.ts'),
    }).then((location) => {
      console.log(`[renderer] bundle 完成: ${location}`);
      return location;
    });
    // 失败后允许重试
    bundlePromise.catch(() => {
      bundlePromise = null;
    });
  }
  return bundlePromise;
}

export interface RenderOptions {
  script: ScriptScene[];
  /** TTS 音频绝对路径 */
  audioPath: string;
  /** MP4 输出目录 */
  outputDir: string;
  /** 任务 ID，用于文件命名 */
  jobId: string;
  /** 渲染进度回调 (0-1) */
  onProgress?: (progress: number) => void;
}

/**
 * 渲染视频，返回 MP4 绝对路径。
 */
export async function renderVideo(options: RenderOptions): Promise<string> {
  const { script, audioPath, outputDir, jobId, onProgress } = options;
  const bundleLocation = await getBundle();

  // 把音频复制进 bundle 的 public/，供 staticFile('audio/<jobId>.mp3') 引用
  const publicAudioDir = path.join(bundleLocation, 'public', 'audio');
  await fs.mkdir(publicAudioDir, { recursive: true });
  const audioFileName = `${jobId}${path.extname(audioPath)}`;
  await fs.copyFile(audioPath, path.join(publicAudioDir, audioFileName));

  const inputProps: VideoCompositionProps = {
    script,
    audioUrl: `audio/${audioFileName}`,
  };

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'VideoComposition',
    inputProps,
  });

  await fs.mkdir(outputDir, { recursive: true });
  const outputLocation = path.resolve(outputDir, `${jobId}.mp4`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation,
    inputProps,
    onProgress: ({ progress }) => onProgress?.(progress),
  });

  return outputLocation;
}

/** 预热：bundle + 确认浏览器内核可用（Worker 启动时调用，可选） */
export async function warmUp(): Promise<void> {
  await getBundle();
}

export { VIDEO_FPS };
