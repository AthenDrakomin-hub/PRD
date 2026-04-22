import { Category } from '../../categories';
import { TechItem } from '../../techItems';

export const traeSoloCategory: Category = {
  id: 'ai-dev-tools',
  name: 'AI 开发工具',
  description: '以 Trae SOLO 等大模型为核心的现代化智能开发辅助工具与 Agent 框架，聚焦于自动化编码、重构与架构生成。',
  icon: 'Zap',
  order: 5,
};

export const traeSoloTechItems: TechItem[] = [
  {
    id: 'trae-agent-mode',
    name: 'Agent 模式自主编程',
    categoryId: 'ai-dev-tools',
    description: '通过多步骤规划、自主执行工具调用（读写文件、运行命令）来完成复杂的开发任务。',
    coreFunction: '赋予 IDE "自主解决问题"的能力，大幅降低人类开发者编码与调试的认知负荷。',
    defenseMechanism: '内置沙盒与权限隔离，通过 Requires Approval (人工审批) 机制防止 Agent 误删关键文件或执行高危命令。',
    vulnerabilities: '对于上下文极其复杂的巨型遗留项目，大模型可能出现“幻觉”导致修改不相关的代码；严重依赖提示词的质量。',
    principle: '## Agent 模式原理\\nAgent 模式基于 ReAct (Reasoning and Acting) 架构。LLM 首先对用户的指令进行意图识别，生成一个 Todo List（任务规划）。随后，Agent 会循环执行 "思考 -> 调用工具 (如 `Read`, `Write`, `RunCommand`) -> 观察结果" 的过程。直到所有的任务目标被满足，才会终止循环并返回最终结果。',
    tools: ['Trae SOLO', 'OpenClaw', 'AutoGPT'],
    practiceSteps: ['在 Trae 中唤起 Agent 面板', '输入 "帮我用 React 写一个待办事项组件，并加上 Tailwind 样式"', '观察 Agent 如何自主创建文件、写入代码并安装依赖'],
    resources: [{ title: 'Trae 官方文档', url: 'https://docs.trae.ai' }],
    difficulty: 'medium',
    tags: ['Agent', '自主编程', 'Trae'],
    relatedTechIds: ['trae-mcp-integration'],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'trae-builder-mode',
    name: 'Builder 模式项目生成',
    categoryId: 'ai-dev-tools',
    description: '基于自然语言描述，从零到一自动搭建包含前后端与基础设施的完整项目骨架。',
    coreFunction: '消除项目初期繁琐的配置与脚手架搭建工作，秒级生成可运行的 MVP 版本。',
    defenseMechanism: '使用预定义的高质量项目模板 (Templates) 和依赖白名单，防止生成包含已知漏洞的第三方库版本。',
    vulnerabilities: '生成的架构可能不符合特定的企业级规范；复杂的微服务拆分仍需要人工介入调整。',
    principle: '## Builder 模式原理\\nBuilder 引擎解析用户的自然语言需求后，将其转换为结构化的架构描述 (Architecture Spec)。接着，它会匹配内部最佳实践的脚手架模板（如 Next.js + Tailwind + Prisma），并并行生成目录树与核心代码文件，最后自动执行 `npm install` 与 `npm run dev` 将应用拉起预览。',
    tools: ['Trae Builder', 'Vercel v0', 'Bolt.new'],
    practiceSteps: ['打开 Trae Builder', '输入 "生成一个包含用户登录与深色主题的博客后台"', '一键部署到本地或云端预览'],
    resources: [{ title: '现代化 Web 开发最佳实践', url: 'https://react.dev' }],
    difficulty: 'low',
    tags: ['Builder', '代码生成', '脚手架'],
    relatedTechIds: ['trae-agent-mode'],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'trae-mcp-integration',
    name: 'MCP 协议扩展集成',
    categoryId: 'ai-dev-tools',
    description: '通过 Model Context Protocol (MCP) 让 AI Agent 安全地连接外部数据源与本地工具。',
    coreFunction: '赋予 Agent "联网"与"感知物理世界"的能力，如读取 Figma 设计稿、查询内部数据库或调用 GitHub API。',
    defenseMechanism: '严格的 MCP Server 鉴权与 Tool 级别的粒度控制，防止 Agent 越权访问非授权数据。',
    vulnerabilities: '若恶意 MCP Server 注入了 Prompt Injection，可能导致 Agent 做出违背用户意愿的危险操作。',
    principle: '## MCP (Model Context Protocol) 原理\\nMCP 是一种标准化的 JSON-RPC 协议。IDE 充当 MCP Client，而外部服务（如数据库、Figma、Git）提供 MCP Server。Agent 需要数据时，会通过 Client 向 Server 发起特定工具 (Tool) 的调用请求，Server 验证权限后返回结构化数据，使得大模型在不泄露底层密钥的情况下获得上下文。',
    tools: ['Model Context Protocol', 'FastMCP', 'Trae MCP SDK'],
    practiceSteps: ['在本地启动一个 SQLite MCP Server', '在 Trae 中配置该 Server 连接', '让 Agent "查询最新的用户表数据并生成可视化图表"'],
    resources: [{ title: 'Model Context Protocol 官网', url: 'https://modelcontextprotocol.io' }],
    difficulty: 'high',
    tags: ['MCP', '扩展集成', '上下文'],
    relatedTechIds: ['trae-agent-mode', 'trae-context-engine'],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'trae-context-engine',
    name: '智能上下文感知引擎',
    categoryId: 'ai-dev-tools',
    description: '实时索引并分析庞大的本地代码库，为大模型提供精准的语义上下文。',
    coreFunction: '解决大模型上下文窗口 (Context Window) 有限的问题，实现针对百万行级代码库的精准问答与修改。',
    defenseMechanism: '本地向量数据库与检索模型 (Embedding Model) 运行，确保核心代码资产不泄露到公有云。',
    vulnerabilities: '对于高度动态生成或深度反射 (Reflection) 的代码，静态分析可能遗漏关键调用链。',
    principle: '## 智能上下文感知原理\\n代码库首先被解析为抽象语法树 (AST)，并结合 Tree-sitter 等工具提取出函数、类与依赖图谱。随后，本地嵌入模型 (如 BGE-m3) 将这些代码片段向量化并存入向量数据库 (Vector DB)。当用户提问时，引擎通过混合检索 (Hybrid Search - 关键词 + 语义) 召回最相关的 Top-K 代码片段，注入到 LLM 的 Prompt 中 (即 RAG 技术)。',
    tools: ['Trae Context Engine', 'Tree-sitter', 'ChromaDB'],
    practiceSteps: ['在 Trae 中打开一个复杂的开源项目', '直接询问 "这个项目的用户认证逻辑是在哪里处理的？"', '查看引擎检索出的相关文件与代码块'],
    resources: [{ title: 'RAG (检索增强生成) 在代码领域的应用', url: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' }],
    difficulty: 'high',
    tags: ['上下文', 'RAG', '语义检索'],
    relatedTechIds: ['trae-mcp-integration'],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  }
];
