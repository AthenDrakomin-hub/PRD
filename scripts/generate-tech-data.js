import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要扫描的目录（相对于项目根目录）
const SCAN_DIRS = ['docs', '02_网络隐匿'];

// 生成前端数据文件的目标路径
const OUTPUT_FILE = path.join(__dirname, '../src/data/techItems.generated.ts');

/**
 * 递归扫描目录，返回所有 .md 文件路径
 */
function findMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findMarkdownFiles(filePath));
    } else if (file.endsWith('.md') && file !== 'README.md') {
      // 过滤掉根目录和分类下的 README.md，如果需要保留可以去掉 && file !== 'README.md'
      // 仔细看用户的原本逻辑，并未过滤，但一般 README 只是介绍
      // 暂时不过滤，按用户代码实现
      results.push(filePath);
    }
  });
  return results;
}

/**
 * 解析单个 Markdown 文件，提取需要的字段
 */
function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  const data = parsed.data || {};
  const body = parsed.content || '';

  // 生成一个唯一 ID，用于前端路由
  const id = path.basename(filePath, '.md').toLowerCase().replace(/\s+/g, '-');
  // 默认分类，如果未指定则用目录名推断
  const rawCategory = data.category || path.basename(path.dirname(filePath));

  // 建立分类映射字典，将中文名或非标准目录名映射到 categories.ts 中定义的 ID
  const categoryMap = {
    '网络隐匿': 'network-concealment',
    'concealment-access': 'network-concealment',
    '02_网络隐匿': 'network-concealment',
    '威胁检测': 'threat-detection',
    '数据保护': 'data-protection',
    '应用安全': 'app-security',
    '云原生安全': 'app-security', // 临时映射到相近分类
    'host-system-defense': 'app-security',
    'network-app-defense': 'app-security',
    'emerging-defense': 'app-security',
    '项目管理': 'app-security', // 如 STRATEGY.md 临时放置
    'ai-dev-tools': 'ai-dev-tools',
    'trae-solo': 'ai-dev-tools',
  };

  const categoryId = categoryMap[rawCategory] || 'app-security'; // 默认映射到 app-security 避免丢失

  // 智能提取标题：如果 frontmatter 中没有，则找第一个 # 号标题
  let title = data.title;
  if (!title) {
    const titleMatch = body.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');
  }

  // 智能提取描述：如果 frontmatter 中没有，则尝试找 ## 核心作用 或者是第一段正文
  let description = data.summary;
  if (!description) {
    const coreMatch = body.match(/## 核心作用\s+([\s\S]*?)(?=##|$)/);
    if (coreMatch) {
      description = coreMatch[1].replace(/[\r\n]+/g, ' ').trim();
    } else {
      const firstParaMatch = body.replace(/^#.*$/gm, '').trim().split('\n')[0];
      description = firstParaMatch ? firstParaMatch.trim() : '';
    }
  }

  // 保留相对路径以便前端 fetch
  const relativePath = path.relative(path.join(__dirname, '..'), filePath).split(path.sep).join('/');

  return {
    id,
    name: title,
    categoryId: categoryId,
    tags: data.tags || [],
    description: description,
    difficulty: data.skill_level === '专家' ? 'high' : (data.skill_level === '进阶' ? 'medium' : 'low'),
    path: relativePath, // 保留原始相对路径，后续用于渲染
    // 下面为了兼容原有界面，提供默认值
    coreFunction: '详情请查看内部文档',
    defenseMechanism: '详情请查看内部文档',
    vulnerabilities: '详情请查看内部文档',
    principle: '加载中...',
    tools: [],
    practiceSteps: [],
    resources: [],
    relatedTechIds: [],
    createdAt: data.created ? new Date(data.created).toISOString() : new Date().toISOString(),
    updatedAt: data.updated ? new Date(data.updated).toISOString() : new Date().toISOString()
  };
}

function main() {
  const allTechItems = [];

  SCAN_DIRS.forEach(dir => {
    const fullDir = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullDir)) {
      console.warn(`⚠️ 目录不存在，跳过: ${fullDir}`);
      return;
    }
    const mdFiles = findMarkdownFiles(fullDir);
    mdFiles.forEach(file => {
      // 过滤一下模板
      if (file.endsWith('TEMPLATE.md') || file.endsWith('TAGS.md') || file.endsWith('INBOX.md')) {
        return;
      }
      try {
        const item = parseMarkdown(file);
        allTechItems.push(item);
      } catch (err) {
        console.error(`❌ 解析失败: ${file}`, err.message);
      }
    });
  });

  // 生成 TypeScript 文件
  const tsContent = `// 该文件由脚本自动生成，请勿手动修改
// 生成时间: ${new Date().toISOString()}
import { TechItem } from './techItems';

export const generatedTechItems: TechItem[] = ${JSON.stringify(allTechItems, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
  
  // 顺便生成一份 JSON 供 node 脚本读取
  const jsonPath = path.join(__dirname, '../src/data/techItems.generated.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allTechItems, null, 2), 'utf8');

  console.log(`✅ 已生成 ${allTechItems.length} 条技术项，写入 ${OUTPUT_FILE}`);
}

main();
