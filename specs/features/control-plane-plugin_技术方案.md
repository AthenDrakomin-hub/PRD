### 1. 数据库设计

#### 表结构 (Prisma Schema 补充)
```prisma
// packages/daemon/prisma/schema.prisma 补充

model DefenseConfig {
  id                 String   @id @default(uuid())
  tenantId           String   @unique // 关联到具体的租户/项目
  edgeMode           String   @default("cdn") // cdn, self-hosted, disabled
  whitelistIps       String   // JSON 数组，存储允许回源的边缘 IP
  portMappings       String   // JSON 对象，存储边缘到源站的端口映射
  wafEnabled         Boolean  @default(true)
  
  // 熔断状态开关
  readOnlyMode       Boolean  @default(false)
  disableRegistration Boolean @default(false)
  limitUploads       Boolean  @default(false)
  rateLimitLevel     String   @default("low") // low, medium, high
  
  updatedAt          DateTime @updatedAt
  createdAt          DateTime @default(now())

  tenant             Tenant   @relation(fields: [tenantId], references: [id])
}
```

#### 字段说明
| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | UUID | 主键 | NOT NULL |
| tenantId | String | 租户ID | 外键，唯一 (1对1) |
| edgeMode | String | 边缘模式 | 默认为 'cdn' |
| whitelistIps | JSON | 白名单 IP 数组 | 供防火墙拉取更新 |
| portMappings | JSON | 端口映射关系 | 供网关拉取渲染路由 |
| wafEnabled | Boolean | WAF 开关 | |
| readOnlyMode | Boolean | 全站只读熔断开关 | |
| disableRegistration | Boolean | 停止注册熔断开关 | |

---

### 2. API 接口设计 (控制面)

所有接口统一挂载在 KForge Daemon (`packages/daemon`) 中。

#### 2.1 获取当前防御配置 (GET /api/defense/config)
**功能**：外部控制器（如 Ansible, 自建边缘 Nginx 配置拉取脚本）定时拉取最新配置。
**权限**：需要通过携带 Token 验证 (或 API Key)。

**响应示例**：
```json
{
  "success": true,
  "data": {
    "tenantId": "tenant-123",
    "edgeMode": "self-hosted",
    "whitelistIps": ["192.168.1.100", "203.0.113.50", "cloudflare-ips"],
    "portMappings": {
      "80": "8080",
      "443": "8443",
      "11000": "11000" // LiveKit
    },
    "wafEnabled": true,
    "circuitBreaker": {
      "readOnlyMode": false,
      "disableRegistration": true,
      "limitUploads": true,
      "rateLimitLevel": "high"
    },
    "updatedAt": "2026-04-23T10:00:00Z"
  }
}
```

#### 2.2 更新防御策略与熔断状态 (PUT /api/defense/config)
**功能**：管理员在后台控制台（Admin）修改策略，或监控报警系统触发 Webhook 修改熔断状态。
**权限**：严格的 Admin 权限。

**请求体示例 (支持部分更新)**：
```json
{
  "circuitBreaker": {
    "readOnlyMode": true,
    "rateLimitLevel": "high"
  }
}
```
**响应**：返回更新后的配置，并触发事件。

---

### 3. 核心逻辑与解耦设计 (Decoupled Architecture)

#### 3.1 状态更新与事件推送流程
```text
Admin 面板操作 / 异常流量检测器报警
    ↓
发送 PUT /api/defense/config 更新配置
    ↓
Daemon 验证权限并写入 PostgreSQL (DefenseConfig 表)
    ↓
【解耦核心】Daemon 不执行 bash 脚本，而是触发 WebSocket 广播 或 Webhook
    ↓
边缘节点的 Agent / 运维巡检脚本 收到通知 (或定时 GET)
    ↓
Agent 拉取 JSON 配置 -> 渲染出 `nginx.conf` 和 `iptables-restore` 规则 -> 重启服务
```

#### 3.2 业务系统如何响应熔断？
- 源站真实的业务系统（如用户的博客、商城）通过引入一个轻量级的 SDK，定期或通过 Redis 订阅 `readOnlyMode` 等状态。
- 如果检测到 `readOnlyMode === true`，业务系统在执行 `INSERT/UPDATE` SQL 前直接抛出拦截异常："System is under heavy load, read-only mode activated."，实现应用层自保。

---

### 4. 方案对比与推荐

#### 配置下发给基础设施的方式

**方案 A：插件内嵌 SSH / Ansible 执行 (Push)**
- 优点：实时性最高。
- 缺点：违背了用户提出的“插件不应该直接改 nginx”原则。插件需要保存目标机器的高权限凭证，安全风险极高；强耦合。

**方案 B：基于声明式 API 的拉取/事件通知模型 (Pull / Pub-Sub)**
- 优点：**完美契合用户设计理念**。控制面插件只负责维护“期望状态” (State)，外部控制器 (Operator/Agent) 负责将其“调谐” (Reconcile) 到基础设施。极度安全，边缘节点只读不写。
- 缺点：外部需要配合写一个简单的 Python/Bash 拉取脚本。

**推荐**：采用 **方案 B**。这是 Kubernetes Operator 模式的核心思想，也是现代云原生网络控制面（如 Istio / Cilium）的标准做法。它不仅保护了 KForge 插件的安全性，还极大地提升了小玩家部署的灵活性。

---

### 5. 验收标准映射

| 验收标准 | 技术实现 | API 接口 |
|---------|---------|--------|
| AC-01: 外部脚本获取配置 | 返回 JSON 格式的 IP/Port | `GET /api/defense/config` |
| AC-02: 安全更新配置 | 鉴权中间件 (JWT) | `PUT /api/defense/config` |
| AC-03: 触发熔断状态 | 存入 DB `circuitBreaker` 字段 | `PUT /api/defense/config` |
| AC-04: 解耦性约束 | 纯 REST API，无底层命令执行 | 架构设计保证 |
