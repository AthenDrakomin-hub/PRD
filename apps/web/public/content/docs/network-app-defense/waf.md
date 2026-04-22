# Web 应用防火墙 (WAF)

## 核心作用
专注保护 Web 服务与 API，过滤恶意的 HTTP/HTTPS 流量，是防御 OWASP Top 10 威胁的第一道防线。

## 实现原理
深入解析 HTTP 语义（Header、Body、JSON、XML），执行基于正则表达式的复杂规则匹配（如大名鼎鼎的 OWASP CRS 核心规则集）。2026年，现代 WAF 更多利用词法语义分析和机器学习来识别异常 Payload，降低对正则的依赖。

## 主要防御手段
- 防御 SQL 注入、XSS 跨站脚本。
- 拦截目录遍历、远程命令执行 (RCE) 攻击。
- 阻断恶意的自动化爬虫与扫描器。

## 漏洞与局限
- **绕过手段层出不穷**：常被攻击者利用各种编码混淆（如 Base64, Unicode, HTTP 分块传输）成功绕过。
- **业务误报高**：复杂的业务逻辑（如富文本编辑器提交）极易触发 WAF 误报，导致正常用户被拦截。

## 典型工具
- **Coraza**: Go 语言编写的现代企业级 WAF，完美支持 Envoy 与 WASM。
- **ModSecurity**: 传统的 WAF 标杆。
- **SafeLine (长亭雷池)**: 极具人气的社区版高可用 WAF。

## 实践建议
使用 Docker 快速拉取雷池 (SafeLine) WAF，反代本地部署的 Web 靶场（如 DVWA），使用 SQLMap 进行自动化注入扫描并观察 WAF 的拦截效果。

## 学习资源
- [OWASP ModSecurity Core Rule Set](https://coreruleset.org/)
- [Coraza 架构与部署解析](https://coraza.io/)\n