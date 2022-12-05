import React, { FC, PropsWithChildren, useState } from 'react';

import { ProtoApplication } from './ProtoApplication';

import { DefaultPropsType, ProtoComponent } from '../component';
import {
  ApplicationContext,
  ApplicationContextType,
} from '../context/application/ApplicationContext';

export const ApplicationProvider: FC<
  PropsWithChildren<
    {
      app: ProtoApplication;
    } & Omit<
      ApplicationContextType,
      'appStates' | 'currentComponent' | 'setCurrentComponent' | 'rootProps'
    >
  >
> = ({ app, children, ...options }) => {
  const states = (app.useSetupAppStates && app.useSetupAppStates()) || {};
  const [currentComponent, setCurrentComponent] = useState(app.index);
  const [rootProps, setRootProps] = useState(app.initProps || {});
  function setComponent(component: ProtoComponent, props: DefaultPropsType) {
    setCurrentComponent(component);
    setRootProps(props);
  }
  return (
    <ApplicationContext.Provider
      value={{
        ...options,
        appStates: states,
        currentComponent,
        setCurrentComponent: setComponent,
        rootProps,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
