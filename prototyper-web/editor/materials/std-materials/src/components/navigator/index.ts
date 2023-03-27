import { ComponentPackage } from '@prototyper/core';

import { Menu, MenuSettings } from './Menu';

export const setupNavigatorComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: MenuSettings,
    component: Menu,
    name: 'Menu',
  });
};
