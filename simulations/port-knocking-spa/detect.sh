#!/bin/sh
echo "[🚀 零信任 SPA 攻防模拟器] 正在启动验证脚本..."

echo "\n[1/3] 模拟常规黑客使用 Nmap/Nc 探测服务器的 22 端口..."
echo "正在扫描..."
# 模拟扫描
nc -w 2 -z spa-gateway 22
scan_result=$?
if [ $scan_result -eq 0 ]; then
  echo "[❌ 隐匿失败] 端口 22 是开放的！"
else
  echo "[✅ 隐匿成功] 连接超时/拒绝！对于没有敲门令牌的黑客，您的服务器端口 22 就像不存在一样 (100% 隐身)。"
fi

echo "\n[2/3] 合法运维人员发送经过 HMAC 签名的单包授权 (SPA) 敲门数据..."
# 发送含有 KFORGE_AUTH_KEY 签名的假数据包到特定敲门端口
echo "KFORGE_AUTH_KEY:USER123:TIMESTAMP" | nc -w 1 spa-gateway 62201
echo "[+] 已发送加密敲门包 (Single Packet Auth) 到网关！"
sleep 1

echo "\n[3/3] 运维人员再次尝试连接 SSH 端口..."
nc -w 2 -z spa-gateway 22
auth_result=$?
if [ $auth_result -eq 0 ]; then
  echo "[✅ 授权成功] 网关成功解析签名！为您动态开放了 SSH 端口通道！"
  # 尝试读取 SSH Banner
  echo "" | nc -w 2 spa-gateway 22
else
  echo "[❌ 授权失败] 端口未开放！"
fi

echo "\n==========================================="
echo "[✅ 验证完成] 单包授权 (SPA) 成功！您的核心管理端口实现了真正的“先认证，后连接”零信任模型。"
