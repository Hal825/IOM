/**
 * 视频生成抽象层 — 公共入口。
 *
 * 使用：调用方只面向模型无关的 generateSceneVideo(req)，具体模型适配器由工厂分派。
 */

import './adapters/happyhorse-r2v'; // 副作用：注册内置模型（必须先于工厂调用）

import type { VideoGenRequest, VideoGenResult } from './types';
import { createVideoAdapter, registerAdapter, type VideoModelAdapter } from './adapter';
import { runWithConcurrency, clampDuration, buildMotionDescription, resolutionToTier } from './util';

export type { VideoGenRequest, VideoGenResult } from './types';
export { createVideoAdapter, registerAdapter, type VideoModelAdapter } from './adapter';
export { runWithConcurrency, clampDuration, buildMotionDescription, resolutionToTier } from './util';

/**
 * 模型无关的单镜头视频生成入口：经工厂分派到具体适配器。
 * 零容错：未知模型 / API 失败直接抛错。
 */
export async function generateSceneVideo(req: VideoGenRequest): Promise<VideoGenResult> {
  return createVideoAdapter(req.model).generateVideo(req);
}
