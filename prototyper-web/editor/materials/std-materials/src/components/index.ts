import { ComponentPackage } from '@prototyper/core';

import { setupBasicComponents } from './basic';
import { setupDisplayComponents } from './display';
import { setupFeedbackComponents } from './feedback';
import { setupFormComponents } from './form';
import { setupLayoutComponents } from './layout';
import { setupNavigatorComponents } from './navigator';

export const setupComponents = (pkg: ComponentPackage) => {
  setupBasicComponents(pkg);
  setupLayoutComponents(pkg);
  setupNavigatorComponents(pkg);
  setupFormComponents(pkg);
  setupFeedbackComponents(pkg);
  setupDisplayComponents(pkg);
};
