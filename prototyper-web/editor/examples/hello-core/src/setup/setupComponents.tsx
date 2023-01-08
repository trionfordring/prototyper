import { ComponentPackage } from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';
import { useState } from 'react';

import { Button, ButtonSettings } from '../components/Button';
import { Container } from '../components/Container';
import { Text, TextSettings } from '../components/Text';

export function setupComponents(pkg: ComponentPackage) {
  pkg.createComponent({
    name: 'Container',
    component: Container,
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
    name: 'TestVirtualComp',
    type: 'virtual',
    settings: () => {
      return (
        <SetterForm virtualMode>
          <TextSetter propName="numVal" label="数字"></TextSetter>
          <TextSetter propName="onClick" label="当点击"></TextSetter>
        </SetterForm>
      );
    },
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
          textExpr: '父组件传入参数num=#{props.numVal}',
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
        add: (offset = 1) =>
          setNum((n) => n + (typeof offset === 'number' ? offset : 1)),
      };
    },
  });
}
