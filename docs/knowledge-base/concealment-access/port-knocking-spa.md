# 端口敲门与单包授权 (Port Knocking / SPA)

## 核心作用
默认在防火墙级别完全隐藏关键服务（如 SSH/RDP），使其对外部扫描器“隐身”，仅对持有正确密码学凭证的请求者动态开放。

## 实现原理
传统敲门要求客户端按特定顺序向服务器发送一组数据包，防火墙监控到正确序列后放行。而 SPA (Single Packet Authorization) 则更加先进：客户端发送一个经过 HMAC 加密且防重放的单数据包，服务端通过 eBPF 或 libpcap 截获，在不建立任何 TCP 连接的情况下验证该包，验证通过后临时修改 iptables/nftables 放行源 IP。

## 主要防御手段
- 彻底免疫各类针对暴露服务的 0-day 漏洞盲打扫描。
- 阻止针对 SSH 等管理端口的自动化暴力破解。

## 漏洞与局限
- **重放攻击**：传统敲门极易被嗅探并重放（SPA 已解决此问题）。
- **NAT 误放行**：在 NAT 环境下，放行敲门者的公网 IP 可能会导致同一局域网下的其他恶意用户也被误放行。
- **用户体验差**：增加了合法运维人员访问基础设施的复杂度。

## 典型工具
- **fwknop**: SPA 单包授权领域的开源标杆工具。
- **knockd**: 传统的轻量级端口敲门守护进程。

## 实践建议
在 Linux 服务器配置默认的 DROP 规则，使用 fwknop 结合 GPG 密钥生成 SPA 令牌，实现 SSH 端口的“隐身访问”验证。

## 学习资源
- [fwknop 官方文档与架构](https://www.cipherdyne.org/fwknop/)
- [单包授权架构安全解析](https://en.wikipedia.org/wiki/Single_Packet_Authorization)\n