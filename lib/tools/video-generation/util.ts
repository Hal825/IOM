/**
 * 视频生成纯函数工具 — 并发窗口 / 时长钳制 / 运镜描述构建。
 * 全部无副作用，便于单测。
 */

import type { SceneVideoSpec } from '@/lib/types';

/** 并发窗口执行器：最多 limit 个任务同时运行；任一失败整体失败（零容错） */
export async function runWithConcurrency<T>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  const safeLimit = Math.max(1, Math.floor(limit));
  if (items.length === 0) return;

  let cursor = 0;
  let firstError: unknown = null;

  const next = async (): Promise<void> => {
    if (firstError) return; // 已有失败：不再启动新任务
    const idx = cursor++;
    if (idx >= items.length) return;

    try {
      await worker(items[idx], idx);
    } catch (err) {
      firstError ??= err; // 记录首个错误，其余排空
    }
    await next(); // 拉取下一项（排空在飞任务）
  };

  const runners = Array.from({ length: Math.min(safeLimit, items.length) }, () => next());
  await Promise.all(runners);
  if (firstError) throw firstError;
}

/** 时长钳制并取整到 [min, max]（DashScope happyhorse 限制 3-15s） */
export function clampDuration(seconds: number, min = 3, max = 15): number {
  const rounded = Math.round(seconds);
  return Math.min(max, Math.max(min, rounded));
}

/** 宽x高 → 视频档位（480P/720P/1080P/2K/4K），按较短边判定；非宽x高格式返回 null */
export function resolutionToTier(resolution: string): string | null {
  const m = resolution.trim().toLowerCase().match(/^(\d+)\s*[x×]\s*(\d+)$/);
  if (!m) return null;
  const short = Math.min(Number(m[1]), Number(m[2]));
  if (short <= 480) return '480P';
  if (short <= 720) return '720P';
  if (short <= 1080) return '1080P';
  if (short <= 1440) return '2K';
  return '4K';
}

/** 由 SceneVideoSpec.storyboard 构建运镜/构图英文描述（非空项以 '. ' 连接） */
export function buildMotionDescription(board: SceneVideoSpec['storyboard']): string {
  const parts: string[] = [];

  const shot = board.shot;
  if (shot.movement?.trim()) parts.push(`Movement: ${shot.movement}`);
  if (shot.type?.trim()) parts.push(`Shot type: ${shot.type}`);
  if (shot.angle?.trim()) parts.push(`Angle: ${shot.angle}`);
  if (shot.focus?.trim()) parts.push(`Focus: ${shot.focus}`);
  if (board.composition?.trim()) parts.push(`Composition: ${board.composition}`);
  if (board.lighting?.trim()) parts.push(`Lighting: ${board.lighting}`);
  if (board.atmosphere?.trim()) parts.push(`Atmosphere: ${board.atmosphere}`);
  if (typeof board.motionLevel === 'number') parts.push(`Motion level (1-5): ${board.motionLevel}`);
  for (const ve of board.visualElements ?? []) {
    if (ve.trim()) parts.push(`Visual element: ${ve}`);
  }

  return parts.join('. ');
}
