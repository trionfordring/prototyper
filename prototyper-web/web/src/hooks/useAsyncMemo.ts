import { useEffect, useState } from 'react';

export function useAsyncMemo<T>(
  asyncCallback: () => Promise<T> | T,
  deps: React.DependencyList
): T | undefined {
  const [data, setData] = useState<T | undefined>();
  useEffect(() => {
    const revalidateData = async () => {
      const newData = await asyncCallback();
      setData(newData);
    };
    revalidateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}
