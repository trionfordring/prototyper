import * as echarts from 'echarts/core';
import { TooltipComponent } from 'echarts/components';
import { TreemapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ResourceLineType } from './ResourceLine';

echarts.use([TreemapChart, CanvasRenderer, TooltipComponent]);

const ChartDom = styled.div`
  height: 400px;
  width: 100%;
`;

export interface TreeMapDataType {
  name: string;
  value: number;
  children?: TreeMapDataType[];
}
export default function TreeMapGraph({ data }: { data: TreeMapDataType[] }) {
  const chartDomRef = useRef<HTMLDivElement>();
  const chartRef = useRef<echarts.ECharts>();

  useEffect(() => {
    const dom = chartDomRef.current;
    if (dom) {
      chartRef.current = echarts.init(dom);
      chartRef.current.setOption({
        tooltip: {
          formatter: (info) => {
            const line: ResourceLineType = info.data.line;
            if (!line) return info.data.value;
            let cost = 8;
            if (!line.url) {
              return `${line.name}(${line.type})<br />预计耗时: ${cost.toFixed(
                0
              )}ms`;
            }
            cost += line.url.size / 5 - 6;
            return `${line.name}(${line.type})<br/>${line.url.name}(${
              line.url.size
            }KB)<br />预计耗时: ${cost.toFixed(0)}ms`;
          },
        },
        series: [
          {
            type: 'treemap',
            width: '100%',
            height: '100%',
            label: {
              show: true,
            },
            breadcrumb: {
              show: false,
            },
          },
        ],
      });
    }
    return () => {
      const chart = chartRef.current;
      if (!chart) return;
      chart.dispose();
      chartRef.current = undefined;
    };
  }, []);
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setOption({
      series: [
        {
          type: 'treemap',
          data,
        },
      ],
    });
  }, [data]);
  return <ChartDom ref={chartDomRef}></ChartDom>;
}
