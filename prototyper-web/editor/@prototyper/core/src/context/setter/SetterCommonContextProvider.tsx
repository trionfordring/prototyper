import { useEditor } from '@craftjs/core';
import React from 'react';

import { SetterContext } from './SetterContext';

import { PropDeclear } from '../../utils';

export const SetterCommonContextProvider = ({
  virtual,
  id,
  children,
}: React.PropsWithChildren<{ virtual?: boolean; id: string }>) => {
  const {
    exist,
    actions,
    isDeletable,
    props,
    hiddenVal,
    forVal,
    forKey,
    name,
    propsMapper,
  } = useEditor((state, query) => {
    const nodeHelper = query.node(id);
    const node = nodeHelper.get();

    if (!node)
      return {
        exist: false,
      };
    return {
      exist: true,
      props: node.data.props || {},
      hiddenVal: node.data.custom?.hiddenVal,
      forVal: node.data.custom?.forVal,
      forKey: node.data.custom?.forKey,
      propsMapper: node.data.custom?.propsMapper,
      id: node.id,
      name: node.data.custom?.displayName || node.data.displayName,
      isDeletable: nodeHelper.isDeletable(),
    };
  });

  if (!exist) return <span>节点不存在。</span>;

  const setProps = (props: Record<string, any>, propsMapper?: PropDeclear) => {
    actions.setProp(id, (origProps) => {
      if (virtual) origProps.props = props;
      else {
        Object.keys(origProps).forEach((k) => {
          if (!props[k]) delete origProps[k];
        });
        Object.assign(origProps, props);
      }
    });
    actions.setCustom(id, (cust) => {
      cust.propsMapper = propsMapper;
    });
  };

  return (
    <SetterContext.Provider
      value={{
        name,
        setName(name) {
          actions.setCustom(id, (cust) => {
            cust.displayName = name;
          });
        },
        props: virtual ? props?.props || {} : props,
        isRoot: false,
        setProps,
        setHidden(hiddenVal) {
          actions.setCustom(id, (cust) => {
            cust.hiddenVal = hiddenVal;
          });
        },
        hiddenVal,
        setFor(expr, forKey) {
          actions.setCustom(id, (cust) => {
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
