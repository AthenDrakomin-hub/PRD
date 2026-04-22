import { traeSoloTechItems } from './categories/ai-dev-tools/trae-solo';

export interface TechItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  coreFunction: string;
  defenseMechanism: string;
  vulnerabilities: string;
  principle: string;
  tools: string[];
  practiceSteps: string[];
  resources: Array<{ title: string; url: string }>;
  difficulty: 'low' | 'medium' | 'high';
  tags: string[];
  relatedTechIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const techItems: TechItem[] = [
  {
    id: 'multi-hop-proxy',
    name: '多级跳板/代理链',
    categoryId: 'network-concealment',
    description: '通过多个代理节点路由流量，隐藏真实的源 IP 和目标资产位置。',
    coreFunction: '隐藏真实源头与目标，增加攻击追踪溯源难度。',
    defenseMechanism: '通过层层代理将源 IP 混淆在节点中，拦截针对源 IP 的 DDoS 攻击或端口扫描。',
    vulnerabilities: '节点可能被劫持或溯源；链路延迟大；配置错误导致 IP 泄露。',
    principle: `## 多级跳板代理原理
在网络安全中，多级跳板（代理链）技术是指流量在到达最终目标前，需要经过若干个中转代理节点（跳板机）。
1. **第一层跳板**：接收客户端发来的初始流量，只知道客户端的真实 IP。
2. **中间跳板**：将流量转发到下一级，它们不知道真实的源头和最终目标。
3. **末端跳板（出口）**：将流量送达目标服务器，目标服务器只能看到末端跳板的 IP。

这种技术极大地增加了逆向追踪的难度，同时也常被用于隐藏真实的网络服务器入口（例如在某些高防架构中）。`,
    tools: ['Proxychains', 'Shadowsocks', 'Tor', 'Nginx'],
    practiceSteps: [
      '配置第一级代理（例如 SOCKS5）',
      '配置第二级代理并使其接收第一级的转发',
      '使用 proxychains 等工具将应用流量引入代理链',
      '验证最终出口 IP 是否已发生变化'
    ],
    resources: [
      { title: 'Proxychains GitHub', url: 'https://github.com/rofl0r/proxychains-ng' },
      { title: 'Tor Project', url: 'https://www.torproject.org/' }
    ],
    difficulty: 'medium',
    tags: ['代理', '隐匿', '跳板', '网络'],
    relatedTechIds: ['zero-trust-network'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z'
  },
  {
    id: 'zero-trust-network',
    name: '零信任网络架构',
    categoryId: 'network-concealment',
    description: '不信任任何内部或外部网络，所有访问均需严格认证与授权。',
    coreFunction: '收缩攻击面，阻止横向移动，确保基于身份的访问控制。',
    defenseMechanism: '通过持续认证、微隔离和最小权限原则，防范内部威胁和已渗透攻击者的横向扩展。',
    vulnerabilities: '实施成本高；单点认证失效风险；老旧系统兼容性差。',
    principle: `## 零信任网络架构原理
“从不信任，始终验证”。在零信任架构（ZTA）下，位置不再是信任的指标。
1. **身份认证**：任何设备、用户在访问资源前，必须进行强认证（MFA）。
2. **设备健康评估**：不仅认证用户，还要检查设备的安全状态（如是否安装了杀毒软件）。
3. **微隔离（Micro-segmentation）**：将网络划分为极小的区域，使得攻击者即使突破一点，也无法轻易访问其他部分。
4. **动态策略**：权限并非静态，而是基于上下文（时间、地点、行为）动态调整。`,
    tools: ['BeyondCorp', 'Cloudflare Access', 'Tailscale', 'Cisco Zero Trust'],
    practiceSteps: [
      '梳理企业核心资产与访问路径',
      '实施多因素认证 (MFA) 与单点登录 (SSO)',
      '部署微隔离策略',
      '建立持续监控与动态风险评估机制'
    ],
    resources: [
      { title: 'NIST Zero Trust Architecture', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final' }
    ],
    difficulty: 'high',
    tags: ['零信任', '架构', '身份认证', '微隔离'],
    relatedTechIds: ['multi-hop-proxy'],
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2023-11-05T00:00:00Z'
  },
  {
    id: 'waf',
    name: 'Web 应用防火墙 (WAF)',
    categoryId: 'threat-detection',
    description: '监控、过滤并阻止发往 Web 应用的恶意 HTTP 流量。',
    coreFunction: '防御 SQL 注入、跨站脚本 (XSS) 等常见 Web 漏洞攻击。',
    defenseMechanism: '基于规则、签名或机器学习，对 HTTP/HTTPS 流量进行特征匹配和异常行为分析。',
    vulnerabilities: '可能产生误报/漏报；加密流量需解密才能检测；高级攻击可绕过规则。',
    principle: `## WAF 原理
WAF 工作在 OSI 模型的第七层（应用层）。
它通过拦截 HTTP 请求并分析请求头、请求体，将其与已知的攻击特征库（如 OWASP Top 10）进行比对。
如果匹配到 SQL 注入（如 \`UNION SELECT\`）、XSS（如 \`<script>\`）或恶意爬虫，WAF 会直接丢弃请求或进行拦截拦截，返回 403 等状态码。
现代 WAF 结合了语义分析和机器学习，能够检测未知威胁。`,
    tools: ['ModSecurity', 'Cloudflare WAF', 'AWS WAF', 'Aliyun WAF'],
    practiceSteps: [
      '选择部署模式（云WAF/硬件WAF/软件WAF）',
      '配置基础防护规则集（如 OWASP CRS）',
      '开启观察模式，收集误报并调整规则',
      '切换至拦截模式并持续优化'
    ],
    resources: [
      { title: 'OWASP ModSecurity Core Rule Set', url: 'https://coreruleset.org/' }
    ],
    difficulty: 'medium',
    tags: ['Web安全', '防火墙', '防护'],
    relatedTechIds: ['zero-trust-network'],
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-10-12T00:00:00Z'
  },
  {
    id: 'edr',
    name: '端点检测与响应 (EDR)',
    categoryId: 'app-security',
    description: '监控终端设备的运行状态，检测并响应高级威胁。',
    coreFunction: '在主机层面检测恶意进程、内存注入和异常行为。',
    defenseMechanism: '通过在操作系统内核层注入驱动，收集文件读写、网络连接、进程创建等事件，并结合云端威胁情报进行分析。',
    vulnerabilities: '占用系统资源；可能被 Rootkit 绕过；需要专业人员分析告警。',
    principle: `## EDR 原理
不同于传统杀毒软件仅依赖静态特征码，EDR 更侧重于行为分析（Behavioral Analysis）。
1. **数据采集**：通过轻量级 Agent 持续记录端点活动（进程树、注册表修改、网络连接）。
2. **分析与检测**：将数据汇总后，利用启发式分析或机器学习，识别诸如“Word 启动了 PowerShell 并执行了 Base64 代码”这样的异常行为链。
3. **响应**：一旦确认为威胁，EDR 可以自动隔离终端（断网）、终止恶意进程或删除恶意文件。`,
    tools: ['CrowdStrike', 'SentinelOne', 'Microsoft Defender for Endpoint'],
    practiceSteps: [
      '在测试机安装 EDR Agent',
      '模拟一次无文件攻击（如执行一段混淆的 PowerShell）',
      '在 EDR 控制台观察行为告警树',
      '执行远程隔离策略'
    ],
    resources: [
      { title: 'MITRE ATT&CK Framework', url: 'https://attack.mitre.org/' }
    ],
    difficulty: 'high',
    tags: ['端点', '威胁狩猎', '行为分析'],
    relatedTechIds: ['threat-detection'],
    createdAt: '2023-04-20T00:00:00Z',
    updatedAt: '2023-09-15T00:00:00Z'
  },
  ...traeSoloTechItems
];
