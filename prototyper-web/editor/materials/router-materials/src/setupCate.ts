import { ComponentPackage } from '@prototyper/core';

export const SUBCATE = 'router';

export function setupCate(pkg: ComponentPackage) {
  const cate = pkg.createCategory('std', '标准组件', 10);
  cate.addSubcategory(SUBCATE, '路由', 8.6);
}
