import { Editor, SerializedNodes, useEditor } from '@craftjs/core';
import { noop } from 'lodash';
import React, {
  Dispatch,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { ApplicationProvider } from './ApplicationProvider';
import { GetComponentFunc, ProtoApplication } from './ProtoApplication';

import {
  ComponentDescriptor,
  ComponentInstanceType,
  ComponentRenderer,
} from '../component';
import { EditorComponentProvider } from '../component/EditorComponentProvider';
import {
  defaultCompGetter,
  getResolver,
  getResolverFromPkgs,
} from '../component/getResolver';
import { globalPackagesRegistry, useApplicationContext } from '../context';
import { useNodeRender } from '../hook/useNodeRender';

export interface ApplicationEditorInstance {
  getSerializedNodes(): SerializedNodes;
  getCurrentComponentInstance(): ComponentInstanceType;
  setRootMeta(meta: Dispatch<any>): void;
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
  const currentComponentInstance = useRef<ComponentInstanceType>();
  return (
    <ApplicationProvider
      app={app}
      editing={!disabled}
      getComponent={getComponent || defaultCompGetter}
      onRender={onRender}
    >
      <EditorComponentProvider
        onComponentMounted={(i) => (currentComponentInstance.current = i)}
      >
        <Editor
          enabled={!disabled}
          onRender={renderer}
          resolver={{
            ...resolver,
            ComponentRenderer,
          }}
        >
          <EditorInstanceReporter
            onApplicationMounted={onApplicationMounted}
            currentComponentInstance={currentComponentInstance}
          />
          {children}
        </Editor>
      </EditorComponentProvider>
    </ApplicationProvider>
  );
};

function EditorInstanceReporter({
  onApplicationMounted = noop,
  currentComponentInstance,
}: {
  onApplicationMounted?: (instance: ApplicationEditorInstance) => void;
  currentComponentInstance: MutableRefObject<ComponentInstanceType>;
}) {
  const { query } = useEditor();
  const { setRootMeta } = useApplicationContext();

  useEffect(() => {
    onApplicationMounted({
      getSerializedNodes() {
        return query.getSerializedNodes();
      },
      getCurrentComponentInstance() {
        return currentComponentInstance.current;
      },
      setRootMeta(meta) {
        setRootMeta(meta);
        currentComponentInstance.current?.setMeta(meta);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}
