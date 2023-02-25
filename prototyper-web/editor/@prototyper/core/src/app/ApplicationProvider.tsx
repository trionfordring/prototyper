import React, { FC, PropsWithChildren, useMemo, useState } from 'react';

import { ProtoApplication } from './ProtoApplication';

import { DefaultPropsType, ProtoComponent } from '../component';
import {
  ApplicationContext,
  ApplicationContextType,
} from '../context/application/ApplicationContext';
import { ObjectWithExpression, PropDeclear } from '../utils';

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
      | 'setRootMeta'
    >
  >
> = ({ app, children, ...options }) => {
  const states = (app.useSetupAppStates && app.useSetupAppStates()) || {};
  const [currentComponent, setCurrentComponent] = useState(app.index);
  const [rootProps, realSetRootProps] = useState(app.initProps || {});
  const [rootMeta, setRootMeta] = useState(app.index.meta || {});
  const [propsMapper, setPropsMapper] = useState(app.initPropsMapper || {});
  const [version, setVersion] = useState(0);
  const setRootProps = (props: any, mapper: PropDeclear, context: object) => {
    const expr = new ObjectWithExpression(props, mapper, ['appStates', 'meta']);
    realSetRootProps(expr.run(context));
  };
  function setComponent(
    component: ProtoComponent,
    props: DefaultPropsType,
    mapper: PropDeclear
  ) {
    setCurrentComponent(component);
    setPropsMapper(mapper);
    setRootProps(props, mapper, {
      appStates: states,
      meta: component.meta || {},
    });
    setRootMeta(component.meta || {});
    setVersion((v) => v + 1);
  }
  const currentComponentWithMeta = useMemo(
    () => ({
      ...currentComponent,
      meta: rootMeta,
    }),
    [currentComponent, rootMeta]
  );
  return (
    <ApplicationContext.Provider
      key={version}
      value={{
        ...options,
        appStates: states,
        currentComponent: currentComponentWithMeta,
        setCurrentComponent: setComponent,
        rootProps,
        rootPropsMapper: propsMapper,
        setRootProps: (props, mapper) => {
          setPropsMapper(mapper);
          setRootProps(props, mapper, {
            appStates: states,
            meta: currentComponent.meta || {},
          });
        },
        setRootMeta,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
