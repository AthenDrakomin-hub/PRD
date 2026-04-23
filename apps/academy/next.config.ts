import type { NextConfig } from "next";

// 自动适配 GitHub Pages (自带部署) 的 basePath
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = '';

if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  // GITHUB_REPOSITORY 格式为 "owner/repo"
  repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
}

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 启用静态导出
  basePath: isGithubActions ? `/${repo}` : '',
  assetPrefix: isGithubActions ? `/${repo}/` : '',
  images: {
    unoptimized: true, // GitHub Pages 不支持默认图片优化
  },
};

export default nextConfig;
