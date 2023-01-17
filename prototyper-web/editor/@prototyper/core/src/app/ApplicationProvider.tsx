import React, { FC, PropsWithChildren, useState } from 'react';

import { ProtoApplication } from './ProtoApplication';

import { DefaultPropsType, ProtoComponent } from '../component';
import { defaultMapProps } from '../component/mapProps';
import {
  ApplicationContext,
  ApplicationContextType,
} from '../context/application/ApplicationContext';
import { ProtoExprContext } from '../hook';

export const ApplicationProvider: FC<
  PropsWithChildren<
    {
      app: ProtoApplication;
    } & Omit<
      ApplicationContextType,
      | 'appStates'
      | 'currentComponent'
      | 'setCurrentComponent'
      | 'rootProps'
      | 'setRootProps'
    >
  >
> = ({ app, children, ...options }) => {
  const states = (app.useSetupAppStates && app.useSetupAppStates()) || {};
  const [currentComponent, setCurrentComponent] = useState(app.index);
  const [rootProps, realSetRootProps] = useState(app.initProps || {});
  const [version, setVersion] = useState(0);
  const setRootProps = (props: any) => {
    realSetRootProps(props);
  };
  function setComponent(component: ProtoComponent, props: DefaultPropsType) {
    setCurrentComponent(component);
    setRootProps(
      (component.mapProps || defaultMapProps)(props, {
        appStates: states,
        meta: component.meta || {},
      } as ProtoExprContext)
    );
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
        setRootProps: (props) => {
          setRootProps(
            (currentComponent.mapProps || defaultMapProps)(props, {
              appStates: states,
              meta: currentComponent.meta || {},
            } as ProtoExprContext)
          );
        },
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
