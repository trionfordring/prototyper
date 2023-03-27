import { ComponentPackage } from '@prototyper/core';

import { Button, ButtonSettings } from './Button';
import { Div, DivSettings } from './Div';
import { DropAreaNode } from './DropArea';
import { DropSpanNode } from './DropSpan';
import { HTMLText, HTMLTextSettings } from './HTMLText';
import { SlotBlock, SlotSettings } from './SlotBlock';
import { SlotSpan } from './SlotSpan';
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
    dependencies: [{ name: 'HTMLText', namespace: pkg.namespace }],
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

  pkg.createComponent({
    type: 'native',
    component: HTMLText,
    settings: HTMLTextSettings,
    name: 'HTMLText',
  });

  pkg.createComponent({
    type: 'native',
    component: SlotBlock,
    settings: SlotSettings,
    name: 'SlotBlock',
    dependencies: [{ name: 'DropArea', namespace: pkg.namespace }],
  });
  pkg.createComponent({
    type: 'native',
    component: SlotSpan,
    settings: SlotSettings,
    name: 'SlotSpan',
    dependencies: [{ name: 'DropSpan', namespace: pkg.namespace }],
  });
};
