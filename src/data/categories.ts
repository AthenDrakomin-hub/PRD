export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export const categories: Category[] = [
  {
    id: 'network-concealment',
    name: '网络隐匿与访问控制',
    description: '通过代理、跳板及零信任架构等手段隐藏真实网络资产，收缩攻击面。',
    icon: 'Shield',
    order: 1,
  },
  {
    id: 'threat-detection',
    name: '威胁检测与响应',
    description: '构建全方位监控体系，实时识别、分析和响应各类网络攻击行为。',
    icon: 'Activity',
    order: 2,
  },
  {
    id: 'data-protection',
    name: '数据保护与隐私',
    description: '采用加密、脱敏及防泄漏技术，确保敏感数据在传输与存储中的安全。',
    icon: 'Lock',
    order: 3,
  },
  {
    id: 'app-security',
    name: '应用与端点安全',
    description: '加固应用层架构与终端设备，抵御各类漏洞利用及恶意代码执行。',
    icon: 'Smartphone',
    order: 4,
  }
];
