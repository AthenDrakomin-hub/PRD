import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { learningPath, techItems } from '../../data';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Convert learningPath to React Flow nodes and edges
learningPath.forEach((phase, index) => {
  const y = index * 250 + 50;
  
  // Phase Node
  initialNodes.push({
    id: phase.id,
    type: 'input',
    position: { x: 250, y },
    data: { 
      label: (
        <div className="font-bold text-cyber-accent p-2">
          {phase.name} <span className="text-xs text-gray-400 block mt-1">{phase.duration}</span>
        </div>
      ) 
    },
    style: {
      background: '#161B22',
      border: '1px solid #30363D',
      borderRadius: '8px',
      color: '#fff',
      width: 200,
      textAlign: 'center'
    }
  });

  // Tech Items Nodes
  phase.techIds.forEach((techId, techIndex) => {
    const tech = techItems.find(t => t.id === techId);
    if (!tech) return;

    initialNodes.push({
      id: `tech-${techId}`,
      position: { x: 550, y: y + (techIndex * 80) - ((phase.techIds.length - 1) * 40) },
      data: { label: tech.name },
      style: {
        background: '#0D1117',
        border: '1px solid #00E5FF',
        borderRadius: '6px',
        color: '#00E5FF',
        width: 180,
        padding: '10px'
      }
    });

    initialEdges.push({
      id: `e-${phase.id}-tech-${techId}`,
      source: phase.id,
      target: `tech-${techId}`,
      animated: true,
      style: { stroke: '#30363D', strokeWidth: 2 }
    });
  });

  // Phase Prerequisites Edges
  phase.prerequisites.forEach(preReq => {
    initialEdges.push({
      id: `e-${preReq}-${phase.id}`,
      source: preReq,
      target: phase.id,
      animated: true,
      style: { stroke: '#00E5FF', strokeWidth: 2 }
    });
  });
});

export const Roadmap: React.FC = () => {
  const onInit = useCallback((reactFlowInstance: any) => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <header className="bg-dark-card border border-dark-border p-6 rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">进阶学习路线图</h1>
          <p className="text-gray-400">按照推荐的学习阶段，逐步构建完整的防御知识体系。</p>
        </div>
      </header>

      <div className="bg-dark-card border border-dark-border rounded-xl h-[calc(100%-8rem)] relative overflow-hidden">
        <ReactFlow 
          nodes={initialNodes} 
          edges={initialEdges} 
          onInit={onInit}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#30363D" gap={16} />
          <Controls 
            style={{ 
              backgroundColor: '#161B22', 
              borderColor: '#30363D',
              fill: '#00E5FF'
            }} 
          />
        </ReactFlow>
      </div>
    </div>
  );
};
