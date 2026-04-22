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
  path?: string;
  icon?: string; // 预留：用于富文本渲染的图标字段，例如 base64, url 或 unicode
}

export interface TechNode {
  id?: string;
  name: string;
  value?: string;
  categoryId?: string;
  itemStyle?: { color: string };
  symbolSize?: number;
  icon?: string; // 传递给 ECharts 节点的图标
  children?: TechNode[];
}
