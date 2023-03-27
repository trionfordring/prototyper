import { noop } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export function useUncontrolledState<T>(
  controlledState?: T,
  onChange: (v: T) => void = noop,
  initialState?: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledVal, setUncontrolledVal] = useState(initialState);
  const uncontrolledMode = controlledState === undefined;
  const setState = useCallback(
    (v) => {
      if (uncontrolledMode) setUncontrolledVal(v);
      onChange(v);
    },
    [onChange, uncontrolledMode]
  );
  const state = uncontrolledMode ? uncontrolledVal : controlledState;
  return [state as T, setState];
}
