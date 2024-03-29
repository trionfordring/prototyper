import { createPackage, globalPackagesRegistry } from '@prototyper/core';

import { setupComponents } from './setup/setupComponents';
import { setupDraggers } from './setup/setupDraggers';
import { setupVirtual } from './setup/virtual';

export const helloPackage = createPackage('hello');

setupComponents(helloPackage);
setupDraggers(helloPackage);
setupVirtual(helloPackage);

console.log('载入hello包');

globalPackagesRegistry.addPackage(helloPackage);
