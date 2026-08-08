import type { Metadata } from "next";
import "./globals.css";

// 字体说明：本项目为中文界面，曾用 next/font/google 加载 Geist（仅 latin 子集，
// 中文仍走系统字体），但构建期需访问 fonts.googleapis.com —— 离线/国内构建机
// 会直接 build 失败。已改为 globals.css 中的系统字体栈（--font-sans / --font-mono），
// 零网络依赖、零字体下载，视觉对中文 UI 无差异。

export const metadata: Metadata = {
  title: "OpenMontage — 文本生成视频",
  description: "输入文本，自动完成调研、脚本、素材与逐镜头视频生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
