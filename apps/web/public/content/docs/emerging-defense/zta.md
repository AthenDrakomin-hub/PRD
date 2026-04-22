# 零信任架构 (Zero Trust Architecture)

## 核心作用
彻底摒弃传统 VPN“内网即安全”的理念，假设网络已被完全攻破，对每一次访问进行无差别的持续验证。

## 实现原理
无论用户身处何地，访问每个企业应用都需经过身份（SSO/MFA）与设备健康度（如补丁状态、杀毒软件是否开启）的动态校验。通过身份感知代理 (IAP) 在用户与具体应用间建立微隧道，拒绝授予对整个子网的访问权限。

## 主要防御手段
- 彻底收缩业务暴露面。
- 极大提升攻击者在内网横向移动的难度。

## 漏洞与局限
- **Buzzword 泛滥**："零信任"常被厂商滥用为过度营销词汇，导致落地变形。
- **遗留系统改造难**：强行将缺乏现代认证接口的老旧系统接入 ZTA 成本极高。
- **IdP 单点故障**：高度依赖集中式身份提供商，IdP 若宕机，全公司将无法工作。

## 典型工具
- **Headscale**: Tailscale 的开源控制端，基于 WireGuard 构建极简 ZTA 组网。
- **NetBird**: 优秀的开源零信任网络访问 (ZTNA) 平台。
- **Pomerium**: 基于上下文的开源身份感知代理。

## 实践建议
使用 Headscale 搭建一个点对点 WireGuard 网络，将内网核心服务的 SSH 端口仅暴露给经过授权且已分配专属 Tailscale IP 的节点。

## 学习资源
- [NIST SP 800-207 零信任架构标准](https://csrc.nist.gov/publications/detail/sp/800-207/final)
- [Tailscale 架构原理解析](https://tailscale.com/blog/how-tailscale-works/)\n