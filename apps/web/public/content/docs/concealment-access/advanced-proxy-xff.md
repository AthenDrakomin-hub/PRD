# 高级代理与 XFF 头伪装 (Advanced Proxy & XFF Spoofing)

## 核心作用
在复杂的七层反向代理架构中，正确传递、校验或伪造客户端真实 IP，是访问控制和溯源的核心博弈点。

## 实现原理
HTTP 协议依赖 `X-Forwarded-For` (XFF) 或 `X-Real-IP` 等 Header 记录代理链路。由于这些 Header 是纯文本，攻击者可以轻易伪造它们以绕过基于 IP 的访问控制限制；而防御者则必须在最外层的边缘节点强制重写该 Header，并在内部微服务中建立严格的信任链。

## 主要防御手段
- 边缘 WAF 或负载均衡器强制覆写外网传入的 XFF 头。
- 业务后端配置严格的信任代理列表 (Trusted Proxies)，拒绝非信任节点的 IP 传递。

## 漏洞与局限
- **配置极易出错**：微服务架构层级越多，IP 传递越容易出现配置遗漏，导致认证绕过。
- **速率限制失效**：一旦 XFF 被成功伪造，基于 IP 的 Rate Limiting (限流) 策略将完全失效。

## 典型工具
- **Nginx (realip_module)**: 高性能反代中处理真实 IP 的核心模块。
- **Envoy / Traefik**: 云原生时代广泛使用的边缘网关代理。

## 实践建议
在 Nginx 中配置 `set_real_ip_from` 信任本地代理，并使用 `curl -H "X-Forwarded-For: 127.0.0.1" http://your-site` 伪造 XFF 头，测试后端应用获取到的究竟是真实 IP 还是伪造 IP。

## 学习资源
- [Nginx Real-IP Module 官方手册](https://nginx.org/en/docs/http/ngx_http_realip_module.html)
- [HTTP 代理安全与头伪装实战](https://portswigger.net/web-security)\n