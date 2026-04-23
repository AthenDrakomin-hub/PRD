import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 启用静态导出，专为 GitHub Pages 设计
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 默认的图片优化
  },
};

export default nextConfig;
