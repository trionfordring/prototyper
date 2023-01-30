import { DependencyList, useEffect, useRef, useState } from 'react';

import { useDebounceCallback } from './useDebounceCallback';

export function useDebounceMemo<T extends (...args) => any>(
  cb: T,
  deps: DependencyList,
  wait?: number
) {
  const initialMount = useRef(true);
  const [ret, setRet] = useState();
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const debouncedCb = useDebounceCallback(
    () => {
      setRet(cbRef.current());
    },
    [],
    wait
  );
  useEffect(() => {
    if (!initialMount.current) {
      debouncedCb();
    } else {
      setRet(cb());
      initialMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ret;
}
