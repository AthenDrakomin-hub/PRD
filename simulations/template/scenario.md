---
sim_id: "【场景唯一标识，如 dns-tunnel-detect】"
title: "【场景名称，如 DNS隧道建立与检测模拟】"
category: "威胁检测"
tags: [DNS隧道, iodine, 流量分析, 模拟]
difficulty: "入门 / 中级 / 高级"
estimated_time: "5分钟"
---

## 🎯 模拟目标
1. 目标一
2. 目标二
3. 验证笔记 [[关联笔记标题]] 中的方法

## 🧱 网络拓扑
- `attacker` (10.0.1.2) : 攻击机，安装工具A
- `victim` (10.0.1.3) : 靶机，运行服务B
- `detector` (10.0.1.4) : 检测机，抓包分析

## 📋 模拟步骤
1. 启动环境：`docker-compose up -d`
2. 攻击机执行：`./attack.sh`
3. 检测机执行：`./detect.sh`
4. 查看输出，确认检测指标

## 📊 预期结果
- 攻击机成功建立隧道，传输测试数据。
- 检测机捕获到特征流量（如大量TXT请求、域名长度异常等）。
