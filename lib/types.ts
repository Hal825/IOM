/**
 * 公共类型定义 — 前端、API、Worker 共用
 */

/** 队列名称（Queue 与 Worker 必须一致） */
export const QUEUE_NAME = 'video-generation';

/** 视频生成方式：auto = 项目调视频 API；claude = 暂停等 Claude 用套餐模型生成（方案 B） */
export type VideoMode = 'auto' | 'claude';

/** 提交到队列的任务数据 */
export interface TaskData {
  /** 用户输入的原始文本 */
  text: string;
  /** 视频生成方式（缺省 auto；shot_video_gen 据此决定是否 claude 模式） */
  videoMode?: VideoMode;
  /** 重跑起点节点（如 'script_generation'）；缺省 = 正常全跑 */
  rerunFrom?: string;
  /** 重跑时的上游产出（来自对话卡 payload，重跑时恢复用） */
  resumeState?: Record<string, unknown>;
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
  /** 是否正停在决策点等用户回复（human-in-loop） */
  awaitingReply?: boolean;
}

// ── Chat 消息（LLM 追加式对话）────────────────────────

/** OpenAI 兼容的单条消息。用于 research/proposal/script 三节点共享的追加式对话（前缀一致 → KV Cache 命中）。 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ── Research ─────────────────────────────────────────

/**
 * 调研报告（新版）：用户原文 + 结构化需求提取 + 内容就绪度评估。
 * 由 research 节点基于用户文本生成，供 proposal 节点消费。
 */
export interface ResearchReport {
  /** 用户输入的原始文本（原封不动） */
  user_text: string;
  /** 用户要求提取 */
  user_demand: {
    /** 用户文本中是否包含明确要求 */
    hasExplicitDemand: boolean;
    /** 结构化需求列表 */
    demands: Array<{
      /** 需求类别：duration / style / content / format / visual / audio / other */
      category: 'duration' | 'style' | 'content' | 'format' | 'visual' | 'audio' | 'other';
      description: string;
      /** 原文中出现该需求的原始措辞 */
      originalPhrase: string;
    }>;
    /** 需求概括 */
    summary: string;
  };
  /** 内容就绪度评估 */
  content_readiness_assessment: {
    /** 综合评分 0-100 */
    overallScore: number;
    /** 就绪等级：ready / good / moderate / insufficient */
    level: 'ready' | 'good' | 'moderate' | 'insufficient';
    /** 六维评估（键：information_sufficiency / visual_convertibility / structural_integrity / logical_fluency / emotional_clarity / creativity_richness） */
    dimensions: Record<string, { score: number; comment: string }>;
    /** 文本优点 2-4 条 */
    strengths: string[];
    /** 文本短板 2-4 条 */
    weaknesses: string[];
    /** 建议：ready / needs_polish / needs_enrichment / needs_restructure */
    recommendation: 'ready' | 'needs_polish' | 'needs_enrichment' | 'needs_restructure';
  };
}

/** 角色设计（由 Proposal 节点生成） */
export interface Character {
  /** 角色 ID，格式 "char-1", "char-2" ... */
  characterId: string;
  /** 角色名称 */
  name: string;
  /** 角色类型：主角 / 配角 */
  type: 'protagonist' | 'supporting';
  /** 中文外观描述（40-80 字）：年龄/性别/发型/五官/身材/服装/配饰 */
  appearance: string;
  /** 中文性格描述（20-50 字）：核心特质/说话风格/典型神态 */
  personality: string;
  /** 角色在视频中的定位与功能 */
  role: string;
}

