import { ComponentPackage } from '@prototyper/core';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Text } from '../components/Text';

export function setupComponents(pkg: ComponentPackage) {
  pkg.createComponent({
    name: 'Container',
    component: Container,
    type: 'native',
  });
  pkg.createComponent({
    name: 'Text',
    component: Text,
    type: 'native',
  });
  pkg.createComponent({
    name: 'Button',
    component: Button,
    type: 'native',
  });
  pkg.createComponent({
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
          textExpr: '组件渲染器(num:#{state.num})',
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
          textExpr: '父组件传入参数num=#{props.numExpr}',
          onClick:
            'props.onClick || (()=>{ console.log("子组件的onclick被触发了，但父组件未传入处理函数~") })',
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
          textExpr: '子组件的数据num=#{state.num}',
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
}
