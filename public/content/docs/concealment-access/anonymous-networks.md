# 匿名网络 (Anonymous Networks)

## 核心作用
提供去中心化的强匿名通信，保护通信双方的隐私，从根本上抵御元数据分析和流量追踪。

## 实现原理
- **Tor**: 采用洋葱路由，流量经过入口、中继、出口三个节点，每层节点只解密属于自己的一层“洋葱皮”。
- **I2P**: 采用大蒜路由和基于隧道的端到端隐匿，无“出口节点”概念，主要用于构建内部暗网。
- **Nym**: 2026 年新兴的混合网络 (Mixnet)，通过在节点间引入虚假的诱饵流量和随机延迟，彻底击败基于时间相关性的全局监听。

## 主要防御手段
- 封禁已公开的匿名网络节点 IP 库。
- 在网络边界检测匿名网络的特有握手特征。
- 实施基于时间相关性的去匿名化攻击。

## 漏洞与局限
- **极高的延迟**：多次路由跳转与人为延迟导致网络速度极慢。
- **出口节点风险**：Tor 的出口节点若为恶意，可轻易监听未加密的明文 HTTP 流量。
- **女巫攻击 (Sybil Attack)**：攻击者若控制大量节点，可大幅提升去匿名化的成功率。

## 典型工具
- **Tor Project**: 最著名的开源匿名通信网络。
- **I2P (Invisible Internet Project)**: 专为暗网服务设计的隐匿网络。
- **Nym**: 基于 Mixnet 架构的下一代隐私基础设施。

## 实践建议
搭建一个 Tor Hidden Service (v3)，通过生成的 `.onion` 域名，安全、隐匿地暴露本地的 Nginx 测试页面，并尝试使用 Tor 浏览器访问。

## 学习资源
- [Tor Project 设计原理论文](https://svn.torproject.org/svn/projects/design-paper/tor-design.pdf)
- [Nym Whitepaper](https://nymtech.net/nym-whitepaper.pdf)\n