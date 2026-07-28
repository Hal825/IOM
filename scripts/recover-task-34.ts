/**
 * Task 34 恢复脚本 — 生成缺失的 shot-5 视频 + 合并最终视频
 *
 * 用途：LangGraph 管线在 shot_video_sequential 节点中断，
 * shots 1-4 已完成，shot-5 缺失。本脚本：
 *   1. 将场景图和角色图上传到 OSS（供视频生成 API 引用）
 *   2. 调用 DashScope happyhorse-1.1-i2v 生成 shot-5
 *   3. 使用 FFmpeg 拼接 5 个镜头 + 合成音轨
 *
 * 运行：npx tsx --env-file=.env scripts/recover-task-34.ts
 */

import path from 'node:path';
import fs from 'node:fs';
import { uploadFile, uploadCharacterViews, isOssConfigured } from '../lib/tools/oss-uploader';
import { generateSingleVideo } from '../lib/tools/shot-video-generator';

// ═══════════════════════════════════════════════════════
// 任务 34 的参数（从已完成产物中恢复）
// ═══════════════════════════════════════════════════════

const JOB_ID = '34';
const ASSET_DIR = path.resolve('./storage/assets/asset-1785237619930');
const SCENES_DIR = path.resolve(`./storage/scenes/${JOB_ID}`);
const AUDIO_DIR = path.resolve('./storage/audio/tts-1785237619931');

// shot-5 参数（从 scene-texts.json + aligned audio duration 恢复）
const SHOT_5_PARAMS = {
  sceneId: 'shot-5',
  duration: 7,
  styleStrength: 0.8,
  motionDescription:
    'A burst of light explodes into a shower of glowing particles drifting like fireflies. Bamboo leaves fall slowly one by one. Swordsman and mage stand side by side, robes fluttering gently. Camera pulls back from medium shot to a wider, tranquil composition. Ink-wash colors blend into a serene atmosphere.',
  negativePrompt: 'text, violence, dark shadows, explosions, blood',
};

// 角色 ID 列表（从 asset 目录推断）
const CHARACTER_IDS = ['char-1', 'char-2'];

// ═══════════════════════════════════════════════════════
// 主流程
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Task 34 恢复 — shot-5 生成 + 视频拼接  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  // ── Step 1: 准备 OSS URLs ─────────────────────
  console.log('▶ Step 1: 准备 OSS 公网 URLs...');

  // 场景背景图
  const sceneLocalPath = path.join(ASSET_DIR, 'scenes', 'scene_bamboo_clearing_01.png');
  if (!fs.existsSync(sceneLocalPath)) {
    throw new Error(`场景图不存在: ${sceneLocalPath}`);
  }

  let sceneUrl: string;
  if (isOssConfigured()) {
    console.log('  OSS 已配置，上传场景图...');
    const sceneOssResult = await uploadFile(
      sceneLocalPath,
      `openmontage/${JOB_ID}/scenes/scene_bamboo_clearing_01.png`
    );
    sceneUrl = sceneOssResult.publicUrl;
  } else {
    console.warn('  ⚠ OSS 未配置，使用本地路径（视频 API 可能无法访问）');
    sceneUrl = sceneLocalPath;
  }

  // 角色视图
  const characterImageUrls: string[] = [];
  if (isOssConfigured()) {
    for (const charId of CHARACTER_IDS) {
      const charDir = path.join(ASSET_DIR, 'characters', charId);
      const views = {
        front: path.join(charDir, 'front.jpeg'),
        back: path.join(charDir, 'back.jpeg'),
        left: path.join(charDir, 'left.jpeg'),
        right: path.join(charDir, 'right.jpeg'),
      };
      console.log(`  上传角色 ${charId} 四视图...`);
      try {
        const urls = await uploadCharacterViews(views, JOB_ID, charId);
        characterImageUrls.push(urls.front, urls.back, urls.left, urls.right);
      } catch (err) {
        console.warn(`  ⚠ 角色 ${charId} 上传失败: ${(err as Error).message}`);
      }
    }
  }

  console.log(`  场景 URL: ${sceneUrl}`);
  console.log(`  角色图片: ${characterImageUrls.length} 张\n`);

  // ── Step 2: 生成 shot-5 ────────────────────────
  console.log('▶ Step 2: 生成 shot-5 视频...');
  console.log(`  motion: "${SHOT_5_PARAMS.motionDescription.slice(0, 80)}..."`);
  console.log(`  duration: ${SHOT_5_PARAMS.duration}s`);
  console.log(`  参考图: 1 场景 + ${characterImageUrls.length} 角色`);

  const videoBuffer = await generateSingleVideo({
    sceneImagePath: sceneUrl,
    characterImagePaths: characterImageUrls,
    motionDescription: SHOT_5_PARAMS.motionDescription,
    negativePrompt: SHOT_5_PARAMS.negativePrompt,
    duration: SHOT_5_PARAMS.duration,
    styleStrength: SHOT_5_PARAMS.styleStrength,
  });

  const shot5Path = path.join(SCENES_DIR, 'shot-5.mp4');
  fs.mkdirSync(SCENES_DIR, { recursive: true });
  fs.writeFileSync(shot5Path, videoBuffer);
  console.log(`  ✓ shot-5 已保存: ${shot5Path} (${(videoBuffer.length / 1024 / 1024).toFixed(1)} MB)\n`);

  // ── Step 3: FFmpeg 拼接 ────────────────────────
  console.log('▶ Step 3: FFmpeg 拼接最终视频...');
  await mergeAllShots();
}

