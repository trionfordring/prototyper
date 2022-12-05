import { Editor } from '@craftjs/core';
import React, { FC, PropsWithChildren, useMemo } from 'react';

import { ApplicationProvider } from './ApplicationProvider';
import { ProtoApplication } from './ProtoApplication';

import { ComponentDescriptor, ComponentRenderer } from '../component';
import { getResolver, getResolverFromPkgs } from '../component/getResolver';
import { globalPackagesRegistry } from '../context';
import { NodeRenderer } from '../renderer/NodeRenderer';

export const ApplicationEditor: FC<
  PropsWithChildren<{
    app: ProtoApplication;
    disabled?: boolean;
    onRender?: React.ComponentType<{
      render: React.ReactElement;
    }>;
    devDependencies?: ComponentDescriptor[];
  }>
> = ({ app, children, disabled, onRender, devDependencies }) => {
  const resolver = useMemo(
    () =>
      devDependencies === undefined
        ? getResolverFromPkgs(...globalPackagesRegistry.getAllPackages())
        : getResolver(devDependencies, app.getComponent),
    [devDependencies, app.getComponent]
  );
  return (
    <ApplicationProvider app={app} editing={!disabled}>
      <Editor
        enabled={!disabled}
        onRender={onRender || NodeRenderer}
        resolver={{
          ...resolver,
          ComponentRenderer,
        }}
      >
        {children}
      </Editor>
    </ApplicationProvider>
  );
};
