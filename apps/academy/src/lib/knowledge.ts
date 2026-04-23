import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 指向 monorepo 根目录的 docs/knowledge-base
const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), '../../docs/knowledge-base');

export interface TechNode {
  id: string;
  title: string;
  category: string;
  slug: string;
  hasSaaSPlugin: boolean; // 是否已有对应的防御插件 (引导转化)
}

export interface TechCategory {
  name: string;
  label: string;
  nodes: TechNode[];
}

// 预定义类别映射
const CATEGORY_MAP: Record<string, string> = {
  'concealment-access': 'Shield 网络隐匿与访问控制',
  'network-app-defense': 'Activity 威胁检测与响应',
  'host-system-defense': 'Lock 数据保护与隐私',
  'cloud-native-security': 'Cloud 云原生安全',
  'emerging-defense': 'Future 新兴防御理念'
};

// 预定义已经实现 SaaS 商业化插件的知识点，用于在树上高亮显示
const SAAS_READY_SLUGS = [
  'ddos-mitigation', // DDoS 隐匿盾
  'waf',             // WAF
  'port-knocking-spa', // SPA 单包授权
  'deception-defense'  // 高交互蜜罐
];

export function getTechTree(): TechCategory[] {
  const categories: TechCategory[] = [];
  
  if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
    return categories;
  }

  const dirs = fs.readdirSync(KNOWLEDGE_BASE_DIR, { withFileTypes: true });

  dirs.forEach(dir => {
    if (dir.isDirectory() && CATEGORY_MAP[dir.name]) {
      const categoryPath = path.join(KNOWLEDGE_BASE_DIR, dir.name);
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));
      
      const nodes: TechNode[] = files.map(file => {
        const filePath = path.join(categoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        // 尝试从 Markdown 第一行提取标题，如果没有则使用文件名
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const fallbackTitle = file.replace('.md', '').replace(/-/g, ' ');
        const title = data.title || (titleMatch ? titleMatch[1] : fallbackTitle);
        const slug = file.replace('.md', '');

        return {
          id: `${dir.name}-${slug}`,
          title,
          category: dir.name,
          slug,
          hasSaaSPlugin: SAAS_READY_SLUGS.includes(slug)
        };
      });

      categories.push({
        name: dir.name,
        label: CATEGORY_MAP[dir.name],
        nodes
      });
    }
  });

  return categories;
}

export function getArticleContent(category: string, slug: string) {
  const filePath = path.join(KNOWLEDGE_BASE_DIR, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    title: data.title || slug.replace(/-/g, ' '),
    content,
    hasSaaSPlugin: SAAS_READY_SLUGS.includes(slug)
  };
}
