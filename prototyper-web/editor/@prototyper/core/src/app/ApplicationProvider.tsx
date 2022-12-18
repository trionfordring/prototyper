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
  const [version, setVersion] = useState(0);
  function setComponent(component: ProtoComponent, props: DefaultPropsType) {
    setCurrentComponent(component);
    setRootProps(props);
    setVersion((v) => v + 1);
  }
  return (
    <ApplicationContext.Provider
      key={version}
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
