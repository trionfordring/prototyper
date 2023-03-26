import { ComponentPackage } from '@prototyper/core';

export const CATE_BASIC = 'basic';
export const CATE_LAYOUT = 'layout';
export const CATE_LAYOUT_PAGE = 'layout-page';
export const CATE_DISPLAY = 'display';
export const CATE_FEEDBACK = 'feedback';
export const CATE_FORM = 'form';
export const CATE_NAVIGATOR = 'navigator';
export const CATE_OTHER = 'other';

export function setupCate(pkg: ComponentPackage) {
  const cate = pkg.createCategory(pkg.namespace, '标准组件', 10);
  cate.addSubcategory(CATE_BASIC, '通用', 10);
  cate.addSubcategory(CATE_LAYOUT, '布局', 9);
  cate.addSubcategory(CATE_LAYOUT_PAGE, '页面级布局', 8.5);
  cate.addSubcategory(CATE_NAVIGATOR, '导航', 8);
  cate.addSubcategory(CATE_FORM, '数据录入', 7);
  cate.addSubcategory(CATE_DISPLAY, '数据展示', 6);
  cate.addSubcategory(CATE_FEEDBACK, '反馈', 5);
  cate.addSubcategory(CATE_OTHER, '其他', 4);
}
