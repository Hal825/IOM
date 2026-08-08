interface RailCollapseStripProps {
  /** 收起后窄条上显示的小标签（如「任务列表」「成品库」） */
  label: string;
  /** 展开方向图标：左栏用「⟩」（向右展开），右栏用「⟨」（向左展开） */
  icon: string;
  onExpand: () => void;
}

/**
 * 收起态窄条：桌面竖排（顶部展开按钮 + 旋转标签，`md:h-full` 填满通高 rail），
 * 移动端横排全宽（单列堆叠时保持可展开入口）。
 * 底色由所在 rail 的 aside 透出，不需要额外传色。
 */
export function RailCollapseStrip({ label, icon, onExpand }: RailCollapseStripProps) {
  return (
    <div className="flex flex-row items-center gap-2 px-2 py-2 md:h-full md:flex-col md:justify-start md:gap-4 md:py-4">
      <button
        type="button"
        onClick={onExpand}
        title={`展开${label}`}
        aria-label={`展开${label}`}
        aria-expanded="false"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm text-muted transition hover:bg-black/5 hover:text-foreground md:h-7 md:w-7"
      >
        {icon}
      </button>
      <span className="truncate text-[10px] font-medium text-muted md:[writing-mode:vertical-rl]">
        {label}
      </span>
    </div>
  );
}
