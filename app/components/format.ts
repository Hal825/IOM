/** 前端展示用的小工具（纯函数）。 */

/** Unix 毫秒时间戳 → “刚刚 / N 分钟前 / N 小时前 / N 天前”。 */
export function formatRelativeTime(createdAt: number): string {
  const minutes = Math.floor((Date.now() - createdAt) / 60_000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

/** ISO 时间戳 → "HH:MM"（节点卡/气泡的时间戳）。 */
export function formatClock(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toTimeString().slice(0, 5);
}
