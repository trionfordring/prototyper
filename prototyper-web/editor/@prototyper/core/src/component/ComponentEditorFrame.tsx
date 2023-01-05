import { Frame } from '@craftjs/core';
import React, { PropsWithChildren } from 'react';

import { useApplicationContext } from '../context';

export const ComponentEditorFrame: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { currentComponent } = useApplicationContext();
  if (currentComponent.type !== 'virtual') {
    return <div>出现错误！只有虚拟组件才能编辑。</div>;
  }
  return <Frame data={currentComponent.virtualDom}>{children}</Frame>;
};
