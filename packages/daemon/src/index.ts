import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import { SkillRunner } from '@kforge/core';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/api/ws' });

// In-memory store for active skill runners
const activeSkills = new Map<string, SkillRunner>();

const SIMULATIONS_DIR = path.join(__dirname, '../../../simulations');

// =============== 🔥 火焰一：Web3 TRON 链上监听服务 ===============
// 模拟监听波场网络上某个钱包地址的收款记录
// 在实际生产中，这里会定时请求 https://api.trongrid.io/v1/accounts/{address}/transactions/trc20
app.get('/api/payment/verify', async (req, res) => {
  const { wallet, amount } = req.query;
  
  if (!wallet || !amount) {
    return res.status(400).json({ error: 'Missing wallet address or amount' });
  }

  // 随机延迟模拟区块链网络确认时间 (1-3秒)
  const delay = Math.floor(Math.random() * 2000) + 1000;
  
  setTimeout(() => {
    // 模拟：有 80% 的概率查到了这笔交易并确认成功
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      // 生成一个专属的接入 Token
      const accessToken = `kf_live_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      res.json({
        status: 'success',
        message: 'Transaction confirmed on TRON network.',
        data: {
          accessToken,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`
        }
      });
    } else {
      res.json({
        status: 'pending',
        message: 'Transaction not found or waiting for block confirmation.'
      });
    }
  }, delay);
});
// =================================================================

// API to trigger a skill
app.post('/api/skills/:skillId/execute', async (req, res) => {
  const { skillId } = req.params;

  if (activeSkills.has(skillId)) {
    return res.status(400).json({ error: 'Skill is already running' });
  }

  try {
    const runner = new SkillRunner({
      skillId,
      simulationsDir: SIMULATIONS_DIR,
    });

    activeSkills.set(skillId, runner);

    // Broadcast logs to all connected WebSocket clients
    runner.on('log', (log) => {
      wss.clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(JSON.stringify({ type: 'log', skillId, log }));
        }
      });
    });

    runner.on('state', (state) => {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'state', skillId, state }));
        }
      });
    });

    // Start async execution
    runner.execute().finally(() => {
      // Don't remove immediately if we want to allow querying status later
      // activeSkills.delete(skillId);
    });

    res.json({ message: 'Skill execution started', skillId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API to stop a skill
app.post('/api/skills/:skillId/stop', async (req, res) => {
  const { skillId } = req.params;
  const runner = activeSkills.get(skillId);

  if (!runner) {
    return res.status(404).json({ error: 'Skill is not running' });
  }

  try {
    await runner.teardown();
    activeSkills.delete(skillId);
    res.json({ message: 'Skill stopped and environment cleaned up' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 KForge Daemon running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server listening on ws://localhost:${PORT}/api/ws`);
});
