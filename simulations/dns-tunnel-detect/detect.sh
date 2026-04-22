#!/bin/bash
# 在 detector 容器内执行

echo "[*] 开始抓包，监听 eth0 接口的 DNS 流量..."
# 抓取 100 个 DNS 数据包，保存为 dns_tunnel.pcap
tshark -i eth0 -f "port 53" -c 100 -w dns_tunnel.pcap &

# 等待抓包完成
sleep 30

echo "[*] 分析抓包文件..."
# 使用 tshark 统计 DNS 请求的域名长度分布
tshark -r dns_tunnel.pcap -T fields -e dns.qry.name | awk '{print length}' | sort -n | uniq -c

echo "[+] 检测脚本执行完毕。"
