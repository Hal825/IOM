/**
 * 公共类型定义 — 前端、API、Worker 共用
 */

/** 队列名称（Queue 与 Worker 必须一致） */
export const QUEUE_NAME = 'video-generation';

/** 提交到队列的任务数据 */
export interface TaskData {
  /** 用户输入的原始文本 */
  text: string;
}

/** 任务完成后的返回值（存于 BullMQ job.returnvalue） */
export interface TaskResult {
  videoPath: string;
  durationSec: number;
}

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
  metadata: {
    topic: string;
    wordCount: number;
    language: string;
    /** 内容类型（如 "科普"、"故事"、"教程"、"新闻"） */
    contentType: string;
    /** 用户文本中出现的时间信息，按时间顺序列出 */
    sceneTime: string[];
    /** 用户文本中出现的地点信息，按出现顺序列出 */
    sceneLocation: string[];
    /** 用户的要求（如 "视频时长在15秒内、科技感"），若未提及则为 null */
    userDemand: string | null;
  };
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
  /** 内容就绪度评估 */
  readiness: {
    /** 综合就绪度评分（0-100） */
    overallScore: number;
    /** 各维度独立评分（0-100） */
    dimensions: {
      /** 信息量评估 */
      information: number;
      /** 逻辑性评估 */
      logic: number;
      /** 视觉化程度评估 */
      visual: number;
      /** 情感基调评估 */
      emotion: number;
      /** 完整度评估 */
      completeness: number;
    };
    /** 具体短板描述，无则为空数组 */
    shortcomings: string[];
    /** 补全方向建议，供提案节点使用，无则为空数组 */
    expansionHints: string[];
    /** 整体就绪度 ≥70 且无严重短板时为 true */
    canProceedDirectly: boolean;
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
    /** 场景核心内容概括 */
    summary: string;
    layout: {
      textPosition: 'center' | 'top' | 'bottom';
      backgroundColor: string;
      animation: 'fade' | 'slide' | 'typing' | 'none';
    };
    /** 最终显示字幕 */
    subtitleText: string;
    /** 场景间衔接设计 */
    transition: {
      from: {
        /** 上一个场景 sceneId，首场景为 null */
        sceneId: string | null;
        /** 过渡类型 */
        type: 'none' | 'fade' | 'zoom' | 'pan' | 'slide' | 'cut';
        /** 视觉衔接描述 */
        visualLink: string;
      };
      to: {
        /** 下一个场景 sceneId，末尾场景为 null */
        sceneId: string | null;
        /** 过渡类型 */
        type: 'none' | 'fade' | 'zoom' | 'pan' | 'slide' | 'cut';
        /** 视觉衔接描述 */
        visualLink: string;
      };
    };
    /** 该场景出镜的角色 ID 引用 */
    cast: string[];
  }>;
  /** 步骤一：场景摘取中间结果 */
  extraction: {
    rawScenes: Array<{
      id: string;
      content: string;
    }>;
  };
  /** 步骤二：场景编排优化日志 */
  optimizationLog: Array<{
    action: 'keep' | 'merge' | 'revise' | 'add' | 'delete';
    sourceId?: string;
    sourceIds?: string[];
    mergedContent?: string;
    revisedContent?: string;
    addedContent?: string;
    reason?: string;
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
  /** 内容补全记录（仅当 readiness.overallScore < 70 且执行了补全时存在） */
  _expansionApplied: {
    expansions: string[];
    reason: string;
  } | null;
}

// ── Script Generation ───────────────────────────────

/** 逐镜头生产脚本：由 script_generation 节点基于 Proposal 生成 */
export interface VideoScript {
  narrativeDesign: {
    /** 开篇钩子（前 3 秒抓眼球） */
    hook: string;
    /** 按镜头顺序的情感标签 */
    emotionalArc: string[];
    /** 整体节奏 */
    pacingMap: {
      tempo: 'slow' | 'medium' | 'fast';
      /** 需要加速的镜头索引 */
      accelerationAt: number[];
    };
  };
  sceneScripts: Array<{
    sceneId: string;
    duration: number;
    /** 资源引用 */
    resourceRefs: {
      /** 角色图片 ID，格式 "char-{id}_default"，无角色时为 null */
      characterImageRef: string | null;
      /** 场景图 ID，相同环境复用同一 ID */
      sceneImageRef: string;
    };
    /** 视频生成 prompt（直接传给 DashScope 等视频模型） */
    videoGenPrompt: {
      /** 英文，15-50 词，描述镜头运动和动作 */
      motionDescription: string;
      /** 不希望出现的视觉元素 */
      negativePrompt: string;
      /** 风格相似度 0.0-1.0 */
      styleStrength: number;
    };
    /** 音频脚本 */
    audio: {
      /** 旁白（可选） */
      narration: {
        text: string;
        speaker: string;
        emotion: string;
        speed: number;
        pauseAfter: number;
      } | null;
      /** 角色对话 */
      dialogues: Array<{
        characterId: string;
        text: string;
        emotion: string;
        speed: number;
      }>;
      /** 音效设计 */
      soundEffects: Array<{
        type: string;
        /** 从镜头开始秒数 */
        timing: number;
        duration: number;
        description: string;
      }>;
      /** 本镜头特殊音乐（覆盖全局 BGM） */
      musicOverride: {
        genre: string;
        intensity: string;
        fadeIn: boolean;
      } | null;
    };
    /** 文本叠加层 */
    textOverlays: Array<{
      content: string;
      position: string;
      style: string;
      animation: string;
      timing: { in: number; out: number };
    }>;
    /** 过渡衔接 */
    transition: {
      transitionType: string;
      visualLink: string;
      /** 本镜头如何承接上一镜头的情绪与信息 */
      fromPrevious: string;
      /** 本镜头如何引导至下一镜头 */
      toNext: string;
    };
  }>;
}

// ── Asset Generation ────────────────────────────────

/** 单个角色的素材视图 */
export interface CharacterAsset {
  characterId: string;
  /** 本地视图路径（前端预览/本地消费） */
  views: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
  /** OSS 公网视图 URL（供视频生成 API 引用），OSS 未配置时为 null */
  remoteViews?: {
    front: string;
    back: string;
    left: string;
    right: string;
  } | null;
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
