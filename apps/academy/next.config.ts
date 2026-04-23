import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 启用静态导出，由私有化 Nginx 托管
  images: {
    unoptimized: true, // 静态导出不支持默认图片优化
  },
};

export default nextConfig;
