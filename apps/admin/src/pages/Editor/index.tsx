import React, { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from './components/Sidebar';
import { ConfigPanel } from './components/ConfigPanel';
import { SkillNode } from './components/SkillNode';
import { KForgeMembershipDSL } from '@kforge/shared-schema';
import { Play, Download, Save } from 'lucide-react';

const nodeTypes = {
  skill: SkillNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export const CanvasEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // 全局商业化配置状态
  const [globalConfig, setGlobalConfig] = useState({
    platformMarketing: { title: '加入 KForge 全球防御网络', subtitle: '解锁无限制的安全节点访问权限，一键构建零信任架构。', themeColor: '#00E5FF' },
    membership: { tier: 'Enterprise', monthlyPriceUSDT: 299, walletAddress: '', maxActiveNodes: 10 }
  });

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00E5FF' } }, eds)),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData || !reactFlowInstance || !reactFlowBounds) return;

      const parsedData = JSON.parse(rawData);
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: getId(),
        type: 'skill',
        position,
        data: { 
          label: parsedData.label, 
          type: parsedData.type,
          skillId: parsedData.skillId,
          config: {} // 初始空配置
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const handleUpdateNode = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, data: newData };
          setSelectedNode(updatedNode); // 更新选中的状态
          return updatedNode;
        }
        return node;
      })
    );
  };

  // 生成符合 @kforge/shared-schema 标准的 JSON
  const handleExportDSL = () => {
    const dsl: KForgeMembershipDSL = {
      tenantId: `tenant-${Date.now()}`,
      version: '1.0.0',
      platformMarketing: globalConfig.platformMarketing as any,
      membership: globalConfig.membership as any,
      topology: {
        nodes: nodes.map(n => ({
          id: n.id,
          skillId: n.data.skillId as string,
          position: n.position,
          config: n.data.config as Record<string, any>
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target
        }))
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Generated Membership DSL:', dsl);
    
    // 模拟下载
    const blob = new Blob([JSON.stringify(dsl, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kforge-membership-config-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117]">
      {/* 顶部导航栏 (现已移到全局 App.tsx) */}
      <header className="h-12 border-b border-dark-border bg-dark-bg flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 tracking-wider">Visual Editor</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-bg">
            <Play className="w-4 h-4" /> 模拟沙箱试运行
          </button>
          <button 
            onClick={handleExportDSL}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-cyber-accent text-dark-bg hover:bg-[#00e5ff] transition-colors rounded-lg shadow-[0_0_10px_rgba(0,229,255,0.2)]"
          >
            <Save className="w-4 h-4" /> 更新租户防御拓扑
          </button>
        </div>
      </header>

      {/* 主工作区 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0B1021]"
          >
            <Background color="#1E293B" gap={24} />
            <Controls className="!bg-dark-card !border-dark-border !fill-white" />
          </ReactFlow>
        </div>

        <ConfigPanel 
          selectedNode={selectedNode} 
          onUpdateNode={handleUpdateNode}
          globalConfig={globalConfig}
          onUpdateGlobalConfig={setGlobalConfig}
        />
      </div>
    </div>
  );
};
