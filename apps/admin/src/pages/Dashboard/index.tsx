import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Target, Globe, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 模拟实时的攻击日志
const MOCK_ATTACKS = [
  { id: 1, type: 'SQL Injection', source: '104.28.11.23', country: 'RU', target: 'kforge-ddos-shield', status: 'Blocked' },
  { id: 2, type: 'DDoS / CC Flood', source: 'Botnet-Mirai', country: 'BR', target: 'kforge-ddos-shield', status: 'Rate Limited' },
  { id: 3, type: 'Path Traversal', source: '45.33.99.12', country: 'US', target: 'kforge-waf', status: 'Blocked' },
  { id: 4, type: 'XSS Attempt', source: '192.168.1.100', country: 'CN', target: 'kforge-waf', status: 'Cleaned' },
];

export const LiveDashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<typeof MOCK_ATTACKS>([]);
  const [stats, setStats] = useState({ total: 12450, blocked: 12448, active: 3 });

  // 模拟 WebSocket 实时推送攻击日志
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAttack = MOCK_ATTACKS[Math.floor(Math.random() * MOCK_ATTACKS.length)];
      const newLog = { ...randomAttack, id: Date.now(), time: new Date().toLocaleTimeString() };
      
      setLogs(prev => [newLog, ...prev].slice(0, 10)); // 只保留最近 10 条
      setStats(prev => ({ 
        ...prev, 
        total: prev.total + 1,
        blocked: prev.blocked + (randomAttack.status === 'Blocked' || randomAttack.status === 'Rate Limited' ? 1 : 0)
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#050B14] overflow-hidden text-gray-200">
      {/* 顶部导航栏 */}
      <header className="h-16 border-b border-dark-border/50 bg-[#0A0F1C]/80 backdrop-blur flex items-center justify-between px-6 z-10 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-dark-bg rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img src="/logo.svg" alt="KForge Logo" className="h-6" />
          <div className="h-4 w-px bg-dark-border mx-2"></div>
          <span className="text-sm font-bold text-cyber-accent tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE ATTACK MAP
          </span>
        </div>
      </header>

      {/* 大屏内容区 */}
      <div className="flex-1 relative p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 背景地图修饰 (纯 CSS 模拟) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
          <Globe className="w-[800px] h-[800px] text-cyber-accent/20" strokeWidth={0.5} />
        </div>

        {/* 左侧：统计面板 */}
        <div className="col-span-1 flex flex-col gap-6 z-10 relative">
          <div className="bg-[#0D1322]/80 backdrop-blur border border-dark-border/50 rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-accent" /> 全网防御态势
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">总计分析请求</div>
                <div className="text-4xl font-mono font-bold text-white">{stats.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">成功拦截威胁</div>
                <div className="text-4xl font-mono font-bold text-red-400">{stats.blocked.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">活跃防护节点</div>
                <div className="text-4xl font-mono font-bold text-cyber-accent">{stats.active}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 中间与右侧：实时拦截日志 */}
        <div className="col-span-1 lg:col-span-3 flex flex-col z-10 relative">
          <div className="bg-[#0D1322]/80 backdrop-blur border border-dark-border/50 rounded-xl p-5 flex-1 flex flex-col shadow-[0_0_30px_rgba(239,68,68,0.05)]">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" /> 实时拦截日志流
            </h3>
            
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D1322] z-10 pointer-events-none"></div>
              
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                {logs.map((log, index) => (
                  <div 
                    key={log.id} 
                    className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 p-3 rounded-lg border border-red-500/10 bg-red-500/5 animate-in slide-in-from-top-2 fade-in duration-300"
                    style={{ opacity: 1 - index * 0.1 }}
                  >
                    <span className="text-gray-500 min-w-[80px]">{(log as any).time}</span>
                    <span className="text-red-400 font-bold min-w-[140px] flex items-center gap-1">
                      <Target className="w-3 h-3" /> {log.type}
                    </span>
                    <span className="text-gray-300 flex-1 truncate">
                      Source: <span className="text-yellow-400">{log.source}</span> [{log.country}]
                    </span>
                    <span className="text-cyber-accent min-w-[120px] truncate">➔ {log.target}</span>
                    <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase text-[10px] font-bold">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
