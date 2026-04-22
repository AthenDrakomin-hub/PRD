#!/bin/sh
echo "[🛡️ KForge WAF Shield] 初始化 Web 应用防火墙 (ModSecurity + OWASP CRS)..."
echo "[🛡️ KForge WAF Shield] 监听对外端口: ${PUBLIC_PORT:-8080}"
echo "[🛡️ KForge WAF Shield] 代理后端目标: http://${TARGET_HOST:-host.docker.internal}:${TARGET_PORT:-3000}"

echo "==========================================="
echo "激活的安全策略清单："
echo "✅ SQL 注入 (SQLi) 深度拦截"
echo "✅ 跨站脚本攻击 (XSS) 过滤"
echo "✅ 远程文件包含 (RFI) & 本地文件包含 (LFI) 阻断"
echo "✅ 恶意 Scanner/Bot 请求头识别"
echo "==========================================="
echo "[🛡️ KForge WAF Shield] 规则引擎已开启 (SEC_RULE_ENGINE=On)，正在实时清洗七层恶意载荷！"
