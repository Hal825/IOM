/**
 * 阿里云 OSS 上传工具 — 将本地文件上传到 OSS 存储桶并返回公网 URL。
 *
 * 使用 OSS REST API + HMAC-SHA1 签名（不依赖第三方 SDK）。
 * 视频生成 API 需要公网可访问的图片 URL 作为参考帧。
 *
 * 设计要点：
 * - OSS key 镜像 manifest 相对路径：`openmontage/{relPath}`
 *   - `library/...`（库素材）key 跨任务稳定 → 公网 URL 可被 meta 缓存复用
 *   - `assets/{jobId}/...`（任务产物）key 按任务隔离
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

/** 由 manifest 相对路径推导 OSS 对象 key（镜像相对路径） */
export function relToOssKey(relPath: string): string {
  const normalized = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
  return `openmontage/${normalized}`;
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

/** 检查 OSS 是否已配置（本管线为硬依赖，未配置时应 fail fast） */
export function isOssConfigured(): boolean {
  return !!(OSS_ACCESS_KEY_ID && OSS_ACCESS_KEY_SECRET && OSS_BUCKET && OSS_REGION);
}

/**
 * 将本地文件上传到 OSS。
 * @param localPath 本地文件路径
 * @param remoteKey OSS 对象 key（如 "openmontage/34/scenes/scene_visual-1.png"）
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

// ── 工具函数 ──────────────────────────────────────────

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mime: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
  };
  return mime[ext] ?? 'application/octet-stream';
}
