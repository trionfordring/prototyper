import { debounce, DebounceSettings } from 'lodash';
import { DependencyList, useCallback } from 'react';

export function useDebounceCallback<T extends (...args: any) => any>(
  cb: T,
  deps: DependencyList,
  wait?: number,
  options?: DebounceSettings
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(cb, wait, options), deps);
}
