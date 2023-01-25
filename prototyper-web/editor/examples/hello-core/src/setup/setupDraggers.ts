import { ComponentPackage } from '@prototyper/core';

export function setupDraggers(pkg: ComponentPackage) {
  pkg.addDragger({
    type: 'native',
    descriptor: {
      namespace: 'hello',
      name: 'Container',
    },
    label: '容器',
    canvas: true,
  });
  pkg.addDragger({
    type: 'native',
    descriptor: {
      namespace: 'hello',
      name: 'Text',
    },
    label: '文本',
    compProps: {
      text: 'Hello',
    },
  });
  pkg.addDragger({
    type: 'native',
    descriptor: {
      namespace: 'hello',
      name: 'Button',
    },
    label: '按钮',
    compProps: {
      textExpr: 'button',
    },
  });
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
      name: 'Card',
    },
    label: '卡片',
    canvas: true,
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
