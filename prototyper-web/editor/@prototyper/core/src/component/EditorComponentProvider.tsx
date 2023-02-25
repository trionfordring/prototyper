import React, { PropsWithChildren } from 'react';

import { ComponentInstanceType, ComponentProvider } from './ComponentProvider';

import { useApplicationContext } from '../context';

export const EditorComponentProvider: React.FC<
  PropsWithChildren<{
    onComponentMounted?: (instance: ComponentInstanceType) => void;
  }>
> = ({ children, onComponentMounted }) => {
  const { currentComponent, rootProps, editing } = useApplicationContext();
  if (currentComponent.type !== 'virtual') {
    return <div>出现错误！只有虚拟组件才能编辑。</div>;
  }
  return (
    <ComponentProvider
      component={currentComponent}
      props={rootProps}
      editing={editing}
      onComponentMounted={onComponentMounted}
      root
    >
      {children}
    </ComponentProvider>
  );
};