/** 制作提案（新版）：角色 + 蓝图 + 按空间分组的场景视觉 + 风格配置 */
export interface Proposal {
  /** 角色设计（可为空数组，纯视觉/无人物视频） */
  characters: Character[];
  blueprint: {
    title: string;
    totalDuration: number;
    aspectRatio: '16:9' | '9:16' | '1:1';
  };
  /** 按空间/背景分组的场景视觉。同一 visual 定义布景一次，scenes 描述空间内发生的镜头 */
  sceneVisuals: Array<{
    /** 分组编号，格式 "visual-1", "visual-2" ... */
    visualId: string;
    /** 中文完整空间/布景描述 */
    description: string;
    /** 英文视觉提示词（供 AI 图片生成） */
    visualHints: string;
    /** 发生在这个空间内的镜头 */
    scenes: Array<{
      sceneId: string;
      /** 中文场景描述（事件 + 动作 + 构图运镜 + 画面文字） */
      sceneDescription: string;
      /** 本镜头出镜角色 ID 列表（对应 characters[].characterId），纯视觉镜头为空数组 */
      appearCharId: string[];
      /** 镜头时长（秒），5-12 */
      duration: number;
    }>;
  }>;
  /** 风格配置 */
  styleProfile: {
    /** 基调：professional / lively / serious / inspirational / minimal */
    tone: 'professional' | 'lively' | 'serious' | 'inspirational' | 'minimal';
    /** 视觉风格描述（中文） */
    visualStyle: string;
    /** 背景音乐建议（中文） */
    suggestedBGM: string;
  };
}

// ── Script Generation ───────────────────────────────

/** 剧情脚本 — 单镜头（发生什么故事） */
export interface StoryScriptScene {
  sceneId: string;
  /** 中文叙事描述（忠实于 Proposal sceneDescription） */
  sceneDescription: string;
  /** 本镜头出场的角色及其动作/情绪；纯视觉镜头为空数组 */
  characters: Array<{
    characterId: string;
    actions: string[];
    emotions: string[];
  }>;
  /** 本镜头在整体叙事中的作用（中文一句话） */
  narrative: string;
}

/** 分镜脚本 — 单镜头（怎么拍 + 资源引用 + 技术参数） */
export interface StoryboardScriptScene {
  sceneId: string;
  /** 对应 Proposal 中该镜头所属的 visualId */
  visualSource: string;
  /** 本镜头出镜角色 ID 列表（对应 Proposal characters[].characterId），纯视觉镜头为空数组 */
  appearCharId: string[];
  /** 资源引用 */
  resourceRefs: {
    /** 场景图引用 ID，格式 "scene_{visualId}"，同一 visualId 复用 */
    sceneImageRef: string;
  };
  /** 镜头语言 */
  shot: {
    /** 景别（英文） */
    type: string;
    /** 机位角度（英文） */
    angle: string;
    /** 运镜方式（英文） */
    movement: string;
    /** 焦点描述（英文） */
    focus: string;
  };
  /** 构图规则（英文） */
  composition: string;
  /** 光线描述（英文） */
  lighting: string;
  /** 关键视觉元素（英文） */
  visualElements: string[];
  /** 氛围关键词（英文） */
  atmosphere: string;
  /** 运镜幅度 1-5 */
  motionLevel: number;
  /** 排除元素（英文） */
  negativePrompt: string;
  /** 默认由 aspectRatio 决定：16:9→1920x1080, 9:16→1080x1920, 1:1→1080x1080；research 有分辨率需求（如 480p）时被后处理覆盖 */
  resolution: string;
  /** 固定 24 */
  fps: number;
  /** 目标视频引擎 */
  engine: string;
  /** 生成模式 */
  mode: string;
}

/** 音频脚本 — 单镜头（听什么，供 TTS / 音频合成） */
export interface AudioScriptScene {
  sceneId: string;
  /** 台词/旁白列表；纯视觉镜头为 null */
  dialogue: Array<{
    characterId: string;
    text: string;
    emotion: string;
  }> | null;
  /** 音效设计 */
  sfx: Array<{
    type: string;
    /** 触发时机描述（英文），如 "at start"、"when screen switches" */
    timing: string;
  }>;
  /** 背景音乐设计 */
  bgm: {
    style: string;
    mood: string;
    timing: string;
  };
}

/** 节奏脚本 — 单镜头（时间分配与转场） */
export interface PacingScriptScene {
  sceneId: string;
  /** 秒，与 Proposal 中对应 scene 严格一致 */
  duration: number;
  /** 入场转场 */
  transitionIn: {
    /** 首镜头必须为 "fade-in"，其余 "cut" 或 "dissolve" */
    type: string;
    durationSec: number;
  };
  /** 出场转场 */
  transitionOut: {
    /** 末镜头必须为 "fade-out"，其余 "cut" 或 "dissolve" */
    type: string;
    durationSec: number;
  };
  /** 关键时刻（用于音画同步或字幕时机） */
  keyMoments: Array<{
    /** 秒，不超过本镜头 duration */
    time: number;
    event: string;
  }>;
}