// ═══════════════════════════════════════════════════════
// FFmpeg 拼接
// ═══════════════════════════════════════════════════════

async function mergeAllShots(): Promise<void> {
  const SHOT_COUNT = 5;
  const outputDir = path.resolve('./storage/output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${JOB_ID}.mp4`);

  // 检查所有文件
  for (let i = 1; i <= SHOT_COUNT; i++) {
    const vPath = path.join(SCENES_DIR, `shot-${i}.mp4`);
    const aPath = path.join(AUDIO_DIR, `shot-${i}_aligned.mp3`);
    if (!fs.existsSync(vPath)) throw new Error(`视频缺失: ${vPath}`);
    if (!fs.existsSync(aPath)) throw new Error(`音频缺失: ${aPath}`);
  }

  // 加载 fluent-ffmpeg
  const FFMPEG_PATH = process.env.FFMPEG_PATH;
  let ffmpegFn: any;
  try {
    const ffmpegModule = require('fluent-ffmpeg');
    if (FFMPEG_PATH) ffmpegModule.setFfmpegPath(FFMPEG_PATH);
    ffmpegFn = ffmpegModule;
  } catch {
    throw new Error('fluent-ffmpeg 未安装');
  }

  await new Promise<void>((resolve, reject) => {
    const cmd = ffmpegFn();

    // 输入：5 个视频 + 5 个对齐音频
    for (let i = 1; i <= SHOT_COUNT; i++) {
      cmd.input(path.join(SCENES_DIR, `shot-${i}.mp4`));
    }
    for (let i = 1; i <= SHOT_COUNT; i++) {
      cmd.input(path.join(AUDIO_DIR, `shot-${i}_aligned.mp3`));
    }

    // 构建 filter
    const vInputs: string[] = [];
    const aInputs: string[] = [];
    for (let i = 0; i < SHOT_COUNT; i++) {
      vInputs.push(`[${i}:v]`);
      aInputs.push(`[${SHOT_COUNT + i}:a]`);
    }

    const vConcat = `${vInputs.join('')}concat=n=${SHOT_COUNT}:v=1:a=0[vout]`;
    const aConcat = `${aInputs.join('')}concat=n=${SHOT_COUNT}:v=0:a=1[aout]`;

    cmd
      .complexFilter([vConcat, aConcat], ['vout', 'aout'])
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-map', '[vout]', '-map', '[aout]'])
      .on('end', () => {
        console.log(`  ✓ 最终视频: ${outputPath}`);
        const stat = fs.statSync(outputPath);
        console.log(`  ✓ 文件大小: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);
        resolve();
      })
      .on('error', (err: Error) => {
        console.error('  ✗ FFmpeg 拼接失败:', err.message);
        reject(err);
      })
      .run();
  });
}

main().catch((err) => {
  console.error('\n✗ 恢复失败:', err.message);
  process.exit(1);
});
