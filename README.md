<div align="center">
  <img src="./apps/admin/public/logo.svg" alt="KForge Logo" width="300"/>
  <br/>
  <h1>KForge 全球安全防御网络 (Global Defense Network)</h1>
  <p><b>面向 Web3 原生的零信任架构与插件化安全 SaaS 平台</b></p>
  <p>
    <img src="https://img.shields.io/badge/architecture-Monorepo-blue" alt="Architecture"/>
    <img src="https://img.shields.io/badge/blockchain-TRON_Smart_Contract-red" alt="Blockchain"/>
    <img src="https://img.shields.io/badge/stack-Next.js%20%7C%20React%20%7C%20Node.js-black" alt="Tech Stack"/>
    <img src="https://img.shields.io/badge/deployment-100%25_Self--Hosted-green" alt="Deployment"/>
  </p>
</div>

---

## 🚀 什么是 KForge？

KForge 是一个将企业级网络安全能力（DDoS 清洗、WAF、单包授权隐身、欺骗防御）高度抽象为**可视化积木**的 Web3 商业化安全基座。

不同于传统卖“单品软件”的安全工具，KForge 采用**“零信任身份认证 + 平台化会员生态” (Identity-Based Platform)**。客户通过 H5 营销页使用 **USDT-TRC20** 支付订阅费，即可获取通行证 Token。通过配套的 CLI 工具，客户只需一行代码，即可在全球任意服务器上拉起企业级防护盾牌。

---

## ⚔️ 核心安全护城河 (Weapon Arsenal)

KForge 底层核心引擎通过 Docker 容器化封装了多种实战级防御插件（位于 `simulations/` 目录）：

1. 🛡️ **DDoS 与 IP 隐匿盾 (`ddos-ip-shield`)**: Nginx/OpenResty 驱动，智能限流，彻底隐匿源站真实 IP，防止黑客扫段探测。
2. 🧱 **WAF 应用防火墙 (`waf-shield`)**: 搭载 OWASP 核心规则集 (CRS)，深度清洗七层流量，瞬间拦截 SQL 注入与 XSS 攻击。
3. 🔑 **SPA 单包隐身网关 (`port-knocking-spa`)**: 真正的零信任防御，默认关闭核心端口（Nmap 无法扫出）。仅允许持有 HMAC 加密签名的敲门包开启限时通道，免疫 0-day 漏洞。
4. 🐞 **高交互欺骗蜜罐 (`deception-honeypot`)**: Cowrie 驱动的高交互沙箱，伪装高价值资产，100% “登录成功”诱导攻击者深入，实时截获木马样本与 TTPs 情报。

---

## 🏗️ 架构概览 (Monorepo Structure)

本项目采用 `pnpm/npm workspaces` 的 Monorepo 架构，实现从前端变现到后端防御的完美解耦：

```text
/workspace
├── apps/                        # 业务应用层
│   ├── admin/                   # [React Flow] 可视化管理台 (编排画布 + 实时攻防大屏)
│   └── h5-builder/              # [Next.js] 移动端营销售卖页 (集成 Web3 USDT 收款码)
├── packages/                    # 核心依赖与协议层
│   ├── core/                    # SDK 引擎：控制 Docker 容器与宿主机环境交互
│   ├── daemon/                  # API 网关：TRON 区块链监听、Prisma 持久化、Token 鉴权
│   ├── cli/                     # 开发者工具：混淆打包后的命令行工具，供客户一键部署
│   ├── contracts/               # 智能合约：Solidity 编写的 KForgeMembership 订阅合约
│   └── shared-schema/           # 共享协议层：定义全局会员拓扑 JSON DSL
├── simulations/                 # [核心弹药库] 真实防御插件的 Docker 编排与验证脚本
├── docker-compose.prod.yml      # 100% 去中心化、私有化生产部署配置
└── .github/workflows/           # CI/CD 流水线：自动构建 CLI、混淆防破解并发布镜像
```

---

## ⚡ 核心功能特性

### 1. 积木式防御编排 (Visual Canvas)
- 管理员可在 Admin 面板拖拽 `WAF`、`SPA` 等节点，连线定义流量拓扑，并配置对外暴露端口。
- 拓扑结构自动编译为 `KForgeMembershipDSL` 标准 JSON，并持久化到 Postgres 数据库。

### 2. 黑客帝国级态势大屏 (Live Attack Map)
- 客户通过 CLI 拉起的防御节点遭到攻击时，日志会通过 WebSocket 实时回传至 Admin 管理台。
- 呈现极具视觉冲击力的全球攻击阻断动画，是 ToB 销售与融资路演的最强武器。

### 3. Web3 自动收款与发卡闭环 (Crypto Checkout)
- **H5 营销页**：Next.js SSR 渲染的高转化落地页，提供极客风格的 TRC20 收款二维码。
- **TRON 监听**：后端 Daemon 轮询波场公链/本地全节点。一旦确认到账，数据库自动开通 `Enterprise` 订阅并下发 AccessToken。
- **智能合约**：内置 Solidity 合约，支持去中心化订阅与 CEO 一键利润提现。

### 4. 工业级 CLI 客户端 (Developer Experience)
- 客户拿到 Token 后，只需在自己服务器执行：`kforge protect --token=kf_live_xxx --skill=waf-shield --port=80`。
- **防破解混淆**：基于 `esbuild` 打包混淆，防止白嫖。
- **自动重连与配额校验**：内置指数退避重试，连接 Daemon 校验并发节点额度。

---

## 🛠️ 本地开发指南 (Local Development)

### 1. 环境准备
- Node.js >= 18
- Docker & Docker Compose
- Npm 或 Pnpm

### 2. 安装与初始化
```bash
# 安装 Monorepo 全局依赖
npm install

# 初始化 Prisma 本地数据库 (SQLite)
cd packages/daemon
npx prisma generate
npx prisma db push
```

### 3. 启动本地服务
在根目录下分别启动不同的终端运行：
```bash
npm run dev:daemon   # 启动后端 API (监听 4000)
npm run dev:admin    # 启动可视化画布与态势大屏
npm run dev:h5       # 启动 H5 营销售卖落地页
```

### 4. 编译与体验 CLI 工具
```bash
npm run build --workspace=@kforge/cli
# 模拟执行部署
node packages/cli/dist/index.js protect --token=kf_live_test --skill=waf-shield --port=8080
```

---

## 🚢 生产部署 (Production Deployment)

项目已提供 **100% 私有化去中心化部署方案**，无需依赖 TronGrid 等第三方商业 API。

1. **构建前端静态资源**：
   ```bash
   npm run build:h5
   npm run build:admin
   ```
2. **拉起生产环境容器组** (包含 Postgres, Daemon API 和 Nginx 网关)：
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
> *注：Daemon 默认配置了去中心化的波场公共 RPC 节点池进行故障转移。如有更高性能需求，可在 compose 中增加 `java-tron` 节点实现完全自托管。*

---

<div align="center">
  <b>Built for the 2026 Web3 Security Landscape.</b><br/>
  &copy; KForge Global Defense Network
</div>
