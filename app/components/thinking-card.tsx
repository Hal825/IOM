'use client';

import { useEffect, useState } from 'react';

interface ThinkingLine {
  speaker: string;
  emoji: string;
  text: string;
}

/** 趣味对话：管线各「角色」的轮流心声（占位文案，可随时改） */
const THINKING_LINES: ThinkingLine[] = [
  { speaker: '研究节点', emoji: '🧠', text: '让我先读懂你的文本…' },
  { speaker: '导演', emoji: '🎬', text: '分析完毕，构思分镜中…' },
  { speaker: '编剧', emoji: '✍️', text: '台词写好了，动作戏再打磨下…' },
  { speaker: '美术', emoji: '🎨', text: '场景概念图马上好，先喝口咖啡…' },
  { speaker: '配音', emoji: '🎤', text: '试音中：大家好，欢迎收看…' },
  { speaker: '摄影机', emoji: '📽️', text: '各机位就位，Action！' },
  { speaker: '剪辑师', emoji: '✂️', text: '镜头都拍完了，开始拼接…' },
];

const ROTATE_MS = 2500;

/**
 * 思考中卡片：任务 busy 且还没有任何成果卡时显示。
 * 转圈 + 轮播趣味对话行（每行带 speaker 标签），每 2.5s 切换并有淡入。
 */
export function ThinkingCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % THINKING_LINES.length),
      ROTATE_MS
    );
    return () => clearInterval(timer);
  }, []);

  const line = THINKING_LINES[index];

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-accent/30 bg-accent/5 px-4 py-6 text-center">
      {/* 转圈：外圈淡 + 上缘 accent 旋转 */}
      <span className="relative flex h-9 w-9">
        <span className="absolute inset-0 rounded-full border-2 border-accent/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
      </span>

      {/* 趣味对话（key 随行变化 → 切换时淡入） */}
      <div key={line.text} className="animate-fade-in">
        <p className="text-[11px] font-medium text-muted">
          {line.emoji} {line.speaker} · 思考中
        </p>
        <p className="mt-1 text-sm text-foreground/90">{line.text}</p>
      </div>
    </div>
  );
}
