/**
 * 公共类型定义 — 前端、API、Worker 共用
 */

/** 队列名称（Queue 与 Worker 必须一致） */
export const QUEUE_NAME = 'video-generation';

/** 提交到队列的任务数据 */
export interface TaskData {
  /** 用户输入的原始文本 */
  text: string;
  /** AI 视频生成的最终产物 URL 或路径 */
  videoUrl?: string;
  /** 视频时长（秒） */
  durationSec?: number;
}

/** 任务完成后的返回值（存于 BullMQ job.returnvalue） */
export interface TaskResult {
  /** 最终视频路径（相对 storage/ 或远程 URL） */
  videoPath: string;
  /** 视频时长（秒） */
  durationSec: number;
  /** TTS 音频路径 */
  audioPath?: string;
}

/** 任务阶段 */
export type TaskStage =
  | 'pending'
  | 'researching'
  | 'proposing'
  | 'generating_assets'
  | 'generating_video'
  | 'done'
  | 'failed';

/** API 返回给前端的任务摘要 */
export interface TaskSummary {
  id: string;
  /** BullMQ job state: waiting | active | completed | failed | delayed | ... */
  status: string;
  /** 0-100 */
  progress: number;
  /** 输入文本（截断展示用） */
  text: string;
  createdAt: number;
  result?: TaskResult;
  failedReason?: string;
}

// ── Research & Proposal ─────────────────────────────

/** 调研报告：文本内容分析与风格识别结果 */
export interface ResearchReport {
  metadata: { topic: string; wordCount: number; language: string };
  contentSkeleton: {
    segments: Array<{
      id: string;
      title: string;
      originalText: string;
      summary: string;
      keywords: string[];
    }>;
    flow: 'chronological' | 'cause-effect' | 'problem-solution' | 'narrative';
  };
  styleProfile: {
    tone: 'professional' | 'lively' | 'serious' | 'inspirational' | 'minimal';
    pace: 'slow' | 'medium' | 'fast';
    visualStyle: string;
    suggestedBGM: string;
  };
  /** 角色需求检测 */
  characterAnalysis: {
    /** 用户是否明确或暗示需要角色出镜 */
    hasCharacter: boolean;
    /** 从原文提取的角色线索（外貌、身份等） */
    characterHints: string[];
  };
}

/** 角色设计（由 Proposal 节点生成） */
export interface Character {
  /** 角色 ID，格式 "char-1", "char-2" ... */
  characterId: string;
  /** 角色名称 */
  name: string;
  /** 详细外观描述（英文 30-80 词）：年龄/性别/发型/五官/服装/配饰 */
  appearance: string;
  /** 角色在视频中的定位 */
  role: string;
  /** 该角色出现在哪些 sceneId 中 */
  appearsInScenes: string[];
}

/** 制作提案：视频分镜脚本与风格指南 */
export interface Proposal {
  blueprint: {
    title: string;
    totalDuration: number;
    sceneCount: number;
    aspectRatio: '16:9' | '9:16' | '1:1';
  };
  shotScript: Array<{
    sceneId: string;
    duration: number;
    /** 英文视觉描述，用于素材生成 */
    visualDescription: string;
    layout: {
      textPosition: 'center' | 'top' | 'bottom';
      backgroundColor: string;
      animation: 'fade' | 'slide' | 'typing' | 'none';
    };
    /** 最终显示字幕 */
    subtitleText: string;
    /** AI 视频生成提示词（英文，含场景描述和角色出镜信息） */
    videoPrompt: string;
  }>;
  styleGuide: {
    globalTone: string;
    colorPalette: string[];
    fontFamily: string;
    backgroundMusic: { style: string; source?: string };
    transitions: 'smooth' | 'cut' | 'zoom';
  };
  feasibility: {
    riskLevel: 'low' | 'medium' | 'high';
    estimatedRenderTime: number;
    suggestions: string[];
  };
  /** 角色设计（仅当 research 判定需要角色时存在） */
  characters?: Character[];
  /** 视频生成配置 */
  videoGen?: {
    style: string;
    duration: number;
  };
}

// ── Asset Generation ────────────────────────────────

/** 单个角色的素材视图 */
export interface CharacterAsset {
  characterId: string;
  views: {
    front: string;  // 正面视图 URL/路径
    back: string;   // 背面视图 URL/路径
    left: string;   // 左侧视图 URL/路径
    right: string;  // 右侧视图 URL/路径
  };
  /** 生成该角色使用的 prompt */
  prompt: string;
}

/** 单个场景的背景素材 */
export interface SceneAsset {
  sceneId: string;
  /** 场景背景图本地路径（供前端预览等本地消费） */
  imageUrl: string;
  /** 场景背景图远程 URL（供 DashScope 等外部 API 引用） */
  remoteUrl?: string;
  /** 生成该场景使用的 prompt */
  prompt: string;
}

/** 素材清单：角色视图 + 场景背景 */
export interface AssetManifest {
  characters: CharacterAsset[];
  scenes: SceneAsset[];
}
