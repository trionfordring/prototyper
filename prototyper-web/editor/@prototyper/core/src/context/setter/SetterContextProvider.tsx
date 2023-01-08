import { useNode } from '@craftjs/core';
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
    slot,
  } = useNode((state) => ({
    props: state.data.props,
    hiddenVal: state.data.custom?.hiddenVal,
    forVal: state.data.custom?.forVal,
    slot: state.data.custom?.slot,
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
        setFor(expr) {
          setCustom((cust) => {
            cust.forVal = expr;
          });
        },
        forVal,
        setSlot(slot = true) {
          setCustom((cust) => {
            cust.slot = slot;
          });
        },
        slot,
      }}
    >
      {children}
    </SetterContext.Provider>
  );
};
