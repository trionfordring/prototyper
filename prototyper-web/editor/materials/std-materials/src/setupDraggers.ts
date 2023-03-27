import { ComponentPackage } from '@prototyper/core';

import { CATE_BASIC, CATE_LAYOUT, CATE_LAYOUT_PAGE } from './setupCate';
import { withDraggerRegister } from './utils/withDraggerRegister';

export const setupDraggers = (pkg: ComponentPackage) => {
  const { register, registerCanvas, subcate } = withDraggerRegister(pkg);

  // 基本组件
  subcate(CATE_BASIC);
  register('HTMLText', '原生文本', null, {}, { text: 'fmtExpr' });
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
  register('SlotBlock', '块级插槽', null);
  register('SlotSpan', '行级插槽', null);

  // 布局组件
  subcate(CATE_LAYOUT);
  registerCanvas('Divider', '分割线', null);
  register('GridRow', '栅格行', null);
  registerCanvas('Space', '间距', null);

  subcate(CATE_LAYOUT_PAGE);
  registerCanvas('Layout', '布局容器', null);
  registerCanvas('Header', '页头', null);
  registerCanvas('Footer', '页脚', null);
  registerCanvas('Content', '主体', null);
  registerCanvas('Sider', '侧栏', null);
};
