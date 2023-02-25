import { Editor, Frame, useNode } from '@craftjs/core';
import React, { forwardRef, PropsWithChildren, useMemo } from 'react';

import { ComponentProvider } from './ComponentProvider';
import { ComponentWarpper } from './ComponentWarpper';
import {
  ComponentDescriptor,
  ProtoComponent,
  WithDescriptor,
} from './ProtoComponent';
import { defaultCompGetter, getResolver } from './getResolver';

import { SetterContextProvider, useApplicationContext } from '../context';
import { useNodeRender } from '../hook/useNodeRender';

export const EmbeddedComponentRenderer: React.FC<
  PropsWithChildren<{
    props?: Record<string, any>;
    descriptor: ComponentDescriptor;
  }>
> = ({ props, descriptor, children }) => {
  const { getComponent, onRender } = useApplicationContext();
  const component = useMemo(
    () => getComponent(descriptor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [descriptor.namespace, descriptor.name]
  );
  return (
    <JustComponentRenderer
      props={props}
      component={component}
      onRender={onRender}
      root
    >
      {children}
    </JustComponentRenderer>
  );
};

export const ComponentRenderer: React.FC<
  PropsWithChildren<{
    props?: Record<string, any>;
    descriptor?: ComponentDescriptor;
  }>
> = ({ props, descriptor, children }) => {
  const { getComponent, onRender } = useApplicationContext();
  const {
    connectors: { drag, connect },
  } = useNode();

  if (!descriptor) {
    return null;
  }
  const component = (getComponent || defaultCompGetter)(descriptor);
  return (
    <JustComponentRenderer
      ref={(ref) => connect(drag(ref))}
      props={props}
      component={component}
      onRender={onRender}
    >
      {children}
    </JustComponentRenderer>
  );
};

const ComponentRendererSettings = () => {
  const { getComponent } = useApplicationContext();
  const { descriptor } = useNode((state) => ({
    descriptor: state.data.props.descriptor,
  }));
  if (!descriptor) return null;
  const component = getComponent(descriptor);
  return (
    component?.settings && (
      <SetterContextProvider virtual>
        {React.createElement(component?.settings)}
      </SetterContextProvider>
    )
  );
};

ComponentRenderer['craft'] = {
  related: {
    settings: ComponentRendererSettings,
  },
};

export const RootComponentRenderer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    currentComponent: component,
    rootProps: props,
    onRender,
  } = useApplicationContext();
  return (
    <JustComponentRenderer
      props={props}
      component={component}
      onRender={onRender}
      root
    >
      {children}
    </JustComponentRenderer>
  );
};

const JustComponentRenderer = forwardRef<
  any,
  PropsWithChildren<{
    props?: Record<string, any>;
    component: ProtoComponent & Partial<WithDescriptor>;
    editing?: boolean;
    root?: boolean;
    onRender?: React.ComponentType<{
      render: React.ReactElement;
    }>;
  }>
>(({ props, component, children, editing, root, onRender }, ref) => {
  const NativeComponent = component.component;
  const applicationContext = useApplicationContext();
  const resolver = useMemo(
    () => ({
      ...getResolver(component.dependencies, applicationContext.getComponent),
      ComponentRenderer,
    }),
    [component.dependencies, applicationContext.getComponent]
  );
  const editorOnRender = useNodeRender(onRender);
  const frameData = useMemo(
    () => component?.virtualDom as string,
    [component?.virtualDom]
  );
  const content =
    component.type === 'virtual' ? (
      <DoVirtualComponentRender
        resolver={resolver}
        onRender={editorOnRender}
        vdom={frameData}
        editing={!!editing}
      />
    ) : (
      <NativeComponent {...props}>{children}</NativeComponent>
    );
  return (
    <ComponentProvider
      component={component}
      props={props}
      editing={editing}
      root={root}
    >
      {root ? (
        content
      ) : (
        <ComponentWarpper
          render={component.warpper}
          ref={ref}
          props={props}
          className={component.className}
          editing={editing}
          descriptor={component.descriptor}
        >
          {content}
        </ComponentWarpper>
      )}
    </ComponentProvider>
  );
});

const DoVirtualComponentRender = ({ resolver, onRender, editing, vdom }) => {
  return (
    <Editor resolver={resolver} onRender={onRender} enabled={editing}>
      <Frame data={vdom}></Frame>
    </Editor>
  );
};
