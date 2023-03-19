import { useEffect, useRef } from 'react';

export function useEffectOnce(cb: Function) {
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
