---
title: "TPROXY 透明代理实战：让所有流量无感走代理"
category: "网络隐匿"
tags: [透明代理, TPROXY, iptables, 路由, 全局代理]
summary: "使用 iptables TPROXY + 策略路由，实现真正全局透明代理，解决终端应用不走系统代理的难题。"
created: 2026-03-15
updated: 2026-03-20
status: "reviewed"
skill_level: "进阶"
---

# TPROXY 透明代理实战：让所有流量无感走代理

## 🎯 适用场景

1. 你在 Linux 上运行了某个代理客户端（如 Clash、V2Ray），但部分命令行工具（wget、curl）或脚本**不走系统代理**，导致流量泄露。
2. 你想让**整台虚拟机或容器的所有流量**都强制经过代理，且对上层应用**完全透明**（无需配置环境变量）。
3. 你需要做流量重定向，但普通 REDIRECT 会丢失原始目标地址，导致代理无法知道真正要访问的域名/IP。

**一句话**：当你需要“把整台机器的出口流量塞进代理管道”时，用这个方案。

## ⚙️ 核心操作

### 1. 开启 IP 转发
```bash
sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

### 2. 添加 TPROXY 规则（假设代理监听端口为 7890）
```bash
# 创建路由表 100，用于标记流量
ip rule add fwmark 1 table 100
ip route add local 0.0.0.0/0 dev lo table 100

# 使用 TPROXY 将符合条件的流量转到代理端口
iptables -t mangle -N DIVERT
iptables -t mangle -A DIVERT -j MARK --set-mark 1
iptables -t mangle -A DIVERT -j ACCEPT
iptables -t mangle -I PREROUTING -p tcp -m socket -j DIVERT

# 核心规则：所有非本地发出的 TCP 流量，打标记 1，交给 TPROXY
iptables -t mangle -A PREROUTING -p tcp --dport 1:65535 -j TPROXY --on-port 7890 --tproxy-mark 0x1/0x1
```

### 3. 配置代理软件支持 TPROXY
以 Clash 为例，配置文件需开启：
```yaml
tproxy: true
tproxy-port: 7890
```

## ⚠️ 避坑记录

| 问题现象 | 原因 | 解决方案 |
|---------|------|----------|
| 流量未走代理，直接出去了 | 策略路由未生效，或标记未被正确识别 | 检查 `ip rule list`，确保 fwmark 1 指向 table 100 |
| 代理日志显示目标地址全是 127.0.0.1 | 使用了 REDIRECT 而非 TPROXY | REDIRECT 会丢失原始目标，必须用 TPROXY |
| UDP 流量无法代理 | TPROXY 仅处理 TCP；UDP 需单独配置 | 额外添加 `-p udp -j TPROXY`，并确保代理支持 UDP |
| 本机发出的连接也被代理，造成死循环 | 缺少 `-m socket` 规则绕过已代理连接 | 必须添加 `-m socket -j DIVERT` 规则 |

## 🔗 关联笔记

- [[隐匿_代理链构建]]
- [[工具_Clash配置详解]]
- [[检测_透明代理流量特征分析]]
