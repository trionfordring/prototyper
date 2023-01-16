import { useEditor, useNode } from '@craftjs/core';
import React from 'react';

import { SetterContext } from './SetterContext';

export const SetterContextProvider = ({
  virtual,
  children,
}: React.PropsWithChildren<{ virtual?: boolean }>) => {
  const {
    props,
    actions: { setProp, setCustom },
    hiddenVal,
    forVal,
    id,
    name,
  } = useNode((state) => ({
    props: state.data.props,
    hiddenVal: state.data.custom?.hiddenVal,
    forVal: state.data.custom?.forVal,
    id: state.id,
    name: state.data.displayName,
  }));
  const { actions, isDeletable } = useEditor((state, query) => ({
    isDeletable: query.node(id).isDeletable(),
  }));

  const setProps = (props: Record<string, any>) => {
    setProp((origProps) => {
      if (virtual)
        Object.assign(origProps, {
          props,
        });
      else Object.assign(origProps, props);
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
