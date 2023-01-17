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
        <ComponentWarpper
          render={component.warpper}
          ref={ref}
          props={props}
          className={component.className}
          editing={editing}
          descriptor={component.descriptor}
        >
          {Content}
        </ComponentWarpper>
      )}
    </ComponentProvider>
  );
});
