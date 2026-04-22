import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { categories, techItems } from '../../data';

export const TechTree: React.FC = () => {
  const treeData = useMemo(() => {
    return {
      name: '网络安全\n防御体系',
      itemStyle: { color: '#F59E0B' }, // 金色
      symbolSize: 20,
      children: categories.map((cat) => ({
        name: cat.name.replace(/(.{6})/g, '$1\n'), // 自动换行
        itemStyle: { color: '#3B82F6' }, // 蓝色
        symbolSize: 15,
        children: techItems
          .filter((tech) => tech.categoryId === cat.id)
          .map((tech) => ({
            name: tech.name,
            itemStyle: { color: '#10B981' }, // 绿色
            symbolSize: 10,
            value: tech.description,
          })),
      })),
    };
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: '#161B22',
      borderColor: '#30363D',
      textStyle: { color: '#D1D5DB' },
      formatter: (params: any) => {
        if (params.data.value) {
          return `
            <div style="padding: 4px">
              <strong style="color: #00E5FF">${params.data.name}</strong><br/>
              <div style="max-width: 300px; white-space: normal; margin-top: 4px;">${params.data.value}</div>
            </div>
          `;
        }
        return params.data.name.replace(/\n/g, '');
      }
    },
    series: [
      {
        type: 'tree',
        data: [treeData],
        top: '5%',
        left: '10%',
        bottom: '5%',
        right: '20%',
        symbolSize: 10,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 14,
          color: '#D1D5DB'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            color: '#00E5FF'
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        roam: true, // 允许缩放和拖拽
        lineStyle: {
          color: '#30363D',
          curveness: 0.5,
          width: 2
        }
      }
    ]
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <header className="bg-dark-card border border-dark-border p-6 rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">安全防御体系科技树</h1>
          <p className="text-gray-400">支持鼠标拖拽与滚轮缩放，节点悬浮可查看简要说明。</p>
        </div>
      </header>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4 h-[calc(100%-8rem)] relative overflow-hidden">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};
