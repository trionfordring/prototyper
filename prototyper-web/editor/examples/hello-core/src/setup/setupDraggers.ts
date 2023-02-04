import { ComponentPackage } from '@prototyper/core';

export function setupDraggers(pkg: ComponentPackage) {
  pkg.addDragger({
    type: 'native',
    descriptor: {
      namespace: 'hello',
      name: 'TestVirtualComp',
    },
    label: '自定义组件',
  });
  pkg.addDragger({
    type: 'native',
    descriptor: {
      namespace: 'hello',
      name: 'StdComponent',
    },
    label: 'Std库测试组件',
  });

  pkg.addDragger({
    type: 'native',
    descriptor: {
      namespace: 'hello',
      name: 'Slot',
    },
    label: '插槽',
  });
}
