import { ComponentPackage } from '@prototyper/core';

import { Button, ButtonSettings } from '../components/Button';
import { Card } from '../components/Card';
import { Container, ContainerSettings } from '../components/Container';
import { DropArea } from '../components/DropArea';
import { Slot, SlotSettings } from '../components/Slot';
import { Text, TextSettings } from '../components/Text';

export function setupComponents(pkg: ComponentPackage) {
  pkg.createComponent({
    name: 'Container',
    component: Container,
    settings: ContainerSettings,
    type: 'native',
  });
  pkg.createComponent({
    name: 'Text',
    component: Text,
    settings: TextSettings,
    type: 'native',
  });
  pkg.createComponent({
    name: 'Button',
    component: Button,
    settings: ButtonSettings,
    type: 'native',
  });
  pkg.createComponent({
    name: 'Card',
    component: Card,
    settings: ContainerSettings,
    type: 'native',
  });
  pkg.createComponent({
    name: 'DropArea',
    component: DropArea,
    type: 'native',
  });
  pkg.createComponent({
    name: 'Slot',
    component: Slot,
    settings: SlotSettings,
    type: 'native',
  });
}
