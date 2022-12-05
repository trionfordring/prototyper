import React, { FC, PropsWithChildren } from 'react';

import { ProtoComponent } from './ProtoComponent';

import { ComponentContext } from '../context/component/ComponentContext';

export const ComponentProvider: FC<
  PropsWithChildren<{
    props: Record<string, any>;
    component: ProtoComponent;
    editing?: boolean;
  }>
> = ({ props, component, children, editing }) => {
  const meta = component.meta || {};
  const states =
    (component.useSetupStates && component.useSetupStates(props, meta)) || {};
  return (
    <ComponentContext.Provider
      value={{
        props,
        state: states,
        meta,
        component,
        editing,
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
};
