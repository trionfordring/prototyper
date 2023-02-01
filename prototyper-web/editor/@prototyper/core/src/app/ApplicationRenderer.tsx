import React, { FC, PropsWithChildren } from 'react';

import { ApplicationProvider } from './ApplicationProvider';
import { GetComponentFunc, ProtoApplication } from './ProtoApplication';

import { RootComponentRenderer } from '../component/ComponentRenderer';
import { defaultCompGetter } from '../component/getResolver';

export const ApplicationRenderer: FC<
  PropsWithChildren<{
    app: ProtoApplication;
    getComponent?: GetComponentFunc;
    onRender?: React.ComponentType<{
      render: React.ReactElement;
    }>;
  }>
> = ({ app, children, getComponent, onRender }) => {
  return (
    <ApplicationProvider
      app={app}
      getComponent={getComponent || defaultCompGetter}
      onRender={onRender}
    >
      {children}
      <RootComponentRenderer />
    </ApplicationProvider>
  );
};
