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
