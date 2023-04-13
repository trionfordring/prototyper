import { ComponentPackage } from '@prototyper/core';

import { SUBCATE } from './setupCate';
import { withDraggerRegister } from './utils/withDraggerRegister';

export const setupDraggers = (pkg: ComponentPackage) => {
  const { register, registerCanvas, subcate } = withDraggerRegister(pkg);
  subcate(SUBCATE);
  register('RouterProvider', '根路由器', null);
  register('Routes', '从路由器', null);
  register('Outlet', '路由节点', null);
  registerCanvas('Link', '路由链接', null);
};
