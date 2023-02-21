import { Editor, SerializedNodes, useEditor } from '@craftjs/core';
import { noop } from 'lodash';
import React, { FC, PropsWithChildren, useEffect, useMemo } from 'react';

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
import { useNodeRender } from '../hook/useNodeRender';

export interface ApplicationEditorInstance {
  getSerializedNodes(): SerializedNodes;
}

export const ApplicationEditor: FC<
  PropsWithChildren<{
    app: ProtoApplication;
    disabled?: boolean;
    onRender?: React.ComponentType<{
      render: React.ReactElement;
    }>;
    devDependencies?: ComponentDescriptor[];
    getComponent?: GetComponentFunc;
    onApplicationMounted?: (instance: ApplicationEditorInstance) => void;
  }>
> = ({
  app,
  children,
  disabled,
  onRender,
  devDependencies,
  getComponent,
  onApplicationMounted,
}) => {
  const resolver = useMemo(
    () =>
      devDependencies === undefined
        ? getResolverFromPkgs(...globalPackagesRegistry.getAllPackages())
        : getResolver(devDependencies, getComponent),
    [devDependencies, getComponent]
  );
  const renderer = useNodeRender(onRender);
  return (
    <ApplicationProvider
      app={app}
      editing={!disabled}
      getComponent={getComponent || defaultCompGetter}
      onRender={onRender}
    >
      <EditorComponentProvider>
        <Editor
          enabled={!disabled}
          onRender={renderer}
          resolver={{
            ...resolver,
            ComponentRenderer,
          }}
        >
          <EditorInstanceReporter onApplicationMounted={onApplicationMounted} />
          {children}
        </Editor>
      </EditorComponentProvider>
    </ApplicationProvider>
  );
};

function EditorInstanceReporter({
  onApplicationMounted = noop,
}: {
  onApplicationMounted?: (instance: ApplicationEditorInstance) => void;
}) {
  const { query } = useEditor();

  useEffect(() => {
    onApplicationMounted({
      getSerializedNodes() {
        return query.getSerializedNodes();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}
