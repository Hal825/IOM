'use client';

import { useState } from 'react';

const MAX_CHARS = 2000;

interface CreateFormProps {
  /** 成功则 resolve（输入框会被清空）；失败请 throw，错误由 error 属性展示。 */
  onSubmit: (text: string) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

/**
 * 大输入框：居中舒适的 textarea + 字符计数 + 提交按钮 + 错误横幅。
 * 与 Composer 同源：⌘/Ctrl+Enter 快速提交，≤2000 字。
 */
function LargeComposer({
  onSubmit,
  submitting,
  error,
  placeholder,
}: CreateFormProps & { placeholder: string }) {
  const [text, setText] = useState('');

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    try {
      await onSubmit(trimmed);
      setText('');
    } catch {
      /* 保留草稿；错误信息通过 error 属性展示 */
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-accent/40 bg-panel p-5 shadow-card transition-colors focus-within:border-accent/60">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
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
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-muted">
          {text.length} / {MAX_CHARS}
          <span className="ml-3 hidden text-muted/60 sm:inline">Ctrl / ⌘ + Enter 快速提交</span>
        </span>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={!text.trim() || submitting}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {submitting ? '提交中…' : '生成视频'}
        </button>
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
 * 初始状态页 / 新建任务页：内容区置空，大输入框横跨「内容区 + 输入区」整个右列（视觉舒适）。
 * 默认进入此视图，点选侧栏任务才切到详情；示例提示词留待后续实现。
 */
export function EmptyHero(props: CreateFormProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="m-auto w-full max-w-xl">
        <LargeComposer {...props} placeholder="描述你想生成的视频……" />
      </div>
    </section>
  );
}
