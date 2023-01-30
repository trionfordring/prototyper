import { createPackage } from '@prototyper/core';

import { setupComponents } from './components';
import { setupDraggers } from './setupDraggers';

const stdPackage = createPackage('std');

setupComponents(stdPackage);
setupDraggers(stdPackage);

export default stdPackage;
