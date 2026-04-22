import React, { useMemo, useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { categories, techItems } from '../../data';
import { useStore, TechStatus } from '../../store/useStore';
import { echartsTheme, getTechNodeStyle, baseEchartsOption } from '../../config/echartsTheme';
import { TechNode } from '../../types'; // 引入定义的节点类型
import { X, ExternalLink, Activity, BookOpen, ChevronRight, Download, Upload, Shield, Sword, Flag } from 'lucide-react';
import MarkdownViewer from '../../components/MarkdownViewer';
import AiExplanation from '../../components/AiExplanation';

export const TechTree: React.FC = () => {
  const { userProgress, updateStatus, updateNote, resetProgress } = useStore();
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<'all' | 'red' | 'blue' | 'ctf'>('all');
  const echartsRef = useRef<ReactECharts>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 增加：窗口大小改变时自动触发 ECharts 重绘
  useEffect(() => {
    const handleResize = () => {
      if (echartsRef.current) {
        echartsRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 路径过滤逻辑
  const filteredTechItems = useMemo(() => {
    if (currentPath === 'all') return techItems;
    // 假设 tags 包含对应关键词，或 category 包含特定逻辑，这里用 tags 做简单区分
    return techItems.filter(tech => {
      const tagsStr = tech.tags.join(' ').toLowerCase();
      if (currentPath === 'red') return tagsStr.includes('红队') || tagsStr.includes('渗透') || tagsStr.includes('攻击') || tagsStr.includes('隐匿');
      if (currentPath === 'blue') return tagsStr.includes('蓝队') || tagsStr.includes('防御') || tagsStr.includes('检测') || tagsStr.includes('防护');
      if (currentPath === 'ctf') return tagsStr.includes('ctf') || tagsStr.includes('漏洞') || tagsStr.includes('逆向');
      return true;
    });
  }, [currentPath]);

  const selectedTech = useMemo(() => {
    return techItems.find(t => t.id === selectedTechId) || null;
  }, [selectedTechId]);

  const selectedCategory = useMemo(() => {
    if (!selectedTech) return null;
    return categories.find(c => c.id === selectedTech.categoryId) || null;
  }, [selectedTech]);

  const handleNodeClick = (params: any) => {
    if (params.data && params.data.id) {
      setSelectedTechId(params.data.id);
    }
  };

  const onEvents = {
    click: handleNodeClick,
  };

  // 2. 增加：使用强类型 TechNode，并下发预留的 icon 字段
  const treeData: TechNode = useMemo(() => {
    return {
      name: 'KForge | 墟\n知识锻造体系',
      itemStyle: { color: echartsTheme.colors.root },
      symbolSize: echartsTheme.sizes.root,
      children: categories.map((cat) => ({
        name: cat.name.replace(/(.{6})/g, '$1\n'), // 自动换行
        itemStyle: { color: echartsTheme.colors.category },
        symbolSize: echartsTheme.sizes.category,
        icon: cat.icon, // 传递大类图标
        children: techItems
          .filter((tech) => tech.categoryId === cat.id)
          .filter((tech) => filteredTechItems.some(f => f.id === tech.id)) // 加上路径过滤
          .map((tech) => {
            const status = userProgress[tech.id]?.status || 'not_started';
            return {
              id: tech.id,
              name: tech.name,
              itemStyle: getTechNodeStyle(status),
              symbolSize: echartsTheme.sizes.tech,
              value: tech.description,
              categoryId: tech.categoryId,
              icon: tech.icon, // 传递技术点图标
            };
          }),
      })),
    };
  }, [userProgress, filteredTechItems]); // 补充 filteredTechItems 依赖

  const option = {
    tooltip: baseEchartsOption.tooltip,
    series: [
      {
        type: 'tree',
        data: [treeData],
        top: '5%',
        left: '10%',
        bottom: '5%',
        right: '20%',
        symbolSize: 10,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 14,
          color: echartsTheme.colors.text.primary,
          // 动态判断是否带有 icon 并套用富文本模板
          formatter: function (params: any) {
            if (params.data.icon) {
              return `{icon|${params.data.icon}} {name|${params.name}}`;
            }
            return `{name|${params.name}}`;
          },
          rich: {
            icon: {
              fontSize: 14,
              // 如果将来 icon 传的是 URL，可以在此启用图片渲染：
              // height: 16, width: 16, align: 'center', backgroundColor: { image: '...' }
            },
            name: {
              fontSize: 14,
              color: echartsTheme.colors.text.primary,
            }
          }
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            color: echartsTheme.colors.text.highlight,
            formatter: function (params: any) {
              if (params.data.icon) {
                return `{icon|${params.data.icon}} {name|${params.name}}`;
              }
              return `{name|${params.name}}`;
            },
            rich: {
              icon: { fontSize: 14 },
              name: {
                fontSize: 14,
                color: echartsTheme.colors.text.highlight,
              }
            }
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        roam: true, // 允许缩放和拖拽
        lineStyle: baseEchartsOption.lineStyle
      }
    ]
  };

  const handleExportImage = () => {
    if (echartsRef.current) {
      const echartsInstance = echartsRef.current.getEchartsInstance();
      const dataUrl = echartsInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#0D1117'
      });
      const link = document.createElement('a');
      link.download = `kforge-tech-tree-${currentPath}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.userProgress) {
          // 这里可以合并进度，简单起见直接重置并逐个应用
          resetProgress();
          Object.keys(json.userProgress).forEach(techId => {
            const data = json.userProgress[techId];
            if (data.status) updateStatus(techId, data.status);
            if (data.note) updateNote(techId, data.note);
          });
          alert('✅ 知识树进度导入成功！');
        } else {
          alert('❌ 无效的 JSON 文件，缺少 userProgress 数据');
        }
      } catch (err) {
        alert('❌ JSON 解析失败');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <header className="bg-dark-card border border-dark-border p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">知识锻造科技树</h1>
          <p className="text-gray-400 text-sm">选择不同的职业路径，导出你的专属技能图谱。</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* 路径切换按钮 */}
          <div className="flex bg-dark-bg rounded-lg p-1 border border-dark-border">
            <button 
              onClick={() => setCurrentPath('all')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${currentPath === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              全量
            </button>
            <button 
              onClick={() => setCurrentPath('red')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${currentPath === 'red' ? 'bg-red-900/50 text-red-400' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Sword className="w-4 h-4" /> 红队
            </button>
            <button 
              onClick={() => setCurrentPath('blue')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${currentPath === 'blue' ? 'bg-blue-900/50 text-blue-400' : 'text-gray-400 hover:text-blue-400'}`}
            >
              <Shield className="w-4 h-4" /> 蓝队
            </button>
            <button 
              onClick={() => setCurrentPath('ctf')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${currentPath === 'ctf' ? 'bg-purple-900/50 text-purple-400' : 'text-gray-400 hover:text-purple-400'}`}
            >
              <Flag className="w-4 h-4" /> CTF
            </button>
          </div>

          <div className="h-6 w-px bg-dark-border hidden md:block"></div>

          {/* 导入导出功能 */}
          <button
            onClick={handleExportImage}
            className="flex items-center gap-2 bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/50 hover:bg-cyber-accent/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            存为图片
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-dark-bg text-gray-300 border border-dark-border hover:border-gray-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          >
            <Upload className="w-4 h-4" />
            导入进度
          </button>
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImportJson} 
          />
        </div>
      </header>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex-1 relative overflow-hidden">
        <ReactECharts
          ref={echartsRef}
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          onEvents={onEvents}
        />

        {/* 侧边 Drawer 面板 */}
        {selectedTech && selectedCategory && (
          <div className="absolute top-0 right-0 h-full w-full md:w-[500px] bg-dark-card border-l border-dark-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-6 border-b border-dark-border bg-dark-bg/50">
              <div>
                {/* 面包屑导航 */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>KForge</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedCategory.name}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-cyber-accent truncate max-w-[150px]" title={selectedTech.name}>{selectedTech.name}</span>
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight">{selectedTech.name}</h2>
              </div>
              <button
                onClick={() => setSelectedTechId(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-bg rounded-lg transition-colors ml-4 shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 markdown-body">
              
              {/* 状态操作区 */}
              <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-5 h-5 text-cyber-accent" />
                  <h3 className="font-semibold text-white">学习进度与笔记</h3>
                </div>
                <div className="flex gap-2 mb-4">
                  {(['not_started', 'in_progress', 'completed'] as TechStatus[]).map((status) => {
                    const isActive = (userProgress[selectedTech.id]?.status || 'not_started') === status;
                    const statusConfig = {
                      not_started: { label: '未开始', activeClass: 'border-gray-600 text-gray-400 bg-dark-bg' },
                      in_progress: { label: '学习中', activeClass: 'border-cyber-accent text-cyber-accent shadow-[0_0_10px_rgba(0,229,255,0.1)]' },
                      completed: { label: '已掌握', activeClass: 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' }
                    };
                    return (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedTech.id, status)}
                        className={`px-3 py-1.5 text-sm rounded border transition-all ${
                          isActive 
                            ? `bg-dark-card ${statusConfig[status].activeClass}` 
                            : 'border-dark-border text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {statusConfig[status].label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={userProgress[selectedTech.id]?.note || ''}
                  onChange={(e) => updateNote(selectedTech.id, e.target.value)}
                  placeholder="在这里记录你的实战心得、坑点或总结..."
                  className="w-full h-24 bg-dark-card border border-dark-border rounded-lg p-3 text-sm text-gray-300 focus:ring-1 focus:ring-cyber-accent focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* AI 解释入口 */}
              <div className="pt-2">
                <AiExplanation tech={selectedTech} />
              </div>

              {/* Markdown 内容区 */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4 text-white font-bold text-lg border-b border-dark-border pb-2">
                  <BookOpen className="w-5 h-5 text-cyber-accent" />
                  技术文档
                </div>
                {selectedTech.path ? (
                  <MarkdownViewer filePath={selectedTech.path} />
                ) : (
                  <div className="text-gray-400 text-sm italic bg-dark-bg p-4 rounded-lg border border-dark-border border-dashed">
                    此技术点暂无独立的 Markdown 笔记，请在项目中添加。
                    <br/><br/>
                    <strong>核心描述：</strong><br/>
                    {selectedTech.description}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
