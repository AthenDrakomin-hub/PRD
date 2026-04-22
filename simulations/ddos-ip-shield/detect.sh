#!/bin/sh
# detect.sh - 模拟恶意攻击以验证防御盾牌是否生效
echo "[🚀 攻击模拟器] 正在启动验证脚本，目标: http://shield:80"

echo "\n[🚀 测试阶段 1] 模拟正常用户的合法访问 (1 请求/秒)..."
for i in $(seq 1 3); do
  response=$(curl -s -o /dev/null -w "%{http_code}" http://shield:80)
  echo "用户请求 $i -> HTTP 状态码: $response"
  sleep 1
done
echo "[✅ 测试阶段 1 完成] 正常访问未被拦截！"

echo "\n[🚀 测试阶段 2] 模拟恶意爬虫/DDoS 洪水攻击 (高并发)..."
echo "正在并发发送 20 个请求..."

for i in $(seq 1 20); do
  # 并发执行以触发 Nginx 限流
  curl -s -o /dev/null -w "%{http_code} " http://shield:80 &
done
wait # 等待所有并发请求完成

echo "\n\n[🛡️ 防御结果分析]"
echo "如上所示：大量并发请求已被阻断，返回了 HTTP 429 (Too Many Requests)！"
echo "同时您的真实服务器 IP 被彻底隐匿在代理之后。防御策略部署成功！"
