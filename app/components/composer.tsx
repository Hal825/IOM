'use client';

import { useState } from 'react';

const MAX_CHARS = 2000;

interface ComposerProps {
  /** 成功则 resolve（输入框会被清空）；失败请 throw，横幅由 error 属性展示。 */
  onSubmit: (text: string) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

/** Codex 风格输入区：textarea + ⌘/Ctrl+Enter 提交 + 字符计数 + 错误横幅。 */
export function Composer({ onSubmit, submitting, error }: ComposerProps) {
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="rounded-xl border border-border bg-panel p-4 shadow-card transition-colors focus-within:border-accent/60"
    >
      <label htmlFor="composer-text" className="text-xs font-medium text-muted">
        视频描述
      </label>
      <textarea
        id="composer-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder="输入要生成视频的文本，例如：你好世界。这是一个测试视频。欢迎使用 OpenMontage。"
        rows={4}
        maxLength={MAX_CHARS}
        className="mt-2 w-full resize-y bg-transparent text-sm text-foreground outline-none placeholder:text-muted/70"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-muted">
          {text.length} / {MAX_CHARS}
          <span className="ml-3 hidden text-muted/60 sm:inline">Ctrl / ⌘ + Enter 快速提交</span>
        </span>
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="rounded-lg bg-accent px-5 py-1.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {submitting ? '提交中…' : '生成视频'}
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
