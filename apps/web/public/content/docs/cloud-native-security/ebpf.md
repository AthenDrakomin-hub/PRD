---
title: "eBPF 容器安全监控"
category: "云原生安全"
tags: [eBPF, 容器安全, Linux内核, 监控]
summary: "利用 eBPF 技术在 Linux 内核层无侵入地监控容器异常行为与系统调用。"
created: 2026-04-22
updated: 2026-04-22
status: "reviewed"
skill_level: "专家"
---

# eBPF 容器安全监控

## 🎯 适用场景
随着容器化（Docker/K8s）的普及，传统的基于主机的入侵检测系统（HIDS）在容器环境中往往显得笨重且侵入性强。当你需要**低开销、无侵入**地监控容器内部的进程创建、文件读写、网络连接，甚至阻断提权行为时，eBPF 是当下的首选技术。

## ⚙️ 核心概念
eBPF（Extended Berkeley Packet Filter）允许在 Linux 内核中运行沙盒程序，而无需修改内核源码或加载内核模块。
它就像是内核的“JavaScript”，通过在特定的 Hook 点（如 Kprobes、Tracepoints、XDP）挂载程序，可以实时捕获系统行为。

## 🛡️ 核心作用与防御手段
1. **进程行为审计**：监控 `execve` 系统调用，发现容器内未经授权的命令执行（如反弹 Shell）。
2. **文件系统保护**：拦截对敏感目录（如 `/etc/shadow` 或 K8s Token 目录）的异常读写。
3. **网络微隔离**：在 XDP 层或 Socket 层拦截恶意流量，比 iptables 性能更高。
4. **防御容器逃逸**：检测针对 `ptrace`、`cap_setuid` 等可能导致逃逸的高危操作。

## ⚠️ 漏洞与局限
| 问题现象 | 原因 | 解决方案 |
|---------|------|----------|
| 兼容性问题 | 依赖较新的 Linux 内核版本（通常 >= 4.14，高级特性需 5.x） | 升级宿主机内核，或回退到传统的 auditd 方案 |
| 开发门槛极高 | 需要编写 C 代码，并了解内核数据结构 | 使用成熟的开源工具（Tetragon, Falco）而非从头手写 |
| 性能开销 | 尽管很小，但在极高并发下（如每秒百万次系统调用），频繁的上下文切换仍有影响 | 优化 eBPF 过滤逻辑，尽量在内核态丢弃无关事件 |

## 🛠️ 典型工具
- **Cilium Tetragon**：强大的 eBPF 安全观测和执行工具，不仅能看，还能“阻断”。
- **Falco**：Sysdig 开源的云原生运行时安全项目，内置丰富的 K8s/容器威胁规则。
- **Tracee**：Aqua Security 开源的 eBPF 追踪工具。

## 📝 实践建议
1. 在测试集群中部署 Falco，观察其默认规则集对常规操作的告警。
2. 编写一个简单的反弹 Shell 脚本放入容器运行，查看 Falco/Tetragon 是否能准确捕获。
3. 学习使用 BCC (BPF Compiler Collection) 或 libbpf 编写一个简单的 `execsnoop` 工具。

## 🔗 学习资源
- [eBPF 官方网站](https://ebpf.io/)
- [Cilium Tetragon GitHub](https://github.com/cilium/tetragon)
- [Falco 官方文档](https://falco.org/docs/)
