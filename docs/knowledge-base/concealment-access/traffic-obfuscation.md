# 流量混淆与伪装 (Traffic Obfuscation)

## 核心作用
将代理或恶意特征流量伪装成正常的 Web 流量（如普通的 HTTPS 或 WebSocket），从而绕过防火墙的深度包检测（DPI）。

## 实现原理
主要分为两种流派：一是**特征消除**（如随机化包长和发包时序）；二是**特征模拟**。在 2026 年，主流的 XTLS Reality 技术通过直接复用目标白名单大厂网站的 TLS 证书指纹，消除了服务端的异常 TLS 特征，使得流量在防火墙看来与访问合法网站别无二致。

## 主要防御手段
- 主动探测 (Active Probing)：防火墙主动向目标 IP 发起恶意请求测试其反应。
- 基于机器学习的异常行为基线分析。
- 强制封禁未备案的 SNI (Server Name Indication)。

## 漏洞与局限
- **计算开销巨大**：复杂的混淆算法会消耗大量 CPU 资源。
- **完美即异常**："太完美的伪装"（如信息熵过高）本身可能成为一种被识别的特征。
- **无法抵御白名单**：在极端的全局物理白名单网络中，任何混淆都毫无作用。

## 典型工具
- **Xray (XTLS-Reality)**: 当下最前沿的 TLS 指纹消除与伪装技术。
- **Shadowsocks-Rust (AEAD)**: 采用现代 AEAD 密码学重写的经典混淆工具。
- **Obfs4**: Tor 网络广泛使用的流量混淆插件。

## 实践建议
部署一台 Xray Reality 服务端，将流量伪装成访问 `microsoft.com`，随后使用 Wireshark 进行本地抓包，观察并分析其 TLS Client Hello 握手特征。

## 学习资源
- [Project X 官方文档](https://xtls.github.io/)
- [GFW 论文与对抗技术深度分析](https://gfw.report/)\n