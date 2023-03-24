import { ComponentPackage } from '@prototyper/core';

import { CATE_BASIC, CATE_LAYOUT } from './setupCate';
import { withDraggerRegister } from './utils/withDraggerRegister';

export const setupDraggers = (pkg: ComponentPackage) => {
  const { register, registerCanvas, subcate } = withDraggerRegister(pkg);

  // 基本组件
  subcate(CATE_BASIC);
  register(
    'Typography',
    '文本',
    null,
    {
      text: 'hello',
    },
    {
      text: 'fmtExpr',
    }
  );
  registerCanvas('Button', '按钮', null);
  registerCanvas('Div', '块级容器', null);

  // 布局组件
  subcate(CATE_LAYOUT);
  registerCanvas('Divider', '分割线', null);
  register('GridRow', '栅格行', null);
};
