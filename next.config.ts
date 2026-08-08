import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 隐藏开发环境的屏幕指示器（Next.js Dev Tools 徽标）。
  // 该徽标由框架注入、文案为英文且仅 dev 模式存在；生产构建本就没有。
  devIndicators: false,
  // 允许通过环境变量改产物目录（审计/CI 场景下避免清理默认 .next）
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
