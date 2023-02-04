import { ComponentPackage } from '@prototyper/core';

import { setupSimple } from './Simple';
import { setupStd } from './std';
import { testSlot } from './testSlot';

export const setupVirtual = (pkg: ComponentPackage) => {
  testSlot(pkg);
  setupSimple(pkg);
  setupStd(pkg);
};
