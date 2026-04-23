# 域名系统安全 (DNSSEC/DoH/DoQ)

## 核心作用
确保 DNS 解析结果的真实性和完整性，彻底防止 DNS 劫持、中间人篡改和缓存投毒。

## 实现原理
DNSSEC 基于公钥密码学，为每个 DNS 记录生成数字签名 (RRSIG)。递归解析器通过信任链（从根域名 `.` 到顶级域名再到具体域名）逐级验证签名。在 2026 年，DNSSEC 必然与 DoH (DNS over HTTPS) 或 DoQ (DNS over QUIC) 结合使用，在保证真实性的同时保护查询隐私。

## 主要防御手段
- 彻底杜绝 ISP 级别的 DNS 污染。
- 防止用户被重定向到高度仿冒的恶意钓鱼网站。

## 漏洞与局限
- **配置极度复杂**：密钥轮转 (Key Rollover) 稍有不慎就会导致全站域名无法解析。
- **放大攻击风险**：DNSSEC 的响应包包含大量签名数据，体积显著变大，容易被黑客利用发起 DNS 放大 DDoS 攻击。
- **Zone Walking**：配置不当可能允许攻击者遍历并收集整个域名的所有子域名信息。

## 典型工具
- **CoreDNS**: 云原生时代灵活且插件化的 DNS 服务器。
- **Unbound**: 安全、验证型的本地递归 DNS 解析器。
- **AdGuard Home**: 兼具隐私保护与去广告的现代 DNS 工具。

## 实践建议
配置 Unbound 作为本地 DNS 解析器，开启 DNSSEC 验证功能，并尝试使用命令 `dig +dnssec cloudflare.com` 查询并观察返回包中的数字签名信息。

## 学习资源
- [ICANN DNSSEC 详解](https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en)
- [CoreDNS 官方文档](https://coredns.io/)\n