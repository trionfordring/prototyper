import { noop } from 'lodash';
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ProtoComponent, WithDescriptor } from './ProtoComponent';

import { SaveComponentContext } from '../context';
import { ComponentContext } from '../context/component/ComponentContext';
import { Setter } from '../utils';

export interface ComponentInstanceType {
  setMeta(meta: Setter): void;
}

export const ComponentProvider: FC<
  PropsWithChildren<{
    props?: Record<string, any>;
    component: ProtoComponent & Partial<WithDescriptor>;
    editing?: boolean;
    root?: boolean;
    onComponentMounted?: (instance: ComponentInstanceType) => void;
  }>
> = ({
  props,
  component,
  children,
  editing,
  root,
  onComponentMounted = noop,
}) => {
  const [meta, setMeta] = useState(component.meta || {});
  const states =
    (component.useSetupStates && component.useSetupStates(props, meta)) || {};
  const inited = useRef(false);
  useEffect(() => {
    if (!inited.current) {
      inited.current = true;
      onComponentMounted({
        setMeta,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
