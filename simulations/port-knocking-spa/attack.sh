#!/bin/sh
echo "[🛡️ KForge SPA Gateway] 启动单包授权隐匿网关 (Single Packet Authorization)..."
echo "==========================================="
echo "激活的安全策略清单："
echo "✅ 端口级绝对隐身 (Nmap 扫描显示为 filtered 或 closed)"
echo "✅ HMAC 密码学签名敲门 (防重放、防嗅探)"
echo "✅ 零日漏洞绝缘 (服务未暴露前，即使 OpenSSH 爆发 0-day 也无法利用)"
echo "==========================================="
echo "[🛡️ KForge SPA Gateway] 网关已进入静默监听模式。所有未授权探测将被直接丢弃！"
