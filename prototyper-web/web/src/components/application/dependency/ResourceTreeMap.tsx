import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { useFlatDependenciesNoCache } from '@/remote/package';
import { isEmpty } from 'lodash';
import { Suspense, useMemo } from 'react';
import { ResourceLineType } from './ResourceLine';
import dynamic from 'next/dynamic';
import type { TreeMapDataType } from '@/components/application/dependency/TreeMapGraph';
import { Typography } from 'antd';
import styled from 'styled-components';

const Chart = dynamic(() => import('./TreeMapGraph'), {
  ssr: false,
});

const ChartPlaceholder = styled.div`
  height: 400px;
  width: 100%;
`;

export function ResourceTreeMap() {
  const appInfo = useApplicationInfo();
  const { flatDependencies } = useFlatDependenciesNoCache(
    appInfo?.mainPackage.id
  );
  const data = useMemo(() => {
    if (isEmpty(flatDependencies)) return null;
    const lines: ResourceLineType[] = flatDependencies.flatMap((dep) => {
      if (isEmpty(dep.umds)) return [dep];
      return dep.umds.map((umd) => ({
        ...dep,
        url: umd,
      }));
    });
    const chartData: TreeMapDataType[] = lines.map((line) => {
      const size = (line.url?.size || 0) + 1;
      const suffix = line.url ? `(${line.url.name})` : '';
      return {
        name: `${line.name}${suffix}`,
        value: size,
        line,
      };
    });
    const totalSize = lines.reduce(
      (sum, line) => sum + (line.url?.size || 0),
      0
    );
    return {
      lines,
      chartData,
      totalSize,
    };
  }, [flatDependencies]);
  if (!data) return <span>正在载入数据...</span>;
  return (
    <>
      <Typography.Paragraph>
        需要载入{data.lines.length}个数据包，总计
        {Number(data.totalSize).toFixed(2)}
        KB。预计载入时间
        {(10 + data.lines.length * 2 + data.totalSize / 5).toFixed(1)}ms
      </Typography.Paragraph>
      <Suspense fallback={<ChartPlaceholder>正在载入图表</ChartPlaceholder>}>
        <Chart data={data.chartData} />
      </Suspense>
    </>
  );
}
