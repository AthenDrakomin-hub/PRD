# 云安全态势管理 (CSPM)

## 核心作用
自动化扫描云基础设施与容器编排配置，提前发现并消除不符合安全基线（如 CIS Benchmarks）的风险。

## 实现原理
通过调用云厂商 API 或静态扫描 IaC 配置文件（如 YAML, Terraform, Helm），检测诸如 S3 存储桶公开、IAM 权限过大、容器分配了 `privileged` 特权等问题。

## 主要防御手段
- 将安全左移 (Shift Left)，在代码部署前即消灭云环境配置错误。
- 持续进行合规性（如 GDPR, PCI-DSS）自动化审计。

## 漏洞与局限
- **缺乏运行时防御**：主要为静态扫描，无法防御服务运行时的真实攻击（需结合 CWPP）。
- **多云异构挑战**：在 AWS、阿里云和私有云混合的环境下，策略的统一标准化难度极大。

## 典型工具
- **Trivy**: Aqua Security 开源的极速全能扫描器（容器、IaC、依赖漏洞）。
- **Cloud Custodian**: CNCF 托管的强大云安全策略即代码工具。
- **Prowler**: 针对 AWS 等云平台的安全评估与基线测试利器。

## 实践建议
使用 Trivy 扫描本地的一个 Dockerfile 和 K8s Deployment 配置文件，找出其中存在的关键安全风险（如使用 root 运行）并进行修复。

## 学习资源
- [Trivy 官方文档](https://aquasecurity.github.io/trivy/)
- [CIS Benchmarks 安全基线指南](https://www.cisecurity.org/cis-benchmarks/)\n