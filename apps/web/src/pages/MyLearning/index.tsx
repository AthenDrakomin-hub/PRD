import React, { useMemo, useState } from 'react';
import { RefreshCcw, CheckCircle, Clock, Circle, BookOpen, Save } from 'lucide-react';
import { categories, techItems } from '../../data';
import { useStore, TechStatus } from '../../store/useStore';

const statusMap: Record<TechStatus, { icon: React.ReactNode; label: string; color: string }> = {
  not_started: { icon: <Circle className="w-4 h-4" />, label: '未开始', color: 'text-gray-500' },
  in_progress: { icon: <Clock className="w-4 h-4" />, label: '进行中', color: 'text-yellow-400' },
  completed: { icon: <CheckCircle className="w-4 h-4" />, label: '已完成', color: 'text-green-400' }
};

export const MyLearning: React.FC = () => {
  const { userProgress, updateStatus, updateNote, resetProgress } = useStore();
  const [editingNote, setEditingNote] = useState<{ id: string; note: string } | null>(null);

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const total = techItems.length;
    const completed = Object.values(userProgress).filter((p) => p.status === 'completed').length;
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [userProgress]);

  const handleReset = () => {
    if (window.confirm('确定要重置所有学习进度和笔记吗？此操作不可恢复。')) {
      resetProgress();
    }
  };

  const handleSaveNote = (techId: string) => {
    if (editingNote && editingNote.id === techId) {
      updateNote(techId, editingNote.note);
      setEditingNote(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">我的学习进度</h1>
              <p className="text-gray-400">追踪你在各个安全防御领域的掌握情况并记录笔记。</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyber-accent">{progressPercent}%</div>
              <div className="text-sm text-gray-500">{completedCount} / {totalCount} 项完成</div>
            </div>
          </div>
          
          <div className="w-full bg-dark-bg rounded-full h-4 overflow-hidden border border-dark-border">
            <div
              className="bg-cyber-accent h-4 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progressPercent}%`, boxShadow: '0 0 10px #00E5FF' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors whitespace-nowrap"
        >
          <RefreshCcw className="w-4 h-4" />
          重置进度
        </button>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {categories.map((category) => {
          const catTechs = techItems.filter((t) => t.categoryId === category.id);
          
          return (
            <div key={category.id} className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-border pb-4">
                <span className="text-cyber-accent">#</span> {category.name}
              </h2>
              
              <div className="space-y-6">
                {catTechs.map((tech) => {
                  const status = userProgress[tech.id]?.status || 'not_started';
                  const note = userProgress[tech.id]?.note || '';
                  const isEditing = editingNote?.id === tech.id;
                  
                  return (
                    <div key={tech.id} className="bg-dark-bg border border-dark-border rounded-lg p-4 transition-colors hover:border-dark-border/80">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h3 className="font-bold text-gray-200">{tech.name}</h3>
                        
                        <div className="flex bg-dark-card rounded-md border border-dark-border overflow-hidden">
                          {(['not_started', 'in_progress', 'completed'] as TechStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(tech.id, s)}
                              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors
                                ${status === s ? `bg-dark-bg ${statusMap[s].color} shadow-inner` : 'text-gray-500 hover:text-gray-300 hover:bg-dark-bg/50'}`}
                            >
                              {statusMap[s].icon}
                              {statusMap[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-2 border-t border-dark-border pt-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <textarea
                              value={editingNote.note}
                              onChange={(e) => setEditingNote({ id: tech.id, note: e.target.value })}
                              className="w-full bg-dark-card border border-cyber-accent/50 text-gray-300 rounded-md p-3 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-cyber-accent resize-y"
                              placeholder="记录你的学习心得、实验体会或备忘录..."
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNote(null)}
                                className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleSaveNote(tech.id)}
                                className="flex items-center gap-1 px-3 py-1 text-xs bg-cyber-accent text-dark-bg font-bold rounded hover:bg-cyber-hover transition-colors"
                              >
                                <Save className="w-3 h-3" />
                                保存
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setEditingNote({ id: tech.id, note })}
                            className={`cursor-text p-3 rounded-md border text-sm transition-colors group
                              ${note ? 'bg-dark-card border-dark-border text-gray-300' : 'bg-transparent border-dashed border-dark-border text-gray-600 hover:border-gray-500'}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                                <BookOpen className="w-3 h-3" />
                                学习笔记
                              </span>
                              <span className="text-xs text-cyber-accent opacity-0 group-hover:opacity-100 transition-opacity">点击编辑</span>
                            </div>
                            <div className="whitespace-pre-wrap">{note || '暂无笔记，点击添加...'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
