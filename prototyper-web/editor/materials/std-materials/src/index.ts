import { createPackage } from '@prototyper/core';

import { setupComponents } from './components';
import { setupCate } from './setupCate';
import { setupDraggers } from './setupDraggers';

const stdPackage = createPackage('std');

setupComponents(stdPackage);
setupDraggers(stdPackage);
setupCate(stdPackage);

export default stdPackage;
