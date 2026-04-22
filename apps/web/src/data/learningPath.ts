export interface LearningPhase {
  id: string;
  name: string;
  duration: string;
  techIds: string[];
  prerequisites: string[];
}

export const learningPath: LearningPhase[] = [
  {
    id: 'phase-1',
    name: '第一层：网络隐匿与访问控制',
    duration: '2-3周',
    techIds: ['multi-hop-proxy', 'zero-trust-network'],
    prerequisites: []
  },
  {
    id: 'phase-2',
    name: '第二层：威胁检测与响应',
    duration: '3-4周',
    techIds: ['waf'],
    prerequisites: ['phase-1']
  },
  {
    id: 'phase-3',
    name: '第三层：应用与端点安全',
    duration: '2-4周',
    techIds: ['edr'],
    prerequisites: ['phase-2']
  }
];
