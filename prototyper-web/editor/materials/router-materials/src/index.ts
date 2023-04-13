import { createPackage, globalPackagesRegistry } from '@prototyper/core';

import { setupCate } from './setupCate';
import { setupComponents } from './setupComponents';
import { setupDraggers } from './setupDraggers';

const routerPackage = createPackage('router');

setupComponents(routerPackage);
setupCate(routerPackage);
setupDraggers(routerPackage);

globalPackagesRegistry.addPackage(routerPackage);
export default routerPackage;
