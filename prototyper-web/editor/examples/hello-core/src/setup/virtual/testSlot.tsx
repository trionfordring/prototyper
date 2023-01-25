import { ComponentPackage } from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';
import { useState } from 'react';

export const testSlot = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'virtual',
    name: 'TestSlot',
    dependencies: [
      { namespace: 'hello', name: 'Text' },
      { namespace: 'hello', name: 'Container' },
      { namespace: 'hello', name: 'Button' },
      { namespace: 'hello', name: 'Slot' },
    ],
    settings: () => {
      return (
        <SetterForm>
          <TextSetter propName="numVal" label="数字"></TextSetter>
          <TextSetter propName="onClick" label="当点击"></TextSetter>
        </SetterForm>
      );
    },
    useSetupStates: () => {
      const [num, setNum] = useState(1);
      return {
        num,
        add: (offset = 1) =>
          setNum((n) => n + (typeof offset === 'number' ? offset : 1)),
      };
    },
    virtualDom: {
      ROOT: {
        type: {
          resolvedName: 'ComponentRenderer',
        },
        isCanvas: true,
        props: {},
        displayName: 'ROOT',
        custom: {},
        hidden: false,
        nodes: ['t1', 'TjKkBYxGo_', 'b1', 'b2'],
        linkedNodes: {},
      },
      t1: {
        type: {
          resolvedName: 'hello.Text',
        },
        isCanvas: false,
        props: {
          text: '组件渲染器(num:#{state.num})',
        },
        displayName: 't1',
        custom: {},
        parent: 'ROOT',
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
      b1: {
        type: {
          resolvedName: 'hello.Button',
        },
        isCanvas: false,
        props: {
          textExpr: '父组件传入参数num=#{props.numVal}',
          onClick:
            'props.onClick || (()=>{ console.log("子组件的onclick被触发了，但父组件未传入处理函数~") })',
        },
        displayName: 'b1',
        custom: {},
        parent: 'ROOT',
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
      b2: {
        type: {
          resolvedName: 'hello.Button',
        },
        isCanvas: false,
        props: {
          textExpr: '子组件的数据num=#{state.num}',
          onClick: 'state.add',
        },
        displayName: 'b2',
        custom: {},
        parent: 'ROOT',
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
      TjKkBYxGo_: {
        type: {
          resolvedName: 'hello.Slot',
        },
        isCanvas: false,
        props: {},
        displayName: 'Slot',
        custom: {},
        parent: 'ROOT',
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    },
  });
  pkg.addDragger({
    descriptor: {
      namespace: 'hello',
      name: 'TestSlot',
    },
    type: 'native',
    label: '带有插槽的组件',
  });
};
