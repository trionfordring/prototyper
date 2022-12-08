import React, { FC, PropsWithChildren } from 'react';

import { ApplicationProvider } from './ApplicationProvider';
import { GetComponentFunc, ProtoApplication } from './ProtoApplication';

import { RootComponentRenderer } from '../component/ComponentRenderer';
import { defaultCompGetter } from '../component/getResolver';

export const ApplicationRenderer: FC<
  PropsWithChildren<{
    app: ProtoApplication;
    getComponent?: GetComponentFunc;
  }>
> = ({ app, children, getComponent }) => {
  return (
    <ApplicationProvider
      app={app}
      getComponent={getComponent || defaultCompGetter}
    >
      {children}
      <RootComponentRenderer />
    </ApplicationProvider>
  );
};
