import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIMS_DIR = path.join(__dirname, '../simulations');
const OUTPUT_FILE = path.join(__dirname, '../src/data/simulations.generated.ts');

function parseScenario(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  const id = path.basename(path.dirname(filePath));
  return {
    id,
    title: data.title || id,
    category: data.category || '攻防模拟',
    tags: data.tags || [],
    difficulty: data.difficulty || '中级',
    estimatedTime: data.estimated_time || '5分钟',
    description: data.summary || '',
    commands: {
      start: `cd simulations/${id} && docker-compose up -d`,
      attack: `cd simulations/${id} && docker exec attacker ./attack.sh`,
      detect: `cd simulations/${id} && docker exec detector ./detect.sh`,
      stop: `cd simulations/${id} && docker-compose down`,
    }
  };
}

function main() {
  if (!fs.existsSync(SIMS_DIR)) {
    console.warn('⚠️ simulations 目录不存在');
    return;
  }

  const simDirs = fs.readdirSync(SIMS_DIR).filter(f => {
    const full = path.join(SIMS_DIR, f);
    return fs.statSync(full).isDirectory() && !f.startsWith('.');
  });

  const simulations = [];
  simDirs.forEach(dir => {
    // 过滤掉 template
    if (dir === 'template') return;
    const scenarioPath = path.join(SIMS_DIR, dir, 'scenario.md');
    if (fs.existsSync(scenarioPath)) {
      try {
        simulations.push(parseScenario(scenarioPath));
      } catch (e) {
        console.error(`解析失败: ${scenarioPath}`, e);
      }
    }
  });

  const tsContent = `// 自动生成，请勿手动修改
export interface Simulation {
  id: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: string;
  estimatedTime: string;
  description: string;
  commands: {
    start: string;
    attack: string;
    detect: string;
    stop: string;
  };
}

export const simulations: Simulation[] = ${JSON.stringify(simulations, null, 2)};
`;
  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`✅ 生成 ${simulations.length} 个模拟场景`);
}

main();
