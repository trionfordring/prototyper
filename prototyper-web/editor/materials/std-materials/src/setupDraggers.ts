import { ComponentPackage } from '@prototyper/core';

import { withDraggerRegister } from './utils/withDraggerRegister';

export const setupDraggers = (pkg: ComponentPackage) => {
  const { register, registerCanvas } = withDraggerRegister(pkg);

  // 基本组件
  register('Typography', '文本', null, {
    text: 'hello',
  });
  registerCanvas('Button', '按钮', null);
  registerCanvas('Div', '块级容器', null);

  // 布局组件
  registerCanvas('Divider', '分割线', null);
  register('GridRow', '栅格行', null);
};
