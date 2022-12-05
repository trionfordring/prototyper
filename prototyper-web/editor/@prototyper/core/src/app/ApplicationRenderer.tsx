import React, { FC, PropsWithChildren } from 'react';

import { ApplicationProvider } from './ApplicationProvider';
import { ProtoApplication } from './ProtoApplication';

import { RootComponentRenderer } from '../component/ComponentRenderer';

export const ApplicationRenderer: FC<
  PropsWithChildren<{
    app: ProtoApplication;
  }>
> = ({ app, children }) => {
  return (
    <ApplicationProvider app={app}>
      <RootComponentRenderer>{children}</RootComponentRenderer>
    </ApplicationProvider>
  );
};
