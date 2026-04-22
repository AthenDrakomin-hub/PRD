---
sim_id: "dns-tunnel-detect"
title: "DNS隧道建立与检测模拟"
category: "威胁检测"
tags: [DNS隧道, iodine, 流量分析, 模拟]
difficulty: "中级"
estimated_time: "5分钟"
---

## 🎯 模拟目标
1. 在攻击机上使用 `iodine` 建立一条 DNS 隧道。
2. 在检测器上通过 `dnstop` 和 `tshark` 发现异常 DNS 流量特征。
3. 验证笔记 [[检测_DNS隧道分析]] 中的检测方法。

## 🧱 网络拓扑
- `attacker` (10.0.1.2) : 攻击机，安装 iodine
- `dns-server` (10.0.1.3) : 被控 DNS 服务器（模拟公网域名）
- `detector` (10.0.1.4) : 检测机，镜像交换机流量

## 📋 模拟步骤
1. 启动环境：`docker-compose up -d`
2. 攻击机执行：`./attack.sh`（建立隧道并传输测试数据）
3. 检测机执行：`./detect.sh`（抓包并输出统计）
4. 查看结果，确认检测指标。
