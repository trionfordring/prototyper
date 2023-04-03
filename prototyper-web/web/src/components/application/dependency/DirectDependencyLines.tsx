import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { ResourceLine, ResourceLineType } from './ResourceLine';

export function DirectDependencyLines() {
  const appInfo = useApplicationInfo();
  const data = useMemo(() => {
    if (!appInfo) return null;
    const deps = [appInfo.mainPackage, ...appInfo.mainPackage.dependencies];
    const lines: ResourceLineType[] = deps.flatMap((dep) => {
      if (isEmpty(dep.umds)) return [dep];
      return dep.umds.map((umd) => ({
        ...dep,
        url: umd,
      }));
    });
    return {
      lines,
    };
  }, [appInfo]);
  if (!data) return <span>正在载入数据...</span>;
  return (
    <>
      {data.lines.map((line) => (
        <ResourceLine key={line.id} resourceLine={line} />
      ))}
    </>
  );
}
