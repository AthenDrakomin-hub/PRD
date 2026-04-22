import React, { useState } from 'react';
import { Bot, Copy, ExternalLink, Check, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { TechItem } from '../data/techItems';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiExplanationProps {
  tech: TechItem;
}

const AiExplanation: React.FC<AiExplanationProps> = ({ tech }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // 生成专为 AI 大模型准备的结构化 Prompt
  const prompt = `你是一位拥有10年经验的高级网络安全架构师。请为我详细解释以下技术点，并遵循指定的结构：

**技术名称**：${tech.name}
**所属领域**：网络安全防御
**简要描述**：${tech.description}
**当前难度**：${tech.difficulty === 'high' ? '专家' : tech.difficulty === 'medium' ? '进阶' : '入门'}

请按以下要求回答：
1. **用费曼技巧解释**：用一个通俗易懂的现实生活比喻来解释它的核心原理。
2. **实战落地**：如果我是一个中级工程师，我想在生产环境中落地这项技术，需要避开哪3个最致命的坑？
3. **面试考察**：如果去大厂面试这个技术点，面试官通常会问的2个最核心、最有深度的问题是什么，并给出简短答案。
4. **工具链搭配**：这项技术通常和哪些其他安全工具配合使用效果最好？（请说明原因）

请保持回答专业、简洁、结构化，并使用 Markdown 格式。`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    // 如果已经有结果了，再次点击就是重新生成
    setAiResponse('');
    setIsGenerating(true);

    // TODO: 这里将来替换为您自己接入的大模型 API 接口
    // fetch('/api/llm/chat', { method: 'POST', body: JSON.stringify({ prompt }) })

    // 模拟大模型的流式返回打字机效果
    const mockResponse = `### 1. 费曼技巧解释 ${tech.name}
想象一下你正在管理一座有着严格安保的高级公寓（你的服务器）。过去，如果有人想要检查每个进出房间的人的包裹（网络流量/系统调用），他必须把墙砸掉，或者给每个房间都安装一套笨重的监控设备（修改内核源码/加载内核模块）。

而 **${tech.name}** 就像是给这座公寓的每一个门缝、每一个电梯都安装了纳米级的“隐形摄像头”。你不需要破坏任何建筑结构，只要写几行规则，摄像头就能实时捕捉到谁在什么时候按了什么按钮。这就是它的核心：**安全、极速、无侵入**。

---

### 2. 实战落地的 3 个致命坑

*   **坑一：版本兼容性灾难**
    *很多新特性极度依赖高版本内核。如果你在老旧的 CentOS 7 (内核 3.10) 上强行跑高级特性，直接内核 Panic 或根本无法编译。*
*   **坑二：性能反噬**
    *如果你的过滤规则写得太复杂，或者在事件触发时把过多的数据从内核态拷贝到用户态，会导致 CPU 瞬间飙升。*
*   **坑三：盲目自信的“阻断”**
    *在没有经过充分灰度观察的情况下，直接开启“拦截”模式。这极容易把正常的业务进程（比如合法的定时运维脚本）给直接杀掉，造成生产事故。*

---

### 3. 大厂面试必问的 2 个硬核问题

**Q1：它是如何保证执行的程序不会搞挂整个操作系统的？**
> **简答**：通过内部的 **验证器 (Verifier)**。在程序被加载进内核之前，验证器会进行极其严格的静态代码分析，确保它不会死循环、不会访问越界内存、并且一定会终止。一旦发现危险，直接拒绝加载。

**Q2：它和传统的 iptables 在处理网络包时的性能差异根本原因是什么？**
> **简答**：传统 iptables 需要等数据包经过长长的网络栈（如 Netfilter 钩子）并多次拷贝后才能处理。而它可以利用 XDP（eXpress Data Path）技术，在网卡驱动刚收到数据包，**还没分配任何内存 (sk_buff) 之前**就直接进行丢弃或重定向，因此性能是降维打击。

---

### 4. 工具链黄金搭档
*   **Prometheus / Grafana**：负责将抓取到的底层系统指标和安全事件，转化为直观的监控大盘和告警趋势图。
*   **Elasticsearch / SIEM 系统**：由于它产生的数据量极其庞大，通常需要配合强大的日志收集和分析引擎，对长期的异常行为进行聚合和溯源分析。
`;

    let i = 0;
    const intervalId = setInterval(() => {
      setAiResponse(prev => (prev || '') + mockResponse.charAt(i));
      i++;
      if (i >= mockResponse.length) {
        clearInterval(intervalId);
        setIsGenerating(false);
      }
    }, 15); // 打字机速度
  };

  return (
    <div className="bg-dark-bg border border-dark-border rounded-xl p-5 mt-6 relative overflow-hidden group">
      {/* 装饰性背景光晕 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-accent/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-accent/10 rounded-lg border border-cyber-accent/20">
            <Bot className="w-5 h-5 text-cyber-accent" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">KForge AI 深度解析</h3>
            <p className="text-gray-400 text-sm">觉得文档不够透彻？让专属 AI 结合实战经验为你解答。</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
          title="查看底层 Prompt 设定"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-4 relative z-10 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 font-mono uppercase">System Prompt</span>
            <button 
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 text-xs text-cyber-accent hover:text-white transition-colors bg-cyber-accent/10 hover:bg-cyber-accent/20 px-2 py-1 rounded"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '已复制' : '复制提示词'}
            </button>
          </div>
          <div className="text-sm text-gray-300 font-mono leading-relaxed h-32 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
            {prompt}
          </div>
        </div>
      )}

      {/* AI 解析结果展示区 */}
      {aiResponse !== null && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-5 mb-4 relative z-10 prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {aiResponse}
          </ReactMarkdown>
          {isGenerating && (
            <span className="inline-block w-2 h-4 bg-cyber-accent ml-1 animate-pulse"></span>
          )}
        </div>
      )}

      {/* 触发按钮 */}
      <div className="relative z-10">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg ${
            isGenerating 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-cyber-accent/20 text-cyber-accent hover:bg-cyber-accent/30 border border-cyber-accent/50 shadow-cyber-accent/10'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              正在思考并生成深度解析...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {aiResponse ? '重新生成解析' : '让 AI 为我深度解析此技术'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AiExplanation;
