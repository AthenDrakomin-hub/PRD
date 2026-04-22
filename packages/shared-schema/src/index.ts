/**
 * KForge 核心共享数据结构 (JSON DSL)
 */

export interface KForgePluginDSL {
  id: string;
  version: string;
  
  // --- 营销与展示元数据 (H5 服务消费) ---
  marketing: {
    title: string;          // H5大标题：如"一键防御 DDoS"
    description: string;    // 卖点描述
    features: string[];     // 核心特性列表
    themeColor: string;     // H5主题色
    coverImage?: string;    // 封面大图 URL
  };

  // --- 商业化与支付配置 (Daemon 与 H5 消费) ---
  payment: {
    priceAmount: number;    // 定价金额 (例如: 100)
    currency: 'USDT-TRC20'; // 货币类型
    walletAddress: string;  // 收款钱包地址
    model: 'one-time' | 'subscription' | 'pay-per-use'; // 商业模式
    webhookUrl?: string;    // 支付成功后的回调地址
  };

  // --- 核心执行逻辑 (Core/Daemon 与 Admin 画布消费) ---
  workflow: {
    nodes: Array<{
      id: string;
      skillId: string;      // 对应 @kforge/core 中的原子技能 (e.g., 'multi-hop-proxy')
      position: { x: number; y: number }; // 画布坐标
      config: Record<string, any>; // 用户在 Admin 填写的属性配置
    }>;
    edges: Array<{
      id: string;
      source: string;       // 节点连接关系
      target: string;
    }>;
  };

  createdAt: string;
  updatedAt: string;
}
