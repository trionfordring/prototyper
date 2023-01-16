import React, { PropsWithChildren } from 'react';

import { SetterContext } from './SetterContext';

import { useApplicationContext } from '../application/useApplicationContext';

function unsupport() {
  throw new Error('不支持此操作');
}

export const SetterRootContextProvider = ({ children }: PropsWithChildren) => {
  const { setRootProps, rootProps } = useApplicationContext();

  const setProps = (props: Record<string, any>) => {
    setRootProps({
      ...(rootProps || {}),
      ...props,
    });
  };

  return (
    <SetterContext.Provider
      value={{
        props: rootProps || {},
        isRoot: true,
        setProps,
        setHidden: unsupport,
        setFor: unsupport,
        deleteNode: unsupport,
      }}
    >
      {children}
    </SetterContext.Provider>
  );
};
