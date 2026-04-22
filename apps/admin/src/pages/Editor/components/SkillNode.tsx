import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Activity, ArrowRight } from 'lucide-react';

export type SkillNodeData = {
  label: string;
  type: 'defense' | 'monitor' | 'target';
  status?: 'idle' | 'running' | 'error';
  config?: Record<string, any>;
};

export const SkillNode = ({ data, selected }: NodeProps<SkillNodeData>) => {
  const getIcon = () => {
    switch (data.type) {
      case 'defense': return <Shield className="w-4 h-4 text-cyber-accent" />;
      case 'monitor': return <Activity className="w-4 h-4 text-purple-400" />;
      case 'target': return <Server className="w-4 h-4 text-green-400" />;
      default: return <ArrowRight className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBorderColor = () => {
    if (selected) return 'border-cyber-accent shadow-[0_0_15px_rgba(0,229,255,0.3)]';
    if (data.status === 'running') return 'border-green-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    return 'border-dark-border';
  };

  return (
    <div className={`bg-dark-card rounded-lg border-2 ${getBorderColor()} min-w-[180px] transition-all duration-200`}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-gray-400 !border-dark-bg" />
      
      <div className="p-3 flex items-center gap-3 bg-dark-bg/50 rounded-t-md border-b border-dark-border/50">
        <div className="p-1.5 bg-dark-bg rounded-md border border-dark-border">
          {getIcon()}
        </div>
        <div className="font-bold text-sm text-gray-200 truncate">{data.label}</div>
      </div>
      
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-1">
          {data.type === 'defense' ? '防御节点' : data.type === 'target' ? '后端目标' : '监控节点'}
        </div>
        {data.config && Object.keys(data.config).length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {Object.keys(data.config).map(k => (
              <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-gray-400">
                {k}: {data.config![k]}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-cyber-accent !border-dark-bg" />
    </div>
  );
};
