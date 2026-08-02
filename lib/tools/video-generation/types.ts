/**
 * 视频生成抽象层 — 模型无关的统一请求/结果类型。
 *
 * 不同视频模型 API 结构各异，本模块把「要生成什么」收敛成一份统一请求，
 * 具体模型的协议差异由各 Adapter 内部消化（见 adapter.ts / adapters/）。
 */

/** 模型无关的统一视频生成请求 */
export interface VideoGenRequest {
  /** 目标模型名（工厂分派依据），如 "happyhorse-1.1-r2v" */
  model: string;
  /** 首帧公网 http(s) URL（i2v/参考图生成硬依赖） */
  sceneImageUrl: string;
  /** 角色参考图（公网 http(s)），可空 */
  characterImageUrls: string[];
  /** 由 storyboard 构建的运镜/构图描述（英文） */
  motionDescription: string;
  /** 排除元素（英文） */
  negativePrompt: string;
  /** 目标时长（秒），调用方已钳制到 [3, 15] */
  durationSec: number;
  /** 模型原生分辨率档位，如 '720P' | '1080P' */
  resolution: string;
  /** 与参考图风格相似度 0-1 */
  styleStrength: number;
}

/** 单镜头视频生成结果 */
export interface VideoGenResult {
  /** 视频文件二进制 */
  buffer: Buffer;
  /** 实际时长（秒）；无 ffprobe 探测时 = 请求时长 */
  durationSec: number;
}
