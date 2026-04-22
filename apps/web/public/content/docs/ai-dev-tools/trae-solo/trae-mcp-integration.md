# MCP 协议扩展集成

## 核心作用
赋予 Agent "联网"与"感知物理世界"的能力，如读取 Figma 设计稿、查询内部数据库或调用 GitHub API。

## MCP (Model Context Protocol) 原理\nMCP 是一种标准化的 JSON-RPC 协议。IDE 充当 MCP Client，而外部服务（如数据库、Figma、Git）提供 MCP Server。Agent 需要数据时，会通过 Client 向 Server 发起特定工具 (Tool) 的调用请求，Server 验证权限后返回结构化数据，使得大模型在不泄露底层密钥的情况下获得上下文。

## 主要防御手段 (安全隔离机制)
严格的 MCP Server 鉴权与 Tool 级别的粒度控制，防止 Agent 越权访问非授权数据。

## 漏洞与局限
若恶意 MCP Server 注入了 Prompt Injection，可能导致 Agent 做出违背用户意愿的危险操作。

## 典型工具
- Model Context Protocol
- FastMCP
- Trae MCP SDK

## 实践建议
1. 在本地启动一个 SQLite MCP Server
2. 在 Trae 中配置该 Server 连接
3. 让 Agent "查询最新的用户表数据并生成可视化图表"

## 学习资源
- [Model Context Protocol 官网](https://modelcontextprotocol.io)
