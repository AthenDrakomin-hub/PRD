# AI/ML 驱动安全与 AI 安全防护

## 核心作用
这是一个双刃剑：既利用大语言模型 (LLM) 和机器学习提升防御效率，又要针对 AI 系统本身的脆弱性进行安全加固。

## 实现原理
1. **AI 赋能防御**: 利用大模型自动分析海量告警上下文、生成逆向分析报告、自动化编写 Yara/Suricata 规则。
2. **保护 AI 本身**: 部署输入/输出护栏 (Guardrails)，利用语义分析过滤提示词注入 (Prompt Injection) 和防止模型生成有害内容或泄露训练隐私。

## 主要防御手段
- 防御针对 LLM 的越狱攻击 (Jailbreak) 和数据投毒。
- 实现智能自动化的蓝队防御与红队测试。

## 漏洞与局限
- **非确定性风险**：LLM 具有“幻觉”特性，AI 护栏容易出现高误报，或被复杂的逻辑嵌套提示词绕过。
- **攻击者的 AI 化**：黑客同样在使用 LLM 自动化生成多态恶意软件和极其逼真的钓鱼邮件。

## 典型工具
- **LLM Guard**: 提供针对 LLM 交互的输入/输出安全扫描。
- **Garak**: 强大的开源 LLM 漏洞与越狱扫描器。
- **NVIDIA NeMo Guardrails**: 工业级的 LLM 护栏构建工具包。

## 实践建议
部署本地 Ollama 运行一个小型开源模型，在其前端接入 LLM Guard，测试并拦截带有诸如“忽略之前所有指令”的恶意越狱输入。

## 学习资源
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Garak GitHub 仓库](https://github.com/leondz/garak)\n