import { createPackage, globalPackagesRegistry } from '@prototyper/core';

import { setupComponents } from './setup/setupComponents';
import { setupDraggers } from './setup/setupDraggers';

export const helloPackage = createPackage('hello');

setupComponents(helloPackage);
setupDraggers(helloPackage);

globalPackagesRegistry.addPackage(helloPackage);
