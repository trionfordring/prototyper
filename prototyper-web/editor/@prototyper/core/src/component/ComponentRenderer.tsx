import { Editor, Frame, useNode } from '@craftjs/core';
import React, { forwardRef, PropsWithChildren, useMemo } from 'react';

import { ComponentProvider } from './ComponentProvider';
import { DefaultComponentWarpper } from './DefaultComponentWarpper';
import { ComponentDescriptor, ProtoComponent } from './ProtoComponent';
import { defaultCompGetter, getResolver } from './getResolver';

import { useApplicationContext } from '../context';
import { NodeRenderer } from '../renderer/NodeRenderer';

export const ComponentRenderer: React.FC<
  PropsWithChildren<{
    props: Record<string, any>;
    descriptor: ComponentDescriptor;
  }>
> = ({ props, descriptor, children }) => {
  const { getComponent } = useApplicationContext();
  const component = (getComponent || defaultCompGetter)(descriptor);
  const {
    connectors: { drag, connect },
  } = useNode();
  return (
    <JustComponentRenderer
      ref={(ref) => connect(drag(ref))}
      props={props}
      component={component}
      descriptor={descriptor}
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
    props: Record<string, any>;
    component: ProtoComponent;
    editing?: boolean;
    descriptor?: ComponentDescriptor;
    root?: boolean;
  }>
>(({ props, component, children, editing, descriptor, root }, ref) => {
  const NativeComponent = component.component;
  const applicationContext = useApplicationContext();
  const resolver = useMemo(
    () => getResolver(component.dependencies, applicationContext.getComponent),
    [component.dependencies, applicationContext.getComponent]
  );
  const Warpper = (component.warpper || DefaultComponentWarpper) as any;
  return (
    <ComponentProvider component={component} props={props} editing={editing}>
      <Warpper
        ref={ref}
        props={props}
        className={component.className}
        editing={editing}
        root={root}
        descriptor={descriptor}
      >
        {component.type === 'virtual' ? (
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
        )}
      </Warpper>
    </ComponentProvider>
  );
});
