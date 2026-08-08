/**
 * 内联 SVG 图标集：替代 emoji（🗑 ⏸ ▶ ⬇ ↻ ▸），跨平台渲染一致、跟随 currentColor。
 * 全部 aria-hidden——语义由按钮文本/aria-label 承担。
 */

interface IconProps {
  className?: string;
}

function base(className?: string) {
  return `inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em] ${className ?? ''}`;
}

/** ▶ 播放 / 继续 */
export function IconPlay({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className={base(className)}>
      <path d="M4.5 2.7v10.6c0 .8.9 1.3 1.6.9l8-5.3c.6-.4.6-1.4 0-1.8l-8-5.3c-.7-.4-1.6.1-1.6.9Z" />
    </svg>
  );
}

/** ⏸ 暂停 */
export function IconPause({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className={base(className)}>
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
    </svg>
  );
}

/** 🗑 删除 */
export function IconTrash({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M2 4h12M5.3 4V2.8c0-.4.4-.8.8-.8h3.8c.4 0 .8.4.8.8V4M12.7 4l-.6 9.2c0 .5-.4.8-.9.8H4.8c-.5 0-.9-.4-.9-.8L3.3 4" />
    </svg>
  );
}

/** ⬇ 下载 */
export function IconDownload({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M8 2v8m0 0 3.2-3.2M8 10 4.8 6.8M2.5 13.5h11" />
    </svg>
  );
}

/** ↻ 重跑 */
export function IconRerun({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M13.5 6.5A5.5 5.5 0 1 0 14 9.5M13.5 2.5v4h-4" />
    </svg>
  );
}

/** ▸ 品牌标记 / 空态装饰 */
export function IconBrand({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className={base(className)}>
      <path d="M5 3.2v9.6c0 .8.9 1.2 1.5.8l6.7-4.8c.5-.4.5-1.2 0-1.6L6.5 2.4c-.6-.4-1.5 0-1.5.8Z" />
    </svg>
  );
}
