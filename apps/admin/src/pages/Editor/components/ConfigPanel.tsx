import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Settings, Wallet, DollarSign, Send } from 'lucide-react';

interface ConfigPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (id: string, newData: any) => void;
  globalConfig: {
    marketing: any;
    payment: any;
  };
  onUpdateGlobalConfig: (newConfig: any) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  selectedNode, 
  onUpdateNode,
  globalConfig,
  onUpdateGlobalConfig 
}) => {
  const [activeTab, setActiveTab] = useState<'node' | 'global'>('node');

  const handleNodeConfigChange = (key: string, value: string) => {
    if (!selectedNode) return;
    const newConfig = { ...selectedNode.data.config, [key]: value };
    onUpdateNode(selectedNode.id, { ...selectedNode.data, config: newConfig });
  };

  const handlePaymentChange = (key: string, value: any) => {
    onUpdateGlobalConfig({
      ...globalConfig,
      payment: { ...globalConfig.payment, [key]: value }
    });
  };

  const handleMarketingChange = (key: string, value: any) => {
    onUpdateGlobalConfig({
      ...globalConfig,
      marketing: { ...globalConfig.marketing, [key]: value }
    });
  };

  return (
    <aside className="w-80 bg-dark-card border-l border-dark-border h-full flex flex-col overflow-hidden">
      <div className="flex border-b border-dark-border">
        <button 
          onClick={() => setActiveTab('node')}
          className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all ${activeTab === 'node' ? 'border-cyber-accent text-cyber-accent bg-dark-bg/50' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          节点属性
        </button>
        <button 
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all ${activeTab === 'global' ? 'border-purple-500 text-purple-400 bg-dark-bg/50' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          发布与收款
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activeTab === 'node' && (
          <div className="space-y-6">
            {!selectedNode ? (
              <div className="text-center text-gray-500 mt-10">
                <Settings className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">请在画布中选中一个节点进行配置</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-dark-border">
                  <div className="w-2 h-2 rounded-full bg-cyber-accent"></div>
                  <h3 className="text-white font-bold truncate">{selectedNode.data.label as string}</h3>
                </div>

                {/* 代理类节点通用配置 (DDoS盾 / WAF) */}
                {(selectedNode.data.skillId === 'ddos-ip-shield' || selectedNode.data.skillId === 'waf-shield') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">外部监听端口 (PUBLIC_PORT)</label>
                      <input 
                        type="text" 
                        value={selectedNode.data.config?.PUBLIC_PORT || '8080'}
                        onChange={(e) => handleNodeConfigChange('PUBLIC_PORT', e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">后端目标服务 (TARGET_HOST)</label>
                      <input 
                        type="text" 
                        value={selectedNode.data.config?.TARGET_HOST || 'host.docker.internal'}
                        onChange={(e) => handleNodeConfigChange('TARGET_HOST', e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">后端目标端口 (TARGET_PORT)</label>
                      <input 
                        type="text" 
                        value={selectedNode.data.config?.TARGET_PORT || '3000'}
                        onChange={(e) => handleNodeConfigChange('TARGET_PORT', e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-accent"
                      />
                    </div>
                  </div>
                )}

                {/* 独立服务类节点通用配置 (SPA网关 / 蜜罐) */}
                {(selectedNode.data.skillId === 'port-knocking-spa' || selectedNode.data.skillId === 'deception-honeypot') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">暴露端口 (PUBLIC_PORT)</label>
                      <input 
                        type="text" 
                        value={selectedNode.data.config?.PUBLIC_PORT || '2222'}
                        onChange={(e) => handleNodeConfigChange('PUBLIC_PORT', e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-accent"
                      />
                    </div>
                  </div>
                )}

                {/* 无需额外配置的节点 */}
                {selectedNode.data.skillId !== 'ddos-ip-shield' && 
                 selectedNode.data.skillId !== 'waf-shield' && 
                 selectedNode.data.skillId !== 'port-knocking-spa' && 
                 selectedNode.data.skillId !== 'deception-honeypot' && (
                  <div className="text-sm text-gray-500 italic">该节点暂无自定义配置项</div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'global' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* H5 营销配置 */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-white font-bold border-b border-dark-border pb-2">
                <Send className="w-4 h-4 text-blue-400" /> H5 营销页设置
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">落地页大标题</label>
                <input 
                  type="text" 
                  value={globalConfig.marketing.title || ''}
                  onChange={(e) => handleMarketingChange('title', e.target.value)}
                  placeholder="例如：一键部署企业级高防节点"
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">核心卖点描述</label>
                <textarea 
                  value={globalConfig.marketing.description || ''}
                  onChange={(e) => handleMarketingChange('description', e.target.value)}
                  placeholder="用一句话打动客户..."
                  className="w-full h-24 bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>

            {/* 收款配置 */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-white font-bold border-b border-dark-border pb-2">
                <Wallet className="w-4 h-4 text-green-400" /> USDT-TRC20 收款配置
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">定价 (USDT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2 w-4 h-4 text-gray-500" />
                  <input 
                    type="number" 
                    value={globalConfig.payment.priceAmount || ''}
                    onChange={(e) => handlePaymentChange('priceAmount', Number(e.target.value))}
                    placeholder="99.9"
                    className="w-full bg-dark-bg border border-dark-border rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">收款钱包地址 (TRC20)</label>
                <input 
                  type="text" 
                  value={globalConfig.payment.walletAddress || ''}
                  onChange={(e) => handlePaymentChange('walletAddress', e.target.value)}
                  placeholder="T..."
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm font-mono text-green-400 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">商业模式</label>
                <select 
                  value={globalConfig.payment.model || 'one-time'}
                  onChange={(e) => handlePaymentChange('model', e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-400"
                >
                  <option value="one-time">一次性买断 (One-Time)</option>
                  <option value="subscription">包月订阅 (Subscription)</option>
                  <option value="pay-per-use">按次计费 (Pay-Per-Use)</option>
                </select>
              </div>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
};
