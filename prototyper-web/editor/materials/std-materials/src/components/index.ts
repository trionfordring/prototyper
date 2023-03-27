import { ComponentPackage } from '@prototyper/core';

import { setupBasicComponents } from './basic';
import { setupLayoutComponents } from './layout';
import { setupNavigatorComponents } from './navigator';

export const setupComponents = (pkg: ComponentPackage) => {
  setupBasicComponents(pkg);
  setupLayoutComponents(pkg);
  setupNavigatorComponents(pkg);
};
