# KForge | 墟

KForge | 墟 是一个面向个人/团队的“知识锻造库”：用可视化界面梳理体系，用结构化数据沉淀内容，并支持一键导出为 AI Agent 可直接摄取的语料包。

一句话：在废墟中锻造知识，在暗处淬炼锋芒。

## 核心设计理念
- 可视化学习：分类卡片、科技树、学习路径、个人进度与笔记
- 数据与 UI 解耦：核心知识以 TypeScript 结构化数据存储在 `src/data/`
- 高扩展：新增内容只改数据文件，页面自动更新
- AI-Ready 导出：一键导出 JSON / Markdown ZIP，便于 RAG 与 Agent 体系接入

## 技术栈
- **前端框架**: React 18 + TypeScript + Vite
- **路由与状态**: React Router v6 + Zustand (配合 localStorage 状态持久化)
- **UI & 样式**: Tailwind CSS (高度定制的暗黑极客主题), lucide-react 图标
- **可视化**: ECharts (科技树图), React Flow (进阶路线图)
- **文档与导出**: react-markdown, jszip, file-saver

## 本地运行指南

1. **安装依赖**
   \`\`\`bash
   npm install
   # 或使用 pnpm
   pnpm install
   \`\`\`

2. **启动本地开发服务器**
   \`\`\`bash
   npm run dev
   # 或
   pnpm dev
   \`\`\`
   浏览器访问 http://localhost:5173 即可预览。

3. **构建生产版本**
   \`\`\`bash
   npm run build
   # 或
   pnpm build
   \`\`\`
   构建产物将输出在 \`dist/\` 目录下。

## 数据结构说明与扩展指南

本项目的数据文件统一放置在 \`src/data/\` 目录下，包含：
- \`categories.ts\`: 防御技术大类定义
- \`techItems.ts\`: 具体防御技术点的详细结构化信息
- \`learningPath.ts\`: 进阶学习路线及其关联关系

### 如何新增内容
如果您希望添加一个新的安全防御技术，例如“容器安全监控”，仅需打开 \`src/data/techItems.ts\` 并添加如下对象：

\`\`\`typescript
{
  id: 'container-security-monitor',
  name: '容器安全监控',
  categoryId: 'app-security',
  description: '持续监控容器运行时的状态与异常系统调用。',
  coreFunction: '防御容器逃逸、特权提权等云原生攻击。',
  defenseMechanism: '利用 eBPF 技术捕获内核级别的异常事件。',
  vulnerabilities: '内核版本要求较高；可能对业务产生少量性能开销。',
  principle: '## 容器安全监控原理\\n\\n...',
  tools: ['Falco', 'Tetragon', 'Cilium'],
  practiceSteps: ['部署 eBPF Agent', '配置策略文件', '观测异常告警'],
  resources: [{ title: 'Cilium 官方文档', url: 'https://cilium.io' }],
  difficulty: 'high',
  tags: ['云原生', '容器安全', 'eBPF'],
  relatedTechIds: ['edr'],
  createdAt: '2023-11-01T00:00:00Z',
  updatedAt: '2023-11-01T00:00:00Z'
}
\`\`\`
保存后，UI 将自动在分类详情页、科技树以及导出包中体现该内容。

## 导出知识库供 AI Agent 使用

在平台的首页或导航栏右上角，点击 **“导出知识库”** 按钮。

1. **导出为 JSON**:
   生成的 `kforge-knowledge-base.json` 包含 `meta(品牌信息)`、所有分类、技术点、学习路径以及你的学习进度/笔记，可直接作为 RAG 语料或 Agent 输入。
2. **导出为 Markdown**:
   生成的 `kforge-knowledge-base-md.zip` 按分类层级打包所有 Markdown 文档，并额外包含根目录 `README.md`（品牌与说明）。每个 `.md` 文件顶部包含 `Frontmatter`（含 project/id/category/tags 等），便于被 AI Agent/Obsidian/静态站点解析。

## 部署配置
项目已配置了 GitHub Actions，可以直接通过 GitHub Pages 进行部署。所有的 React Router 路由刷新问题均已在配置中解决（打包时生成 `404.html` 保证 SPA 路由正常跳转）。

在 GitHub 仓库设置中，找到 **Pages**，将 **Build and deployment** 下的 **Source** 设置为 **GitHub Actions** 即可自动部署。

## 贡献指南

欢迎任何形式的贡献！如果您有新的安全防御技术、工具推荐或是更好的可视化想法，请：
1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开源协议

本项目采用 MIT 协议开源 - 详情请查看 [LICENSE](LICENSE) 文件。
