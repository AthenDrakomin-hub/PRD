# 内容分发网络 (CDN)

## 核心作用
在加速静态资源访问、提升用户体验的同时，隐藏并保护源站 IP 免受直接的定向攻击。

## 实现原理
在全球边缘节点缓存业务内容。用户请求首先到达距离最近的 CDN 节点，若缓存未命中才向源站回源。通过反向代理机制，攻击者无法直接获取源站的真实 IP，从而无法直接向源站发动 L3/L4 层的 DDoS 攻击。同时边缘节点可执行自定义的安全脚本 (Edge Computing)。

## 主要防御手段
- 隐藏真实资产 IP，收缩暴露面。
- 依靠边缘节点庞大的总带宽吸收大规模攻击。
- 边缘鉴权与区域访问封禁。

## 漏洞与局限
- **缓存投毒 (Cache Poisoning)**：若缓存键配置不当，攻击者可污染缓存，导致所有用户访问到恶意内容。
- **源站泄露灾难**：若源站 IP 曾通过历史 DNS 记录、邮件头或 SSRF 漏洞泄露，CDN 的防护屏障将形同虚设。

## 典型工具
- **Varnish Cache**: 极速的开源 HTTP 引擎与反向代理。
- **Apache Traffic Server (ATS)**: 雅虎捐赠的企业级缓存服务器。
- **Cloudflare**: 全球最普及的 CDN 与边缘安全网络。

## 实践建议
部署 Varnish 作为前端缓存，编写 VCL (Varnish Configuration Language) 配置文件，直接在缓存层拦截外部对敏感路径（如 `/admin` 或 `.env`）的非法访问。

## 学习资源
- [Varnish VCL 语法指南](https://varnish-cache.org/docs/)
- [Web 缓存投毒漏洞实战解析](https://portswigger.net/web-security/web-cache-poisoning)\n