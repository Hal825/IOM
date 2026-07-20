import type { VisualAsset } from '@/lib/types';

/**
 * 画面匹配工具 — Unsplash + Pexels 双路故障转移。
 *
 * 策略：
 * 1. 从场景文本提取搜索关键词
 * 2. 优先请求 Unsplash（画质更高，适合背景）
 * 3. Unsplash 失败/无结果 → 故障转移到 Pexels
 * 4. 双重失败 → 返回纯色背景（绝不阻断流程）
 */

// ── 配置（全部来自环境变量）─────────────────────────

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// ── 类型 ────────────────────────────────────────────

interface UnsplashPhoto {
  urls: { regular: string };
  user: { name: string };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

interface PexelsPhoto {
  src: { large: string };
  photographer: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

// ── 关键词提取 ──────────────────────────────────────

/**
 * 从场景文本中提取搜索关键词（纯规则，不依赖 LLM）。
 * - 移除标点符号
 * - 保留有意义的词语
 * - 最多返回前 30 个字符
 */
function extractKeyword(text: string): string {
  // 去掉标点符号和空白
  const cleaned = text.replace(
    /[，。！？；、""''《》（）【】…—\s,.!?;:'"()\[\]{}<>@#$%^&*+=~`|\\/\-]/g,
    ''
  );
  return cleaned.slice(0, 30) || text.slice(0, 30);
}

// ── Unsplash API ────────────────────────────────────

async function searchUnsplash(
  keyword: string
): Promise<{ url: string; photographer: string } | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;

  try {
    const params = new URLSearchParams({
      query: keyword,
      per_page: '1',
      orientation: 'landscape',
    });
    const resp = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!resp.ok) return null;

    const data = (await resp.json()) as UnsplashResponse;
    if (!data.results?.length) return null;

    return {
      url: data.results[0].urls.regular,
      photographer: data.results[0].user.name,
    };
  } catch {
    return null;
  }
}

// ── Pexels API ──────────────────────────────────────

async function searchPexels(
  keyword: string
): Promise<{ url: string; photographer: string } | null> {
  if (!PEXELS_API_KEY) return null;

  try {
    const params = new URLSearchParams({
      query: keyword,
      per_page: '1',
      orientation: 'landscape',
    });
    const resp = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!resp.ok) return null;

    const data = (await resp.json()) as PexelsResponse;
    if (!data.photos?.length) return null;

    return {
      url: data.photos[0].src.large,
      photographer: data.photos[0].photographer,
    };
  } catch {
    return null;
  }
}

// ── 纯色兜底 ────────────────────────────────────────

/** 基于字符串哈希生成稳定的 HSL 颜色 */
function generateSolidColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // 32-bit int
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 30%)`;
}

// ── 公开 API ────────────────────────────────────────

/**
 * 为单个场景匹配画面素材。
 * Unsplash → Pexels → 纯色 三级降级。
 */
async function matchOneVisual(
  text: string,
  sceneIndex: number
): Promise<VisualAsset> {
  const keyword = extractKeyword(text);
  console.log(`[visual] 场景 ${sceneIndex} 关键词: "${keyword}"`);

  // 1. Unsplash
  const unsplashResult = await searchUnsplash(keyword);
  if (unsplashResult) {
    console.log(`[visual] 场景 ${sceneIndex} → Unsplash`);
    return {
      sceneIndex,
      type: 'image',
      url: unsplashResult.url,
      source: 'unsplash',
      photographer: unsplashResult.photographer,
      duration: 0, // 由 compose 阶段回填
    };
  }

  // 2. Pexels
  const pexelsResult = await searchPexels(keyword);
  if (pexelsResult) {
    console.log(`[visual] 场景 ${sceneIndex} → Pexels`);
    return {
      sceneIndex,
      type: 'image',
      url: pexelsResult.url,
      source: 'pexels',
      photographer: pexelsResult.photographer,
      duration: 0,
    };
  }

  // 3. 纯色兜底
  console.log(`[visual] 场景 ${sceneIndex} → 纯色兜底`);
  return {
    sceneIndex,
    type: 'solid',
    url: generateSolidColor(text),
    source: 'solid',
    duration: 0,
  };
}

/**
 * 为一组脚本场景批量匹配画面素材（内部并发请求）。
 */
export async function matchVisuals(
  scenes: Array<{ text: string }>,
  sceneIndexOffset: number = 0
): Promise<VisualAsset[]> {
  if (!scenes.length) return [];

  console.log(`[visual] 开始为 ${scenes.length} 个场景匹配画面...`);

  // 所有场景并发请求（每个场景内部串行 Unsplash→Pexels，场景之间并行）
  const results = await Promise.all(
    scenes.map((scene, i) => matchOneVisual(scene.text, sceneIndexOffset + i))
  );

  console.log(
    `[visual] 完成: Unsplash=${results.filter((r) => r.source === 'unsplash').length}, ` +
      `Pexels=${results.filter((r) => r.source === 'pexels').length}, ` +
      `兜底=${results.filter((r) => r.source === 'solid').length}`
  );

  return results;
}
