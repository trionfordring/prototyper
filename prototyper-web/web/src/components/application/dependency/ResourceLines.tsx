import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { useFlatDependenciesNoCache } from '@/remote/package';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { ResourceLineType, ResourceLine } from './ResourceLine';

export function ResourceLines() {
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
    const maxSize = lines.reduce((v, line) => {
      return Math.max(v, line?.url?.size || 0);
    }, 0);
    return {
      lines,
      maxSize,
    };
  }, [flatDependencies]);
  if (!data) return <span>正在载入数据...</span>;
  return (
    <>
      {data.lines.map((line) => (
        <ResourceLine
          key={line.id}
          resourceLine={line}
          progressWidth={line.url && `${(line.url.size / data.maxSize) * 100}%`}
        />
      ))}
    </>
  );
}
