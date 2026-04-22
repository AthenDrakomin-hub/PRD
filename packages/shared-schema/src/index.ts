/**
 * KForge 核心共享数据结构 (JSON DSL) - 面向 2026 年的会员制与全球防御网络
 */

export interface KForgeMembershipDSL {
  tenantId: string;
  version: string;
  
  // --- 平台级订阅营销 (H5 服务消费) ---
  platformMarketing: {
    title: string;          // 平台愿景大标题
    subtitle: string;       // 核心防御理念
    themeColor: string;
  };

  // --- 全局会员订阅制配置 (Daemon 与 H5 消费) ---
  membership: {
    tier: 'Pro' | 'Enterprise' | 'Web3-Native'; // 会员等级
    monthlyPriceUSDT: number; // 全平台包月订阅费
    walletAddress: string;    // 收款/验证智能合约地址
    maxActiveNodes: number;   // 允许并发拉起的最大防御节点数
  };

  // --- 租户的动态防御拓扑 (Core/Daemon 与 Admin 画布消费) ---
  topology: {
    nodes: Array<{
      id: string;
      skillId: string;      // 对应 @kforge/core 中的原子技能 (只要是会员，所有技能全解锁)
      position: { x: number; y: number }; 
      config: Record<string, any>; 
    }>;
    edges: Array<{
      id: string;
      source: string;       
      target: string;
    }>;
  };

  createdAt: string;
  updatedAt: string;
}

