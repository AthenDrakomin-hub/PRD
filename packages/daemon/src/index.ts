import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import { SkillRunner } from '@kforge/core';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/api/ws' });

// Initialize Prisma Database Client
const prisma = new PrismaClient();

const activeSkills = new Map<string, SkillRunner>();
const SIMULATIONS_DIR = path.join(__dirname, '../../../simulations');

// =================================================================
// 🔥 平台级 API: 保存从 Admin 画布传来的防御拓扑 (PlatformConfig)
// =================================================================
app.post('/api/admin/config', async (req, res) => {
  try {
    const configData = req.body;
    
    // 我们在这里简化处理：总是只保留一份最新的“全局”防御配置
    // 实际生产中，可以针对不同租户或版本保存多份
    await prisma.platformConfig.deleteMany(); 
    const savedConfig = await prisma.platformConfig.create({
      data: {
        configJson: JSON.stringify(configData),
        version: configData.version || '1.0.0'
      }
    });

    res.json({ message: 'Platform topology config saved successfully', data: savedConfig });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =================================================================
// 🔥 客户级 API: TRON 监听模拟 & Token 发放 (持久化至数据库)
// =================================================================
app.get('/api/payment/verify', async (req, res) => {
  const { wallet, amount } = req.query;
  
  if (!wallet || !amount) {
    return res.status(400).json({ error: 'Missing wallet address or amount' });
  }

  // 模拟区块链网络确认时间
  setTimeout(async () => {
    const isSuccess = Math.random() > 0.2; // 80% 确认成功
    
    if (isSuccess) {
      try {
        // 1. 确保 Tenant 存在
        let tenant = await prisma.tenant.findUnique({ where: { wallet: String(wallet) } });
        if (!tenant) {
          tenant = await prisma.tenant.create({ data: { wallet: String(wallet) } });
        }

        // 2. 生成 AccessToken 并分配对应的会员额度
        const accessToken = `kf_live_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
        
        // 假设付款金额大于 100 USDT 自动升级为 Enterprise (50节点)，否则为 Pro (5节点)
        const tier = Number(amount) >= 100 ? 'Enterprise' : 'Pro';
        const maxNodes = tier === 'Enterprise' ? 50 : 5;
        
        // 创建或更新 Subscription
        const sub = await prisma.subscription.upsert({
          where: { tenantId: tenant.id },
          update: {
            accessToken,
            tier,
            maxActiveNodes: maxNodes,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后过期
          },
          create: {
            tenantId: tenant.id,
            accessToken,
            tier,
            maxActiveNodes: maxNodes,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });

        res.json({
          status: 'success',
          message: 'Transaction confirmed. Subscription activated.',
          data: {
            accessToken: sub.accessToken,
            tier: sub.tier,
            maxActiveNodes: sub.maxActiveNodes
          }
        });
      } catch (dbError: any) {
        res.status(500).json({ error: 'Database error: ' + dbError.message });
      }
    } else {
      res.json({ status: 'pending', message: 'Waiting for block confirmation...' });
    }
  }, 1500);
});

// =================================================================
// 🔥 节点拉起 API: 带鉴权与配额限制的执行入口 (CLI 调用)
// =================================================================
app.post('/api/skills/:skillId/execute', async (req, res) => {
  const { skillId } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing Access Token' });
  }

  try {
    // 1. 验证 Token 是否合法且未过期
    const subscription = await prisma.subscription.findUnique({
      where: { accessToken: token },
      include: { tenant: { include: { activeNodes: true } } }
    });

    if (!subscription || subscription.status !== 'ACTIVE' || subscription.expiresAt < new Date()) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired subscription token' });
    }

    // 2. 验证并发配额
    const currentActiveCount = subscription.tenant.activeNodes.filter(n => n.status === 'RUNNING').length;
    if (currentActiveCount >= subscription.maxActiveNodes) {
      return res.status(429).json({ 
        error: `Rate Limit Exceeded: Your ${subscription.tier} plan only allows ${subscription.maxActiveNodes} active nodes.` 
      });
    }

    if (activeSkills.has(skillId)) {
      return res.status(400).json({ error: 'This skill is already running locally' });
    }

    // 3. 准备执行环境参数 (从请求体中接收 CLI 传来的端口配置)
    const envConfig = req.body.env || {};
    
    const runner = new SkillRunner({
      skillId,
      simulationsDir: SIMULATIONS_DIR,
      env: envConfig
    });

    activeSkills.set(skillId, runner);

    // 4. 记录到数据库
    const dbNode = await prisma.activeNode.create({
      data: {
        tenantId: subscription.tenant.id,
        skillId,
        publicPort: envConfig.PUBLIC_PORT || 'unknown',
        targetHost: envConfig.TARGET_HOST || 'unknown',
        status: 'RUNNING'
      }
    });

    // 广播日志
    runner.on('log', (log) => {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'log', skillId, log }));
        }
      });
    });

    runner.on('state', async (state) => {
      // 当节点停止或失败时，更新数据库状态释放配额
      if (state === 'CLEANING' || state === 'FAILED' || state === 'IDLE') {
         await prisma.activeNode.update({
           where: { id: dbNode.id },
           data: { status: state === 'FAILED' ? 'FAILED' : 'STOPPED' }
         }).catch(console.error);
      }
    });

    // 异步执行
    runner.execute().catch(console.error);

    res.json({ message: 'Skill deployed successfully', skillId, dbNodeId: dbNode.id });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ... 省略原先的 stop API
app.post('/api/skills/:skillId/stop', async (req, res) => {
    // ... 简单实现即可，真实环境同样需要鉴权并更新数据库状态
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 KForge Daemon running on http://localhost:${PORT}`);
});
