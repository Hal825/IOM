import type { Job } from 'bullmq';
import path from 'node:path';
import { assignFrames, generateScript } from './tools/script-generator';
import { synthesizeSpeech } from './tools/tts';
import { renderVideo } from './tools/renderer';
import { VIDEO_FPS, type TaskData, type TaskResult } from './types';

/**
 * 核心编排器 — 串联 脚本生成 → 语音合成 → 视频渲染 三个阶段。
 * progress 映射: 10=脚本, 30=TTS 完成, 50~95=渲染中, 100=完成
 */
export async function executeTask(
  job: Job<TaskData>,
  storageDir: string
): Promise<TaskResult>
{
  const jobId = String(job.id);
  const text = job.data.text?.trim();
  if (!text) {
    throw new Error('任务文本为空');
  }

  // 阶段 1: 脚本生成
  await job.updateProgress(10);//更新任务进度为 10%，表示脚本生成阶段开始
  await job.log('阶段 1/3: 生成脚本');//记录日志，说明当前阶段是脚本生成
  const scenes = generateScript(text);
  if (scenes.length === 0) {
    throw new Error('脚本生成结果为空');
  }

  // 阶段 2: 语音合成
  await job.updateProgress(30);
  await job.log(`阶段 2/3: 语音合成（${scenes.length} 个场景）`);
  const audioDir = path.join(storageDir, 'audio', jobId);//定义音频输出目录，位于 storage/audio/{jobId} 下
  const { audioPath, duration } = await synthesizeSpeech(text, audioDir);//调用语音合成函数，生成音频文件，并获取音频路径和总时长
  const script = assignFrames(scenes, duration, VIDEO_FPS);//根据音频总时长和帧率，为每个字幕场景分配开始和结束帧，得到完整的脚本

  // 阶段 3: 视频渲染
  await job.updateProgress(50);
  await job.log(`阶段 3/3: 渲染视频（音频 ${duration.toFixed(1)}s）`);
  const videoPath = await renderVideo({
    script,//字幕脚本，包含每个场景的文字和帧区间
    audioPath,//音频文件的绝对路径
    outputDir: path.join(storageDir, 'output'),//定义视频输出目录，位于 storage/output 下
    jobId,//任务 ID，用于生成唯一的视频文件名
    onProgress: (p) => {
      // 渲染阶段映射到 50~95
      void job.updateProgress(50 + Math.round(p * 45));
    },
  });

  await job.updateProgress(100);
  return {
    videoPath: path.relative(storageDir, videoPath).replaceAll('\\', '/'),
    audioPath: path.relative(storageDir, audioPath).replaceAll('\\', '/'),
    script,
  };
}
