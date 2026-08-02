/**
 * 内联视频预览。
 * `/api/tasks/{id}/download` 返回 video/mp4 流（或对 OSS 的 307 重定向），
 * 浏览器会忽略 attachment 头直接在 <video> 中播放。
 */
export function VideoPlayer({ taskId }: { taskId: string }) {
  return (
    <video
      controls
      playsInline
      preload="metadata"
      src={`/api/tasks/${taskId}/download`}
      className="aspect-video w-full rounded-lg border border-border bg-black"
    />
  );
}
