# 网络安全防御技术可视化学习知识库

本项目不仅是一个供人类用户浏览、学习、记录进度的可视化平台，更是一个**可扩展、可导出、可直接喂给 AI Agent（如 OpenClaw）的结构化知识库**。

## 核心设计理念
- **可视化学习界面**：用户通过高颜值的 Web 界面浏览四大分类、防御体系科技树、进阶路线图，并管理自己的学习进度。
- **结构化数据层**：所有的知识内容（分类、技术点、学习路径）以标准化的 JSON Schema 存储在 `src/data/` 目录中，与 UI 组件完全解耦。
- **高可扩展架构**：新增技术点、修改路线图只需修改数据文件，无需改动任何 UI 逻辑，组件将自动根据数据生成对应的卡片、树状图和流程图。
- **AI Agent 友好导出**：支持一键导出为 `JSON` 或 `Markdown ZIP` 压缩包，直接可作为语料库供大语言模型或 Agent 使用。

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
   生成的 \`cyber-knowledge-base.json\` 包含平台内所有的分类、技术点和学习路径。您可以直接通过 HTTP 请求将其注入到诸如 OpenClaw 的 knowledge 插件中，实现 Agent 的实时检索增强（RAG）。
2. **导出为 Markdown**:
   生成的 \`cyber-knowledge-base-md.zip\` 按照分类层级打包了所有的 Markdown 文档。每个 \`.md\` 文件顶部都包含 \`Frontmatter\` 元数据（id、name、category、tags 等），可供 Docusaurus、Obsidian 或 Agent 文档处理器解析并构建静态网站或向量数据库。

## 部署配置
项目已包含 \`vercel.json\`，可以直接推送至 GitHub 并连接到 Vercel 进行一键部署，所有的 React Router 路由刷新问题均已在配置中解决（Rewrites \`/*\` 到 \`/index.html\`）。
