import React, { useState } from 'react';
import { Bot, Copy, ExternalLink, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { TechItem } from '../data/techItems';

interface AiExplanationProps {
  tech: TechItem;
}

const AiExplanation: React.FC<AiExplanationProps> = ({ tech }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
            <h3 className="text-white font-bold text-lg">AI 深度解析助手</h3>
            <p className="text-gray-400 text-sm">觉得文档不够透彻？让 AI 结合实战经验为你解答。</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-4 relative z-10 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 font-mono uppercase">Generated Prompt</span>
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

      <div className="flex flex-col sm:flex-row gap-3 relative z-10">
        <a 
          href="https://claude.ai/new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#D97757] hover:bg-[#C26547] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-[#D97757]/20"
        >
          <ExternalLink className="w-4 h-4" />
          去 Claude 解析
        </a>
        <a 
          href="https://chatgpt.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#10A37F] hover:bg-[#0E906F] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-[#10A37F]/20"
        >
          <ExternalLink className="w-4 h-4" />
          去 ChatGPT 解析
        </a>
      </div>
    </div>
  );
};

export default AiExplanation;
