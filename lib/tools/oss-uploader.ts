/**
 * 阿里云 OSS 上传工具 — 将本地文件上传到 OSS 存储桶并返回公网 URL。
 *
 * 使用 OSS REST API + HMAC-SHA1 签名（不依赖第三方 SDK）。
 * 视频生成 API (happyhorse-1.1-i2v) 需要公网可访问的图片 URL 作为参考帧。
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

// ── 配置 ────────────────────────────────────────────

const OSS_REGION = process.env.OSS_REGION;
const OSS_BUCKET = process.env.OSS_BUCKET;
const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID;
const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET;

/** OSS 公网端点 (virtual-hosted style) */
function getOssEndpoint(): string {
  return `https://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com`;
}

/** 上传后文件的公网访问 URL */
function getPublicUrl(objectKey: string): string {
  return `${getOssEndpoint()}/${objectKey}`;
}

// ── 签名 ────────────────────────────────────────────

/**
 * 生成阿里云 OSS Authorization 头（签名 v2）。
 * 参考: https://help.aliyun.com/document_detail/31951.html
 */
function sign(
  verb: string,
  contentMd5: string,
  contentType: string,
  date: string,
  objectKey: string,
  ossHeaders: string = '',
): string {
  const resource = `/${OSS_BUCKET}/${objectKey}`;

  const stringToSign = [
    verb,
    contentMd5,
    contentType,
    date,
    ossHeaders + resource,
  ].join('\n');

  const sig = crypto
    .createHmac('sha1', OSS_ACCESS_KEY_SECRET!)
    .update(stringToSign)
    .digest('base64');

  return `OSS ${OSS_ACCESS_KEY_ID}:${sig}`;
}

// ── 公开 API ────────────────────────────────────────

export interface OssUploadResult {
  objectKey: string;
  publicUrl: string;
}

/**
 * 将本地文件上传到 OSS。
 * @param localPath 本地文件路径
 * @param remoteKey OSS 对象 key（如 "openmontage/characters/char-1/front.jpeg"）
 * @returns 上传结果（含公网 URL）
 */
export async function uploadFile(localPath: string, remoteKey: string): Promise<OssUploadResult> {
  if (!OSS_ACCESS_KEY_ID || !OSS_ACCESS_KEY_SECRET || !OSS_BUCKET || !OSS_REGION) {
    throw new Error('OSS 环境变量未配置（OSS_REGION / OSS_BUCKET / OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET）');
  }

  const fileBuffer = await fs.readFile(localPath);
  const contentType = getContentType(localPath);
  const date = new Date().toUTCString();

  const url = `${getOssEndpoint()}/${remoteKey}`;

  console.log(`[oss] 上传: ${path.basename(localPath)} → ${remoteKey}`);

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileBuffer.length),
      Date: date,
      Authorization: sign('PUT', '', contentType, date, remoteKey),
    },
    body: fileBuffer,
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`OSS 上传失败 ${resp.status}: ${errText.slice(0, 300)}`);
  }

  const publicUrl = getPublicUrl(remoteKey);
  console.log(`[oss] 完成: ${publicUrl}`);
  return { objectKey: remoteKey, publicUrl };
}

/**
 * 批量上传同一角色的四视图到 OSS。
 * @param localViews 本地四视图路径 { front, back, left, right }
 * @param jobId 任务 ID
 * @param characterId 角色 ID
 * @returns 四视图的公网 URL
 */
export async function uploadCharacterViews(
  localViews: { front: string; back: string; left: string; right: string },
  jobId: string,
  characterId: string,
): Promise<{ front: string; back: string; left: string; right: string }> {
  const views = ['front', 'back', 'left', 'right'] as const;
  const results: Record<string, string> = {};

  for (const view of views) {
    const ext = path.extname(localViews[view]) || '.jpeg';
    const remoteKey = `openmontage/${jobId}/characters/${characterId}/${view}${ext}`;
    const result = await uploadFile(localViews[view], remoteKey);
    results[view] = result.publicUrl;
  }

  return results as { front: string; back: string; left: string; right: string };
}

// ── 工具函数 ──────────────────────────────────────────

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mime: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return mime[ext] ?? 'application/octet-stream';
}

/** 检查 OSS 是否已配置 */
export function isOssConfigured(): boolean {
  return !!(OSS_ACCESS_KEY_ID && OSS_ACCESS_KEY_SECRET && OSS_BUCKET && OSS_REGION);
}
