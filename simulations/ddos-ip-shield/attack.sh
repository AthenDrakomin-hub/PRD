#!/bin/sh
# apply.sh - 核心防御插件执行脚本
# 此脚本在容器内执行，负责汇报当前防御策略

echo "[🛡️ KForge Shield] 初始化 DDoS 防御与 IP 隐匿节点..."
echo "[🛡️ KForge Shield] 监听对外端口: ${PUBLIC_PORT:-8080}"
echo "[🛡️ KForge Shield] 代理后端目标: http://${TARGET_HOST:-host.docker.internal}:${TARGET_PORT:-3000}"

echo "==========================================="
echo "激活的安全策略清单："
echo "✅ 真实 IP 隐匿 (后端服务不可见外界网络拓扑)"
echo "✅ HTTP 头部指纹清洗 (Server, X-Powered-By 隐藏)"
echo "✅ 动态速率限制 (单 IP 最大并发速率: 5 r/s, 溢出队列: 10)"
echo "==========================================="

# Nginx 在后台运行，此处仅做日志记录
echo "[🛡️ KForge Shield] 防御节点已上线，正在实时清洗恶意流量！"
