import { noop } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

export function useUncontrolledState<T>(
  controlledState?: T,
  onChange: (v: T) => void = noop,
  initialState?: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledVal, setUncontrolledVal] = useState(initialState);
  const uncontrolledMode = controlledState === undefined;
  const controlledStateRef = useRef(controlledState);
  controlledStateRef.current = controlledState;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const setState = useCallback(
    (v) => {
      if (uncontrolledMode) {
        setUncontrolledVal(v);
        onChangeRef.current(v);
        return;
      }
      let data = v;
      if (typeof data === 'function') data = data(controlledStateRef.current);
      onChangeRef.current(data);
    },
    [uncontrolledMode]
  );
  const state = uncontrolledMode ? uncontrolledVal : controlledState;
  return [state as T, setState];
}
