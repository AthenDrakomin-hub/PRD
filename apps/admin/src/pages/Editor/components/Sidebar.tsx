import React from 'react';
import { Shield, Server, Activity, Plus } from 'lucide-react';

const NODE_TYPES = [
  { type: 'defense', label: 'DDoS与IP隐匿盾', id: 'ddos-ip-shield', icon: <Shield className="w-5 h-5 text-cyber-accent" /> },
  { type: 'defense', label: 'WAF应用防火墙', id: 'waf-shield', icon: <Shield className="w-5 h-5 text-blue-400" /> },
  { type: 'monitor', label: '流量异常监控', id: 'traffic-monitor', icon: <Activity className="w-5 h-5 text-purple-400" /> },
  { type: 'target', label: '宿主机内部服务', id: 'host-target', icon: <Server className="w-5 h-5 text-green-400" /> },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, skillId: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, skillId, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border h-full flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-bold text-white">技能组件库</h2>
        <p className="text-xs text-gray-500 mt-1">拖拽节点至右侧画布以编排</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {NODE_TYPES.map((node) => (
          <div
            key={node.id}
            className="flex items-center justify-between p-3 bg-dark-bg border border-dark-border rounded-lg cursor-grab hover:border-cyber-accent hover:shadow-[0_0_10px_rgba(0,229,255,0.1)] transition-all"
            draggable
            onDragStart={(e) => onDragStart(e, node.type, node.id, node.label)}
          >
            <div className="flex items-center gap-3">
              {node.icon}
              <div>
                <div className="text-sm font-bold text-gray-200">{node.label}</div>
                <div className="text-[10px] text-gray-500 uppercase">{node.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-dark-border">
        <button className="w-full flex items-center justify-center gap-2 bg-dark-bg text-gray-400 border border-dark-border hover:text-white px-3 py-2 rounded-lg text-sm transition-all">
          <Plus className="w-4 h-4" /> 导入自定义插件
        </button>
      </div>
    </aside>
  );
};
