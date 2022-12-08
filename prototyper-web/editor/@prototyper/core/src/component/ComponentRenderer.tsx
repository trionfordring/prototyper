import { Editor, Frame, useNode } from '@craftjs/core';
import React, { forwardRef, PropsWithChildren, useMemo } from 'react';

import { ComponentProvider } from './ComponentProvider';
import { DefaultComponentWarpper } from './DefaultComponentWarpper';
import {
  ComponentDescriptor,
  ProtoComponent,
  WithDescriptor,
} from './ProtoComponent';
import { defaultCompGetter, getResolver } from './getResolver';

import { useApplicationContext } from '../context';
import { NodeRenderer } from '../renderer/NodeRenderer';

export const ComponentRenderer: React.FC<
  PropsWithChildren<{
    props?: Record<string, any>;
    descriptor?: ComponentDescriptor;
  }>
> = ({ props, descriptor, children }) => {
  const { getComponent } = useApplicationContext();
  const {
    connectors: { drag, connect },
  } = useNode();
  console.log('render:', props, descriptor);

  if (!descriptor) {
    return null;
  }
  const component = (getComponent || defaultCompGetter)(descriptor);
  return (
    <JustComponentRenderer
      ref={(ref) => connect(drag(ref))}
      props={props}
      component={component}
    >
      {children}
    </JustComponentRenderer>
  );
};

export const RootComponentRenderer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { currentComponent: component, rootProps: props } =
    useApplicationContext();
  return (
    <JustComponentRenderer props={props} component={component} root>
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
  }>
>(({ props, component, children, editing, root }, ref) => {
  const NativeComponent = component.component;
  const applicationContext = useApplicationContext();
  const resolver = useMemo(
    () => getResolver(component.dependencies, applicationContext.getComponent),
    [component.dependencies, applicationContext.getComponent]
  );
  const Warpper = (component.warpper || DefaultComponentWarpper) as any;
  const Content =
    component.type === 'virtual' ? (
      <Editor
        resolver={{
          ...resolver,
          ComponentRenderer,
        }}
        onRender={NodeRenderer}
        enabled={!!editing}
      >
        <Frame data={component?.virtualDom as string}></Frame>
      </Editor>
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
        Content
      ) : (
        <Warpper
          ref={ref}
          props={props}
          className={component.className}
          editing={editing}
          descriptor={component.descriptor}
        >
          {Content}
        </Warpper>
      )}
    </ComponentProvider>
  );
});
