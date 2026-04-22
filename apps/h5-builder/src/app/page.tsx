"use client";

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Zap, Lock, CheckCircle2, ChevronRight, Copy, Check, DollarSign } from 'lucide-react';
import Image from 'next/image';

// 模拟从 Daemon 接口拉取到的平台级会员 DSL 数据
const mockDSL = {
  tenantId: "tenant-1711234567",
  version: "1.0.0",
  platformMarketing: {
    title: "KForge 全球安全防御网络",
    subtitle: "解锁无限制的安全节点访问权限，一键构建零信任架构。单个订阅，涵盖 DDoS、WAF、SPA 隐身及高交互蜜罐全量武器库。",
    themeColor: "#00E5FF",
  },
  membership: {
    tier: "Enterprise",
    monthlyPriceUSDT: 299,
    walletAddress: "TYuLhE2Ym4Q7Z9u5B1p5A1u7G8z5Y1w8G5",
    maxActiveNodes: 10
  }
};

const FEATURES = [
  "10Gbps+ 抗D盾与 HTTP CC 智能限流",
  "OWASP 核心规则集 (CRS) WAF 拦截",
  "单包授权 (SPA) 核心端口绝对隐身",
  "高交互蜜罐部署与 TTPs 实时溯源",
  "CLI 命令行一键热拔插部署"
];

export default function PlatformLandingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { platformMarketing, membership } = mockDSL;

  const handleCopy = () => {
    navigator.clipboard.writeText(membership.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // 模拟等待链上确认
    setTimeout(() => {
      setIsVerifying(false);
      alert("✅ 支付验证成功！您的专属 AccessToken 已生成。");
      setShowCheckout(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B1021] text-gray-200 font-sans selection:bg-[#00E5FF] selection:text-[#0B1021]">
      
      {/* 移动端主容器 (最大宽度 480px，模拟真实 H5) */}
      <main className="max-w-md mx-auto bg-[#0D1117] min-h-screen shadow-2xl relative overflow-x-hidden">
        
        {/* 背景光晕 */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#00E5FF]/20 to-transparent opacity-50 pointer-events-none"></div>

        {/* Header */}
        <header className="flex items-center justify-center pt-8 pb-4 relative z-10">
          <Image src="/logo.svg" alt="KForge Logo" width={180} height={44} className="h-10 w-auto" />
        </header>

        {/* Hero Section */}
        <section className="px-6 py-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold mb-6">
            <Zap className="w-3.5 h-3.5" />
            {membership.tier} Membership
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4 tracking-wide">
            {platformMarketing.title}
          </h1>
          <p className="text-gray-400 leading-relaxed text-sm">
            {platformMarketing.subtitle}
          </p>
        </section>

        {/* 动态可视化架构示意图 */}
        <section className="px-6 py-4">
          <div className="bg-[#161B22] border border-gray-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center animate-pulse">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-[10px] text-gray-500">外部攻击</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              <div className="w-full h-0.5 bg-gradient-to-r from-red-500/50 via-[#00E5FF] to-green-500/50 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"></div>
              </div>
              <span className="text-[10px] text-[#00E5FF] mt-2 font-bold bg-[#00E5FF]/10 px-2 py-0.5 rounded">KForge 拦截</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-[10px] text-gray-500">业务源站</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-8">
          <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-widest text-gray-500">无限火力防御矩阵</h2>
          <div className="space-y-4">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded bg-[#00E5FF]/10">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <span className="text-sm text-gray-300 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 底部悬浮购买按钮 */}
        <div className="fixed bottom-0 inset-x-0 w-full max-w-md mx-auto p-4 bg-gradient-to-t from-[#0B1021] via-[#0B1021] to-transparent z-40">
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full bg-[#00E5FF] hover:bg-[#00c8e6] text-[#0B1021] font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95"
          >
            开通 {membership.tier} 会员网络
            <span className="bg-[#0B1021]/20 px-2 py-0.5 rounded-md text-xs ml-2 flex items-center">
              <DollarSign className="w-3 h-3" /> {membership.monthlyPriceUSDT} USDT / 月
            </span>
          </button>
        </div>

        {/* 占位符防止内容被悬浮按钮遮挡 */}
        <div className="h-24"></div>

        {/* 支付弹窗 Modal */}
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center">
            <div className="w-full max-w-md bg-[#161B22] border-t sm:border border-gray-800 rounded-t-3xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom-full duration-300">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-[#00E5FF]" />
                  加密货币结账
                </h3>
                <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white p-2">
                  ✕
                </button>
              </div>

              <div className="bg-[#0D1117] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center mb-6">
                <p className="text-sm text-gray-400 mb-4 text-center">
                  请使用钱包扫码或复制地址，支付准确金额：<br/>
                  <span className="text-2xl font-bold text-white mt-1 block">{membership.monthlyPriceUSDT} <span className="text-[#00E5FF] text-lg">USDT</span></span>
                  <span className="text-xs text-gray-500">(仅支持 TRC20 网络)</span>
                </p>
                
                <div className="bg-white p-3 rounded-xl mb-4">
                  <QRCodeSVG 
                    value={`tron:${membership.walletAddress}?amount=${membership.monthlyPriceUSDT}`} 
                    size={160} 
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="w-full">
                  <label className="text-xs text-gray-500 mb-1 block">收款地址 (TRC20)</label>
                  <div className="flex bg-[#161B22] border border-gray-800 rounded-lg overflow-hidden">
                    <input 
                      type="text" 
                      readOnly 
                      value={membership.walletAddress}
                      className="bg-transparent text-xs text-gray-300 px-3 py-3 w-full font-mono outline-none"
                    />
                    <button 
                      onClick={handleCopy}
                      className="bg-gray-800 px-4 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                    等待链上确认中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    我已经完成支付
                  </>
                )}
              </button>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
