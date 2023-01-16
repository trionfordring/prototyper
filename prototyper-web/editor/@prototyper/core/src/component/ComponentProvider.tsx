import React, { FC, PropsWithChildren } from 'react';

import { ProtoComponent, WithDescriptor } from './ProtoComponent';

import { SaveComponentContext } from '../context';
import { ComponentContext } from '../context/component/ComponentContext';

export const ComponentProvider: FC<
  PropsWithChildren<{
    props?: Record<string, any>;
    component: ProtoComponent & Partial<WithDescriptor>;
    editing?: boolean;
    root?: boolean;
  }>
> = ({ props, component, children, editing, root }) => {
  const meta = component.meta || {};
  const states =
    (component.useSetupStates && component.useSetupStates(props, meta)) || {};
  return (
    <SaveComponentContext>
      <ComponentContext.Provider
        value={{
          props: props || {},
          state: states,
          meta,
          component,
          editing,
          root,
        }}
      >
        {children}
      </ComponentContext.Provider>
    </SaveComponentContext>
  );
};
