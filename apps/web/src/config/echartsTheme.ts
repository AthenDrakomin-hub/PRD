import { TechStatus } from '../store/useStore';

export const echartsTheme = {
  colors: {
    root: '#F59E0B',     // 根节点颜色 (Amber)
    category: '#3B82F6', // 分类节点颜色 (Blue)
    status: {
      not_started: '#4B5563', // 未开始 (Gray)
      in_progress: '#00E5FF', // 进行中 (Cyber Accent)
      completed: '#10B981',   // 已完成 (Green)
    },
    text: {
      primary: '#D1D5DB',     // 主要文字
      highlight: '#00E5FF',   // 高亮文字
    },
    background: {
      tooltip: '#161B22',     // Tooltip 背景
    },
    border: {
      tooltip: '#30363D',     // Tooltip 边框
      line: '#30363D',        // 连接线颜色
    }
  },
  sizes: {
    root: 20,
    category: 15,
    tech: 10,
  }
};

/**
 * 根据技术点的学习状态获取节点颜色样式
 */
export const getTechNodeStyle = (status?: TechStatus) => {
  const color = status ? echartsTheme.colors.status[status] : echartsTheme.colors.status.not_started;
  return { color };
};

/**
 * 格式化 Tooltip，使其不再在组件内部硬编码 HTML
 */
export const tooltipFormatter = (params: any) => {
  if (params.data.value) {
    return `
      <div style="padding: 4px">
        <strong style="color: ${echartsTheme.colors.text.highlight}">${params.data.name}</strong><br/>
        <div style="max-width: 300px; white-space: normal; margin-top: 4px;">${params.data.value}</div>
      </div>
    `;
  }
  return params.data.name.replace(/\n/g, '');
};

/**
 * 导出预配置好的 ECharts 通用选项
 */
export const baseEchartsOption = {
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    backgroundColor: echartsTheme.colors.background.tooltip,
    borderColor: echartsTheme.colors.border.tooltip,
    textStyle: { color: echartsTheme.colors.text.primary },
    formatter: tooltipFormatter
  },
  lineStyle: {
    color: echartsTheme.colors.border.line,
    curveness: 0.5,
    width: 2
  }
};
