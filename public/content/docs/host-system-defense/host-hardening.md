# 主机安全加固 (Host Hardening)

## 核心作用
减小操作系统的基础攻击面，大幅提升攻击者利用漏洞获取权限或进行内网横向移动的门槛。

## 实现原理
通过系统级的最小化配置保障安全：禁用不必要的服务与端口，配置严格的密码与 SSH 登录策略，启用 AppArmor/SELinux 实施强制访问控制 (MAC)，以及进行内核参数 (sysctl) 的安全调优。

## 主要防御手段
- 防御本地提权漏洞 (Privilege Escalation)。
- 限制恶意进程的系统调用权限与目录读写范围。
- 抵御针对系统服务的自动化暴力破解。

## 漏洞与局限
- **破坏遗留应用**：过于严格的 SELinux 策略经常导致老旧的合法应用无法正常运行。
- **运维成本高**：在大规模、异构的服务器集群中保持加固策略的一致性是一场噩梦。

## 典型工具
- **Lynis**: 强大的 Linux/Unix 自动化安全审计工具。
- **Ansible Hardening (DevSec)**: 将安全基线代码化 (IaC) 的自动化配置脚本。
- **OpenSCAP**: 标准化的合规性评估工具。

## 实践建议
在您的 Linux 服务器上运行 Lynis 进行全面审计，根据生成的审计报告修复 Top 3 的红色警告，并修改 `/etc/sysctl.conf` 以强化抵御 SYN Flood 的能力。

## 学习资源
- [CIS Benchmarks 最佳实践](https://www.cisecurity.org/cis-benchmarks/)
- [Lynis 安全审计指南](https://cisofy.com/lynis/)\n