/** 逐镜头生产脚本（新版，四子脚本）：由 script_generation 节点基于 Proposal 生成 */
export interface VideoScript {
  /** 剧情脚本（发生什么故事） */
  storyScript: {
    scenes: StoryScriptScene[];
  };
  /** 分镜脚本（怎么拍 + 资源引用 + 技术参数），供 asset_gen / shot_video */
  storyboardScript: {
    scenes: StoryboardScriptScene[];
  };
  /** 音频脚本（听什么），供 tts / 音频合成 */
  audioScript: {
    scenes: AudioScriptScene[];
  };
  /** 节奏脚本（时间分配与转场），供 video_merge */
  pacingScript: {
    scenes: PacingScriptScene[];
  };
}

// ── Asset Generation（素材清单）───────────────────────────
// 交付契约：asset_gen 向下只交付一份 AssetManifest，全部为相对路径。
// 两个来源接口（AI 生成 / 本地库）产出同一结构，仅 source/sourceRef 不同。

/** 单个角色的素材（四视图，一组一起存取） */
export interface CharacterAsset {
  /** 素材来源：ai=AI 生成 / library=本地库 */
  source: 'ai' | 'library';
  /** source='library' 时的库相对路径，如 "library/characters/char_userd_1_female" */
  sourceRef?: string;
  /** 四视图相对路径 */
  views: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
  /** OSS 公网四视图 URL（publish 后回填，未上传为空对象） */
  remoteViews?: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
}

/** 单个场景的背景素材（按 ref 去重共享） */
export interface SceneAsset {
  /** 素材来源：ai=AI 生成 / library=本地库 */
  source: 'ai' | 'library';
  /** source='library' 时的库相对路径 */
  sourceRef?: string;
  /** 背景图相对路径 */
  image: string;
  /** OSS 公网 URL（publish 后回填） */
  remoteUrl?: string;
}

/** 素材清单（asset_gen 输出） */
export interface AssetManifest {
  jobId: string;
  /** characterId → 角色四视图 */
  characters: Record<string, CharacterAsset>;
  /** 场景 ref → 背景图 */
  scenes: Record<string, SceneAsset>;
  /** sceneId → 场景 ref（显式映射，组装层据此拿场景图） */
  sceneRefs: Record<string, string>;
}

// ── Scene Video Spec（单镜头视频生成完整规格）─────────

/**
 * 单镜头视频生成的完整 JSON（由 scene_json_assembler 节点组装）。
 * 融合四子脚本 + 真实素材产物 + 音频产物，可直接交付视频生成引擎。
 */
export interface SceneVideoSpec {
  sceneId: string;
  duration: number;
  /** 目标视频引擎 */
  engine: string;
  /** 生成模式 */
  mode: string;
  resolution: string;
  fps: number;
  /** 真实产物引用（素材生成 + TTS 之后） */
  assets: {
    /** 场景背景图 URL（本地路径或 OSS 公网 URL） */
    sceneImageUrl: string | null;
    /** 出镜角色参考图 URL 列表 */
    characterImageUrls: string[];
    /** 该镜头对齐后的音频文件路径（TTS 产物），无台词时为 null */
    audioFilePath: string | null;
  };
  /** 剧情（来自 storyScript） */
  story: {
    sceneDescription: string;
    narrative: string;
    characters: StoryScriptScene['characters'];
  };
  /** 分镜/视觉 + 技术参数（来自 storyboardScript） */
  storyboard: {
    shot: StoryboardScriptScene['shot'];
    composition: string;
    lighting: string;
    visualElements: string[];
    atmosphere: string;
    motionLevel: number;
    negativePrompt: string;
  };
  /** 音频（来自 audioScript） */
  audio: {
    dialogue: AudioScriptScene['dialogue'];
    sfx: AudioScriptScene['sfx'];
    bgm: AudioScriptScene['bgm'];
  };
  /** 节奏/转场（来自 pacingScript） */
  pacing: {
    transitionIn: PacingScriptScene['transitionIn'];
    transitionOut: PacingScriptScene['transitionOut'];
    keyMoments: PacingScriptScene['keyMoments'];
  };
}
