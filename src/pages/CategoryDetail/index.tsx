import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, X, ExternalLink, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { categories, techItems, TechItem } from '../../data';

export const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categoryId]
  );

  const filteredItems = useMemo(() => {
    if (!category) return [];
    return techItems
      .filter((t) => t.categoryId === category.id)
      .filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const difficultyMap = { low: 1, medium: 2, high: 3 };
        return difficultyMap[a.difficulty] - difficultyMap[b.difficulty];
      });
  }, [category, searchTerm]);

  if (!category) {
    return (
      <div className="text-center py-20 text-gray-400">
        <h2 className="text-2xl mb-4 text-white">分类不存在</h2>
        <Link to="/" className="text-cyber-accent hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
          </div>
          <p className="text-gray-400">{category.description}</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索技术、工具或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-cyber-accent focus:border-transparent outline-none transition-all"
          />
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-bg border-b border-dark-border text-gray-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium w-1/4">技术方案</th>
                    <th className="p-4 font-medium w-1/4">核心作用</th>
                    <th className="p-4 font-medium w-1/4">主要防御手段</th>
                    <th className="p-4 font-medium w-1/4">漏洞与局限</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-dark-bg/50 transition-colors group"
                    >
                      <td className="p-4 align-top">
                        <button
                          onClick={() => setSelectedTech(item)}
                          className="font-bold text-cyber-accent hover:underline text-left"
                        >
                          {item.name}
                        </button>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-dark-bg border border-dark-border rounded text-xs text-gray-400 group-hover:border-cyber-accent/30 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top text-sm text-gray-300">{item.coreFunction}</td>
                      <td className="p-4 align-top text-sm text-gray-300">{item.defenseMechanism}</td>
                      <td className="p-4 align-top text-sm text-gray-400">{item.vulnerabilities}</td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        未找到匹配的技术点
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyber-accent" />
              通用实践建议
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-cyber-accent">▸</span>
                始终遵循最小权限原则
              </li>
              <li className="flex gap-2">
                <span className="text-cyber-accent">▸</span>
                结合多层防御（纵深防御）
              </li>
              <li className="flex gap-2">
                <span className="text-cyber-accent">▸</span>
                定期审查与更新策略
              </li>
              <li className="flex gap-2">
                <span className="text-cyber-accent">▸</span>
                建立应急响应剧本 (Playbook)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTech && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTech(null)}
          />
          <div className="relative bg-dark-card border border-dark-border w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedTech.name}</h2>
                <div className="flex gap-3 mt-2 text-sm text-gray-400">
                  <span>难度: <span className={`font-medium ${selectedTech.difficulty === 'high' ? 'text-red-400' : selectedTech.difficulty === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{selectedTech.difficulty.toUpperCase()}</span></span>
                  <span>|</span>
                  <span>分类: {category.name}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTech(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-bg rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 markdown-body">
              <ReactMarkdown>{selectedTech.principle}</ReactMarkdown>
              
              <div className="mt-8 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-border pb-2">典型工具</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.tools.map(tool => (
                      <span key={tool} className="px-3 py-1 bg-dark-bg border border-dark-border rounded text-sm text-cyber-accent">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-border pb-2">学习资源</h3>
                  <ul className="space-y-2">
                    {selectedTech.resources.map((res, i) => (
                      <li key={i}>
                        <a 
                          href={res.url} 
                          target="_blank" 
                          rel="norenoopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-300 hover:text-cyber-accent transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {res.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-border pb-2">实践步骤</h3>
                <div className="bg-dark-bg rounded-lg p-6 border border-dark-border">
                  <ol className="list-decimal pl-4 space-y-4">
                    {selectedTech.practiceSteps.map((step, i) => (
                      <li key={i} className="text-gray-300 pl-2">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
