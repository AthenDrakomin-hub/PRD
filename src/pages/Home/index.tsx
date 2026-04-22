import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Lock, Smartphone, ChevronRight, Zap } from 'lucide-react';
import { categories } from '../../data';

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
  Lock: <Lock className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />
};

export const Home: React.FC = () => {
  const [scenario, setScenario] = useState('ddos');

  const getSimulatorData = () => {
    switch (scenario) {
      case 'apt':
        return {
          title: 'APT 高级持续性威胁',
          recommend: '零信任架构 + EDR + 多级跳板',
          coverage: 92,
          desc: '针对国家级黑客组织发起的长期潜伏攻击，重点在于终端检测与横向移动防御。'
        };
      case 'ddos':
        return {
          title: '分布式拒绝服务攻击',
          recommend: '云端 WAF + 流量清洗 + Anycast 架构',
          coverage: 98,
          desc: '利用海量肉鸡发起的大流量攻击，防御核心在于带宽储备与流量过滤。'
        };
      case 'data_leak':
        return {
          title: '内部数据勒索/泄露',
          recommend: '数据加密 + DLP + 零信任访问控制',
          coverage: 85,
          desc: '防范内部员工越权访问及外部勒索软件，侧重于数据全生命周期保护。'
        };
      default:
        return { title: '', recommend: '', coverage: 0, desc: '' };
    }
  };

  const simData = getSimulatorData();

  return (
    <div className="space-y-12">
      <header className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          网络安全防御技术 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-blue-500">
            可视化知识库
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          专为人类与 AI Agent 打造的结构化安全语料。从原理到实践，构建全方位防御体系视角。
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="group relative bg-dark-card border border-dark-border p-6 rounded-xl hover:border-cyber-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 bg-dark-bg rounded-lg text-cyber-accent group-hover:animate-glow">
                {iconMap[cat.icon]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center text-cyber-accent text-sm font-medium">
                  进入学习 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-dark-card border border-dark-border rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="w-64 h-64 text-cyber-accent" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-cyber-accent" />
            攻防模拟器
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">选择攻击场景</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border text-white rounded-lg p-3 focus:ring-2 focus:ring-cyber-accent focus:border-transparent outline-none transition-all"
              >
                <option value="ddos">DDoS 大流量攻击</option>
                <option value="apt">APT 高级持续性威胁</option>
                <option value="data_leak">内部数据勒索/泄露</option>
              </select>
              <p className="text-sm text-gray-500 leading-relaxed">
                {simData.desc}
              </p>
            </div>

            <div className="md:col-span-2 space-y-6 bg-dark-bg p-6 rounded-lg border border-dark-border">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">推荐防御组合</h4>
                <div className="text-lg text-cyber-accent font-bold">
                  {simData.recommend}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">防御覆盖率预计</span>
                  <span className="text-cyber-accent font-bold">{simData.coverage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-cyber-accent h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${simData.coverage}%`, boxShadow: '0 0 10px #00E5FF' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
