import { identity, isNil, toString } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useQueryState<S>(
  key: string,
  initialState: S | (() => S),
  parser: (query?: string | string[]) => S = identity,
  formatter: (v: S) => string | string[] = toString
) {
  const router = useRouter();
  const [value, setValue] = useState(initialState);
  // (初始化)组件被加载时通过url更新值
  useEffect(() => {
    const routerValue = router.query[key];
    if (!isNil(routerValue)) {
      setValue(parser(routerValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // 值更新时浅同步url
  useEffect(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          [key]: formatter(value),
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);
  return [value, setValue] as const;
}
