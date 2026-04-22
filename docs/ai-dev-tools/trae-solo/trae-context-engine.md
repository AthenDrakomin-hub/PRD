# 智能上下文感知引擎

## 核心作用
解决大模型上下文窗口 (Context Window) 有限的问题，实现针对百万行级代码库的精准问答与修改。

## 智能上下文感知原理\n代码库首先被解析为抽象语法树 (AST)，并结合 Tree-sitter 等工具提取出函数、类与依赖图谱。随后，本地嵌入模型 (如 BGE-m3) 将这些代码片段向量化并存入向量数据库 (Vector DB)。当用户提问时，引擎通过混合检索 (Hybrid Search - 关键词 + 语义) 召回最相关的 Top-K 代码片段，注入到 LLM 的 Prompt 中 (即 RAG 技术)。

## 主要防御手段 (安全隔离机制)
本地向量数据库与检索模型 (Embedding Model) 运行，确保核心代码资产不泄露到公有云。

## 漏洞与局限
对于高度动态生成或深度反射 (Reflection) 的代码，静态分析可能遗漏关键调用链。

## 典型工具
- Trae Context Engine
- Tree-sitter
- ChromaDB

## 实践建议
1. 在 Trae 中打开一个复杂的开源项目
2. 直接询问 "这个项目的用户认证逻辑是在哪里处理的？"
3. 查看引擎检索出的相关文件与代码块

## 学习资源
- [RAG (检索增强生成) 在代码领域的应用](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)
