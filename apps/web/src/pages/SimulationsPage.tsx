import React, { useState } from 'react';
import { simulations } from '../data/simulations.generated';

const SimulationsPage = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(cmd);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">⚔️ 实战靶场</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {simulations.map(sim => (
          <div key={sim.id} className="bg-dark-card border border-dark-border rounded-xl p-5 shadow-lg transition-transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-2 text-white">{sim.title}</h2>
            <div className="flex gap-2 mb-4">
              <span className={`text-xs px-2 py-1 rounded text-white font-medium ${
                sim.difficulty === '中级' ? 'bg-yellow-600' : 
                sim.difficulty === '高级' ? 'bg-red-600' : 'bg-green-600'
              }`}>
                {sim.difficulty}
              </span>
              <span className="text-xs bg-dark-bg text-gray-300 border border-dark-border px-2 py-1 rounded">{sim.estimatedTime}</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">{sim.description}</p>
            <div className="space-y-3">
              <CommandBlock label="启动环境" cmd={sim.commands.start} copied={copied} onCopy={copyCommand} />
              <CommandBlock label="执行攻击" cmd={sim.commands.attack} copied={copied} onCopy={copyCommand} />
              <CommandBlock label="执行检测" cmd={sim.commands.detect} copied={copied} onCopy={copyCommand} />
              <CommandBlock label="停止环境" cmd={sim.commands.stop} copied={copied} onCopy={copyCommand} />
            </div>
          </div>
        ))}
        {simulations.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            暂无可用靶场，请在 simulations 目录下添加。
          </div>
        )}
      </div>
    </div>
  );
};

const CommandBlock = ({ label, cmd, copied, onCopy }: { label: string, cmd: string, copied: string | null, onCopy: (c: string) => void }) => (
  <div className="bg-dark-bg border border-dark-border p-3 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 overflow-hidden">
      <span className="text-gray-500 whitespace-nowrap">{label}:</span>
      <code className="text-cyber-accent bg-black/30 px-2 py-1 rounded font-mono truncate">{cmd}</code>
    </div>
    <button
      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
        copied === cmd 
          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
          : 'bg-dark-card border border-dark-border text-gray-300 hover:text-cyber-accent hover:border-cyber-accent/50'
      }`}
      onClick={() => onCopy(cmd)}
    >
      {copied === cmd ? '✓ 已复制' : '复制命令'}
    </button>
  </div>
);

export default SimulationsPage;
