import { ComponentPackage } from '@prototyper/core';

import { Button, ButtonSettings } from './Button';
import { Div, DivSettings } from './Div';
import { DropAreaNode } from './DropArea';
import { DropSpanNode } from './DropSpan';
import { TypographySettings, Typography } from './Typography';

export { DropArea, DropAreaContainer } from './DropArea';
export { DropSpan } from './DropSpan';

export const setupBasicComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: TypographySettings,
    component: Typography,
    name: 'Typography',
  });

  pkg.createComponent({
    type: 'native',
    settings: ButtonSettings,
    component: Button,
    name: 'Button',
    dependencies: [{ name: 'Typography', namespace: pkg.namespace }],
  });

  pkg.createComponent({
    type: 'native',
    settings: DivSettings,
    component: Div,
    name: 'Div',
    dependencies: [{ name: 'DropArea', namespace: pkg.namespace }],
  });

  pkg.createComponent({
    type: 'native',
    component: DropAreaNode,
    name: 'DropArea',
  });
  pkg.createComponent({
    type: 'native',
    component: DropSpanNode,
    name: 'DropSpan',
  });
};
