import { ComponentPackage } from '@prototyper/core';

import { setupBasicComponents } from './basic';
import { setupLayoutComponents } from './layout';

export const setupComponents = (pkg: ComponentPackage) => {
  setupBasicComponents(pkg);
  setupLayoutComponents(pkg);
};
