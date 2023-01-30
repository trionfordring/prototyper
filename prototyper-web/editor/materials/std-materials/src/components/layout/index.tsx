import { ComponentPackage } from '@prototyper/core';

import { Divider, DividerSettings } from './Divider';
import { GridCol, GridColSettings } from './GridCol';
import { GridRow, GridRowSettings } from './GridRow';

export const setupLayoutComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: DividerSettings,
    component: Divider,
    name: 'Divider',
  });
  pkg.createComponent({
    type: 'native',
    settings: GridColSettings,
    component: GridCol,
    name: 'GridCol',
  });
  pkg.createComponent({
    type: 'native',
    settings: GridRowSettings,
    component: GridRow,
    name: 'GridRow',
    dependencies: [{ name: 'GridCol', namespace: pkg.namespace }],
  });
};
