import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';

export type SkillState = 'IDLE' | 'PREPARING' | 'EXECUTING' | 'ANALYZING' | 'CLEANING' | 'COMPLETED' | 'FAILED';

export interface SkillOptions {
  skillId: string;
  simulationsDir: string;
  projectName?: string;
  env?: Record<string, string>; // 支持动态环境变量注入
}

export class SkillRunner extends EventEmitter {
  private state: SkillState = 'IDLE';
  private skillDir: string;
  private projectName: string;
  private abortController: AbortController | null = null;

  constructor(private options: SkillOptions) {
    super();
    this.skillDir = path.join(this.options.simulationsDir, this.options.skillId);
    // Use a unique project name to avoid docker-compose conflicts if multiple instances run
    this.projectName = this.options.projectName || `kforge_${this.options.skillId}_${Date.now()}`;
  }

  private updateState(newState: SkillState) {
    this.state = newState;
    this.emit('state', newState);
  }

  public getState(): SkillState {
    return this.state;
  }

  /**
   * Execute a shell command and stream its output via events.
   */
  private async runCommand(command: string, args: string[], abortSignal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      this.emit('log', `\n> ${command} ${args.join(' ')}\n`);
      
      const proc = spawn(command, args, {
        cwd: this.skillDir,
        shell: true,
        signal: abortSignal,
        env: {
          ...process.env,
          ...this.options.env, // 注入动态变量 (例如 PUBLIC_PORT, TARGET_HOST)
        }
      });

      proc.stdout.on('data', (data) => {
        this.emit('log', data.toString());
      });

      proc.stderr.on('data', (data) => {
        // docker-compose often writes to stderr even for non-errors
        this.emit('log', data.toString());
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Main entry point to orchestrate the skill execution lifecycle.
   */
  public async execute(): Promise<void> {
    if (this.state !== 'IDLE' && this.state !== 'FAILED' && this.state !== 'COMPLETED') {
      throw new Error(`Cannot execute skill in state: ${this.state}`);
    }

    if (!fs.existsSync(this.skillDir)) {
      throw new Error(`Skill directory not found: ${this.skillDir}`);
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      // 1. PREPARING (docker-compose up)
      this.updateState('PREPARING');
      this.emit('log', `[PREPARING] Starting isolated environment for ${this.options.skillId}...\n`);
      await this.runCommand('docker-compose', ['-p', this.projectName, 'up', '-d'], signal);

      // Give containers a moment to fully initialize
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 2. EXECUTING (attack.sh or main script)
      this.updateState('EXECUTING');
      this.emit('log', `[EXECUTING] Applying defensive skill/configuration...\n`);
      if (fs.existsSync(path.join(this.skillDir, 'attack.sh'))) {
         await this.runCommand('docker', ['exec', `${this.projectName}-attacker-1`, './attack.sh'], signal).catch(() => {
             // Fallback to default container naming if explicit names weren't set
             return this.runCommand('docker-compose', ['-p', this.projectName, 'exec', '-T', 'attacker', './attack.sh'], signal);
         });
      }

      // 3. ANALYZING (detect.sh or verification script)
      this.updateState('ANALYZING');
      this.emit('log', `[ANALYZING] Verifying skill deployment...\n`);
      if (fs.existsSync(path.join(this.skillDir, 'detect.sh'))) {
         await this.runCommand('docker-compose', ['-p', this.projectName, 'exec', '-T', 'detector', './detect.sh'], signal).catch(e => {
             this.emit('log', `[WARNING] Analysis script failed: ${e.message}\n`);
         });
      }

      this.updateState('COMPLETED');
      this.emit('log', `\n[COMPLETED] Skill ${this.options.skillId} successfully deployed!\n`);

    } catch (error: any) {
      this.updateState('FAILED');
      this.emit('error', error);
      this.emit('log', `\n[FAILED] ${error.message}\n`);
      throw error;
    }
  }

  /**
   * Stop the skill and tear down the environment.
   */
  public async teardown(): Promise<void> {
    this.updateState('CLEANING');
    this.emit('log', `[CLEANING] Tearing down environment for ${this.options.skillId}...\n`);
    
    if (this.abortController) {
      this.abortController.abort();
    }

    try {
      await this.runCommand('docker-compose', ['-p', this.projectName, 'down', '-v']);
      this.updateState('IDLE');
      this.emit('log', `[CLEANING] Teardown complete.\n`);
    } catch (error: any) {
      this.updateState('FAILED');
      this.emit('error', error);
      throw error;
    }
  }
}
