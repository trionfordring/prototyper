import { createPackage, globalPackagesRegistry } from '@prototyper/core';
import { useState } from 'react';

import { Button } from './components/Button';
import { Container } from './components/Container';
import { Text } from './components/Text';

export const helloPackage = createPackage('hello');

helloPackage.createComponent({
  name: 'Container',
  component: Container,
  type: 'native',
});
helloPackage.createComponent({
  name: 'Text',
  component: Text,
  type: 'native',
});
helloPackage.createComponent({
  name: 'Button',
  component: Button,
  type: 'native',
});
helloPackage.createComponent({
  name: 'TestVirtualComp',
  type: 'virtual',

  dependencies: [
    { namespace: 'hello', name: 'Text' },
    { namespace: 'hello', name: 'Container' },
    { namespace: 'hello', name: 'Button' },
  ],
  virtualDom: {
    ROOT: {
      nodes: ['t1', 'b1', 'b2'],
      hidden: false,
    },
    t1: {
      props: {
        textExpr: '组件渲染器',
      },
      isCanvas: false,
      displayName: 't1',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Text',
      },
      nodes: [],
    },
    b1: {
      props: {
        textExpr: '父组件num=#{props.numExpr}',
        onClick: 'props.onClick',
      },
      isCanvas: false,
      displayName: 'b1',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Button',
      },
      nodes: [],
    },
    b2: {
      props: {
        textExpr: '子组件num=#{state.num}',
        onClick: 'state.add',
      },
      isCanvas: false,
      displayName: 'b2',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Button',
      },
      nodes: [],
    },
  },
  useSetupStates: () => {
    const [num, setNum] = useState(1);
    return {
      num,
      add: () => setNum((n) => n + 1),
    };
  },
});

globalPackagesRegistry.addPackage(helloPackage);
