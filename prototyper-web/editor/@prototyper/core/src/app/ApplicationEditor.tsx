import { Editor } from '@craftjs/core';
import React, { FC, PropsWithChildren, useMemo } from 'react';

import { ApplicationProvider } from './ApplicationProvider';
import { GetComponentFunc, ProtoApplication } from './ProtoApplication';

import { ComponentDescriptor, ComponentRenderer } from '../component';
import { EditorComponentProvider } from '../component/EditorComponentProvider';
import {
  defaultCompGetter,
  getResolver,
  getResolverFromPkgs,
} from '../component/getResolver';
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
    getComponent?: GetComponentFunc;
  }>
> = ({ app, children, disabled, onRender, devDependencies, getComponent }) => {
  const resolver = useMemo(
    () =>
      devDependencies === undefined
        ? getResolverFromPkgs(...globalPackagesRegistry.getAllPackages())
        : getResolver(devDependencies, app.getComponent),
    [devDependencies, app.getComponent]
  );
  return (
    <ApplicationProvider
      app={app}
      editing={!disabled}
      getComponent={getComponent || defaultCompGetter}
    >
      <EditorComponentProvider>
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
      </EditorComponentProvider>
    </ApplicationProvider>
  );
};
