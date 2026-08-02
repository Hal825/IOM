/**
 * 视频模型适配器契约 + 注册工厂。
 *
 * 各视频模型 API 结构不同，统一收敛到 VideoModelAdapter 接口。
 * 内置模型通过 registerAdapter() 注册（见 adapters/happyhorse-r2v.ts）。
 * 未知模型零容错：createVideoAdapter() 直接抛错。
 */

import type { VideoGenRequest, VideoGenResult } from './types';

/** 视频模型适配器契约 */
export interface VideoModelAdapter {
  readonly model: string;
  generateVideo(req: VideoGenRequest): Promise<VideoGenResult>;
}

const ADAPTERS = new Map<string, () => VideoModelAdapter>();

/** 注册一个模型适配器工厂（按模型名分派） */
export function registerAdapter(model: string, factory: () => VideoModelAdapter): void {
  ADAPTERS.set(model.trim(), factory);
}

/** 工厂：按模型名取适配器；未知模型抛错（零容错） */
export function createVideoAdapter(model: string): VideoModelAdapter {
  const factory = ADAPTERS.get(model.trim());
  if (!factory) {
    throw new Error(`未知视频模型 "${model}"，当前仅支持: ${[...ADAPTERS.keys()].join(', ')}`);
  }
  return factory();
}
