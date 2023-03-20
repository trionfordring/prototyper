import { Editor, SerializedNodes, useEditor } from '@craftjs/core';
import { noop } from 'lodash';
import React, {
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
import { Setter } from '../utils';

export interface ApplicationEditorInstance {
  getSerializedNodes(): SerializedNodes;
  getCurrentComponentInstance(): ComponentInstanceType;
  setRootMeta(meta: Setter<any>): void;
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
  const checked = useRef(false);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    getResolver(app.index.dependencies);
    console.log(
      '[editor]全局依赖库快照:',
      JSON.parse(JSON.stringify(globalPackagesRegistry))
    );
  }, [app.index.dependencies]);
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
