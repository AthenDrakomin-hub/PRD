import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileJson, FileText, Menu, X } from 'lucide-react';
import { categories, techItems, learningPath } from '../../data';
import { useStore } from '../../store/useStore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const userProgress = useStore((state) => state.userProgress);
  const brandName = 'KForge | 墟';
  const tagline = '在废墟中锻造知识，在暗处淬炼锋芒。';
  const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;

  const handleExportJSON = () => {
    const data = {
      meta: {
        brand: brandName,
        tagline,
        exportedAt: new Date().toISOString()
      },
      categories,
      techItems,
      learningPath,
      userProgress
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'kforge-knowledge-base.json');
    setShowExport(false);
  };

  const handleExportMarkdown = async () => {
    const zip = new JSZip();

    zip.file(
      'README.md',
      `# ${brandName}\n\n${tagline}\n\n本压缩包由 KForge 导出生成。每个技术点为独立 Markdown 文件，包含可被 AI Agent 直接摄取的结构化章节。\n`
    );
    
    categories.forEach(cat => {
      const catFolder = zip.folder(cat.name);
      if (!catFolder) return;
      
      const items = techItems.filter(item => item.categoryId === cat.id);
      items.forEach(item => {
        const mdContent = `---
project: ${brandName}
id: ${item.id}
name: ${item.name}
category: ${cat.name}
difficulty: ${item.difficulty}
tags: [${item.tags.join(', ')}]
---

# ${item.name}

## 核心作用
${item.coreFunction}

## 主要防御手段
${item.defenseMechanism}

## 漏洞与局限
${item.vulnerabilities}

${item.principle}

## 典型工具
${item.tools.map(t => '- ' + t).join('\n')}

## 实践步骤
${item.practiceSteps.map((s, i) => `${i + 1}. ${s}`).join('\\n')}

## 学习资源
${item.resources.map(r => '- [' + r.title + '](' + r.url + ')').join('\n')}
`;
        catFolder.file(`${item.id}.md`, mdContent);
      });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'kforge-knowledge-base-md.zip');
    setShowExport(false);
  };

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '科技树', path: '/tech-tree' },
    { name: '学习路径', path: '/roadmap' },
    { name: '实战靶场', path: '/simulations' },
    { name: '我的学习', path: '/my-learning' }
  ];

  return (
    <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoUrl} alt={brandName} className="w-9 h-9" />
              <span className="hidden sm:block leading-none">
                <span className="block font-extrabold text-lg text-white tracking-wide">KForge</span>
                <span className="block text-cyber-accent text-sm ml-6 -mt-0.5 font-medium">墟</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-cyber-accent hover:bg-dark-bg px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center gap-2 bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/50 hover:bg-cyber-accent/20 px-4 py-2 rounded-md text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              导出知识库
            </button>
            
            {showExport && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card rounded-md shadow-lg border border-dark-border py-1 z-50">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-bg hover:text-cyber-accent"
                >
                  <FileJson className="w-4 h-4" />
                  导出为 JSON
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-bg hover:text-cyber-accent"
                >
                  <FileText className="w-4 h-4" />
                  导出为 Markdown
                </button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-bg focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-cyber-accent hover:bg-dark-bg block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-dark-border">
              <p className="px-3 text-xs text-gray-500 uppercase tracking-wider mb-2">导出选项</p>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-cyber-accent hover:bg-dark-bg rounded-md"
              >
                <FileJson className="w-5 h-5" />
                导出 JSON
              </button>
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-cyber-accent hover:bg-dark-bg rounded-md"
              >
                <FileText className="w-5 h-5" />
                导出 Markdown
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
