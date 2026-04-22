import { traeSoloTechItems } from './categories/ai-dev-tools/trae-solo';

export interface TechItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  coreFunction: string;
  defenseMechanism: string;
  vulnerabilities: string;
  principle: string;
  tools: string[];
  practiceSteps: string[];
  resources: Array<{ title: string; url: string }>;
  difficulty: 'low' | 'medium' | 'high';
  tags: string[];
  relatedTechIds: string[];
  createdAt: string;
  updatedAt: string;
  path?: string; // 增加 path 字段
}

// 静态数据被自动生成的数据合并/替换
import { generatedTechItems } from './techItems.generated';

// 为了防止数据丢失，我们可以将原有的写死数据（如果有的话）与新生成的结合
// 或者按照用户的意图直接替换为生成的：
export const techItems: TechItem[] = [...generatedTechItems, ...traeSoloTechItems];
