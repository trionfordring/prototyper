import { Frame } from '@craftjs/core';
import React, { PropsWithChildren } from 'react';

import { ComponentProvider } from './ComponentProvider';
import { DefaultComponentWarpper } from './DefaultComponentWarpper';
import { ProtoWarpperProps } from './ProtoComponent';

import { useApplicationContext } from '../context';

export const ComponentEditorFrame: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { currentComponent, rootProps, editing } = useApplicationContext();
  if (currentComponent.type !== 'virtual') {
    return <div>出现错误！只有虚拟组件才能编辑。</div>;
  }
  const Warpper = (currentComponent.warpper ||
    DefaultComponentWarpper) as React.ElementType<ProtoWarpperProps>;
  return (
    <ComponentProvider
      component={currentComponent}
      props={rootProps}
      editing={editing}
    >
      <Warpper
        props={rootProps}
        editing={editing}
        className={currentComponent.className}
        root
      >
        <Frame data={currentComponent.virtualDom}>{children}</Frame>
      </Warpper>
    </ComponentProvider>
  );
};
