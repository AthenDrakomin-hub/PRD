# Agent 模式自主编程

## 核心作用
赋予 IDE "自主解决问题"的能力，大幅降低人类开发者编码与调试的认知负荷。

## Agent 模式原理\nAgent 模式基于 ReAct (Reasoning and Acting) 架构。LLM 首先对用户的指令进行意图识别，生成一个 Todo List（任务规划）。随后，Agent 会循环执行 "思考 -> 调用工具 (如 `Read`, `Write`, `RunCommand`) -> 观察结果" 的过程。直到所有的任务目标被满足，才会终止循环并返回最终结果。

## 主要防御手段 (安全隔离机制)
内置沙盒与权限隔离，通过 Requires Approval (人工审批) 机制防止 Agent 误删关键文件或执行高危命令。

## 漏洞与局限
对于上下文极其复杂的巨型遗留项目，大模型可能出现“幻觉”导致修改不相关的代码；严重依赖提示词的质量。

## 典型工具
- Trae SOLO
- OpenClaw
- AutoGPT

## 实践建议
1. 在 Trae 中唤起 Agent 面板
2. 输入 "帮我用 React 写一个待办事项组件，并加上 Tailwind 样式"
3. 观察 Agent 如何自主创建文件、写入代码并安装依赖

## 学习资源
- [Trae 官方文档](https://docs.trae.ai)
