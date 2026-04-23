import type { NodeProps, Node } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { Shield, Server, Activity } from 'lucide-react';

export type SkillNodeData = Node<{
  label: string;
  type: string;
  skillId: string;
  status?: 'idle' | 'running' | 'error';
  config?: Record<string, any>;
}, 'skill'>;

export const SkillNode = ({ data, selected }: NodeProps<SkillNodeData>) => {
  const getIcon = () => {
    switch (data.type) {
      case 'defense':
        return <Shield className="w-5 h-5 text-cyber-accent" />;
      case 'monitor':
        return <Activity className="w-5 h-5 text-purple-400" />;
      case 'target':
        return <Server className="w-5 h-5 text-green-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      case 'error': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className={`
      relative min-w-[200px] rounded-xl border bg-dark-bg/80 backdrop-blur-md
      transition-all duration-200 overflow-hidden
      ${selected ? 'border-cyber-accent shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'border-dark-border shadow-lg'}
    `}>
      {/* 顶部状态指示条 */}
      <div className={`h-1.5 w-full ${getStatusColor(data.status)}`} />
      
      {/* 连线句柄 - 左侧入 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border-2 border-dark-bg bg-gray-400 rounded-full !left-[-6px]"
      />
      
      <div className="p-3 flex items-center gap-3 bg-dark-bg/50 rounded-t-md border-b border-dark-border/50">
        {getIcon()}
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-200">{data.label}</div>
          <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
            {data.type}
            {data.status === 'running' && (
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 text-xs text-gray-500 bg-dark-card flex justify-between items-center">
        <span>配置状态</span>
        <span className="text-gray-400">{Object.keys(data.config || {}).length > 0 ? '已配置' : '默认'}</span>
      </div>

      {/* 连线句柄 - 右侧出 */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border-2 border-dark-bg bg-cyber-accent rounded-full !right-[-6px]"
      />
    </div>
  );
};
