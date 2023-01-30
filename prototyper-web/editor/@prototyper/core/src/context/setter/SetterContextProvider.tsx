import { useEditor, useNode } from '@craftjs/core';
import React from 'react';

import { SetterContext } from './SetterContext';

import { PropDeclear } from '../../utils';

export const SetterContextProvider = ({
  virtual,
  children,
}: React.PropsWithChildren<{ virtual?: boolean }>) => {
  const {
    props,
    actions: { setProp, setCustom },
    hiddenVal,
    forVal,
    forKey,
    id,
    name,
    propsMapper,
  } = useNode((state) => ({
    props: state.data.props,
    hiddenVal: state.data.custom?.hiddenVal,
    forVal: state.data.custom?.forVal,
    forKey: state.data.custom?.forKey,
    propsMapper: state.data.custom?.propsMapper,
    id: state.id,
    name: state.data.displayName,
  }));
  const { actions, isDeletable } = useEditor((state, query) => ({
    isDeletable: query.node(id).isDeletable(),
  }));

  const setProps = (props: Record<string, any>, propsMapper?: PropDeclear) => {
    setProp((origProps) => {
      if (virtual) origProps.props = props;
      else {
        Object.keys(origProps).forEach((k) => {
          if (!props[k]) delete origProps[k];
        });
        Object.assign(origProps, props);
      }
    });
    setCustom((cust) => {
      cust.propsMapper = propsMapper;
    });
  };

  return (
    <SetterContext.Provider
      value={{
        props: virtual ? props.props || {} : props,
        isRoot: false,
        setProps,
        setHidden(hiddenVal) {
          setCustom((cust) => {
            cust.hiddenVal = hiddenVal;
          });
        },
        hiddenVal,
        setFor(expr, forKey) {
          setCustom((cust) => {
            cust.forVal = expr;
            cust.forKey = forKey;
          });
        },
        forVal,
        forKey,
        propsMapper,
        selectedNode: {
          id,
          name,
          isDeletable,
        },
        deleteNode: () => {
          actions.delete(id);
        },
      }}
    >
      {children}
    </SetterContext.Provider>
  );
};
