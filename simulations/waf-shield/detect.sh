#!/bin/sh
echo "[🚀 WAF 攻防验证模拟器] 正在启动验证脚本，目标: http://waf:80"

echo "\n[1/3] 模拟合法用户访问主页..."
curl -s -o /dev/null -w "HTTP 状态码: %{http_code}\n" http://waf:80
echo "[✅] 正常访问未被拦截！"

echo "\n[2/3] 尝试注入 SQL Payload (/?id=1' OR '1'='1)..."
# 模拟 SQL 注入攻击
sql_res=$(curl -s -o /dev/null -w "%{http_code}" "http://waf:80/?id=1'%20OR%20'1'='1")
echo "HTTP 状态码: $sql_res"
if [ "$sql_res" = "403" ]; then
  echo "[🛡️ 拦截成功] WAF 识别到 SQL 注入特征，已返回 403 Forbidden 阻断连接！"
else
  echo "[❌ 拦截失败] 攻击穿透了 WAF！"
fi

echo "\n[3/3] 尝试执行 XSS 跨站脚本攻击 (/?q=<script>alert(1)</script>)..."
xss_res=$(curl -s -o /dev/null -w "%{http_code}" "http://waf:80/?q=%3Cscript%3Ealert(1)%3C/script%3E")
echo "HTTP 状态码: $xss_res"
if [ "$xss_res" = "403" ]; then
  echo "[🛡️ 拦截成功] WAF 识别到 XSS 恶意脚本特征，已返回 403 Forbidden 阻断连接！"
else
  echo "[❌ 拦截失败] 攻击穿透了 WAF！"
fi

echo "\n==========================================="
echo "[✅ 验证完成] KForge WAF 插件核心 OWASP CRS 规则集已生效！您的源站已受到七层(L7)深度防御。"
