'use client';

import { useState } from 'react';
import type { VideoMode } from '@/lib/types';

const MAX_CHARS = 2000;

/** 示例提示词：点击填入输入框（不改不提交，用户可再编辑） */
const EXAMPLE_PROMPTS = [
  '一只柴犬在雨后的涩谷街头寻找主人，温情短片',
  '60 秒科普：为什么天空是蓝色的',
  '赛博朋克城市里的机器人早餐店，产品广告风',
];

interface CreateFormProps {
  /** 成功则 resolve（输入框会被清空）；失败请 throw，错误由 error 属性展示。 */
  onSubmit: (text: string, videoMode: VideoMode) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

/**
 * 大输入框：居中舒适的 textarea + 视频生成方式切换 + 字符计数 + 提交按钮 + 错误横幅。
 * 与历史 Composer 同源：⌘/Ctrl+Enter 快速提交，≤2000 字。
 * 视频生成方式：auto = 项目调视频 API；claude = Claude 用套餐模型生成（方案 B，需 Claude 在线）。
 * text 由 EmptyHero 受控持有——示例提示词 chips 点击后填入。
 */
function LargeComposer({
  onSubmit,
  submitting,
  error,
  placeholder,
  text,
  onTextChange,
}: CreateFormProps & {
  placeholder: string;
  text: string;
  onTextChange: (text: string) => void;
}) {
  const [videoMode, setVideoMode] = useState<VideoMode>('auto');

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    try {
      await onSubmit(trimmed, videoMode);
      onTextChange('');
    } catch {
      /* 保留草稿；错误信息通过 error 属性展示 */
    }
  };

  return (
    <div className="w-full rounded-2xl border border-accent/40 bg-panel p-5 shadow-card transition-colors focus-within:border-accent/60">
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        aria-label="视频描述"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder={placeholder}
        rows={5}
        maxLength={MAX_CHARS}
        className="min-h-[110px] w-full resize-y bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted/70"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {/* 视频生成方式：auto / claude（方案 B） */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted">视频生成</span>
          <div className="flex rounded-lg border border-border bg-background/70 p-0.5">
            <button
              type="button"
              onClick={() => setVideoMode('auto')}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition md:py-1 ${
                videoMode === 'auto'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              视频 API
            </button>
            <button
              type="button"
              onClick={() => setVideoMode('claude')}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition md:py-1 ${
                videoMode === 'claude'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Claude 生成
            </button>
          </div>
          {videoMode === 'claude' ? (
            <span className="text-[10px] text-info">需 Claude 在线接管视频节点</span>
          ) : null}
        </div>

        <span className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted">
            {text.length} / {MAX_CHARS}
            <span className="ml-3 hidden text-muted/70 sm:inline">Ctrl / ⌘ + Enter 快速提交</span>
          </span>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!text.trim() || submitting}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 md:py-2"
          >
            {submitting ? '提交中…' : '生成视频'}
          </button>
        </span>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 初始状态页 / 新建任务页：品牌区（渐变标题 + 一句话流程）+ 大输入框 + 示例提示词 chips。
 * 默认进入此视图，点选侧栏任务才切到详情。
 * 记忆点：accent → success 的渐变标题（呼应「文本 → 成片」的流水线隐喻）。
 */
export function EmptyHero(props: CreateFormProps) {
  const [text, setText] = useState('');

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="m-auto w-full max-w-xl">
        {/* 品牌区：渐变标题 + 一句话说清这条流水线（页头已有 h1，这里用 h2） */}
        <h2 className="bg-gradient-to-r from-accent via-accent/80 to-success bg-clip-text text-center text-3xl font-bold leading-tight tracking-tight text-transparent md:text-4xl">
          把一段文字，变成一支视频
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted">
          调研、提案、脚本、素材、配音、逐镜头生成到拼接——全自动流水线，
          关键节点会停下来等你拍板。
        </p>

        <div className="mt-6">
          <LargeComposer
            {...props}
            text={text}
            onTextChange={setText}
            placeholder="描述你想生成的视频……"
          />
        </div>

        {/* 示例提示词：点击填入，可再编辑 */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-muted">试试：</span>
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setText(prompt)}
              className="rounded-full border border-border bg-panel px-3 py-1.5 text-[11px] text-muted transition hover:border-accent/40 hover:text-accent md:py-1"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
