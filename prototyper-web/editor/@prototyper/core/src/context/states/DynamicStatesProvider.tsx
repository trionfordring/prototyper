import { noop } from 'lodash';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import React from 'react';

import { DynamicStatesContext } from './DynamicStatesContext';

export interface DynamicStatesProviderProps {
  cbWithHooks?: Function;
  onHooksDid?: (v: any) => void;
  args?: any[];
}

const HooksExecutor = React.memo(
  ({
    cbWithHooks,
    onHooksDid = noop,
    args = [],
  }: DynamicStatesProviderProps) => {
    if (!cbWithHooks) onHooksDid(undefined);
    const data = cbWithHooks.apply(this, args);
    useEffect(() => {
      onHooksDid(data);
    }, [data, onHooksDid]);
    return <></>;
  }
);

export function DynamicStatesProvider({
  children,
  cbWithHooks,
  onHooksDid = noop,
  args,
}: PropsWithChildren<DynamicStatesProviderProps>) {
  const versionRef = useRef(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const version = useMemo(() => versionRef.current++, [cbWithHooks]);
  const [inited, setInited] = useState(false);
  const [data, setData] = useState<any>();
  const cb = useCallback(
    (states) => {
      setData(states);
      setInited(true);
      onHooksDid(states);
    },
    [onHooksDid]
  );
  return (
    <DynamicStatesContext.Provider
      value={{
        hasInited: inited,
        data,
      }}
    >
      <HooksExecutor
        key={version}
        cbWithHooks={cbWithHooks}
        args={args}
        onHooksDid={cb}
      />
      {children}
    </DynamicStatesContext.Provider>
  );
}
