import { ROOT_NODE } from '@craftjs/core';
import React, { PropsWithChildren } from 'react';

import { SetterContext } from './SetterContext';

import { PropDeclear } from '../../utils';
import { useApplicationContext } from '../application/useApplicationContext';

function unsupport() {
  throw new Error('不支持此操作');
}

export const SetterRootContextProvider = ({ children }: PropsWithChildren) => {
  const { setRootProps, rootProps, rootPropsMapper } = useApplicationContext();

  const setProps = (props: Record<string, any>, propsMapper?: PropDeclear) => {
    setRootProps(
      {
        ...(rootProps || {}),
        ...props,
      },
      propsMapper
    );
  };

  return (
    <SetterContext.Provider
      value={{
        name: ROOT_NODE,
        setName: unsupport,
        props: rootProps || {},
        propsMapper: rootPropsMapper,
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
