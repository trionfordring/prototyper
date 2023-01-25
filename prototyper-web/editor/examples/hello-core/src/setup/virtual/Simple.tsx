import { ComponentPackage, ProtoWarpperProps } from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';
import { useState } from 'react';
import styled from 'styled-components';

export const setupSimple = (pkg: ComponentPackage) => {
  pkg.createComponent({
    name: 'TestVirtualComp',
    type: 'virtual',
    settings: () => {
      return (
        <SetterForm>
          <TextSetter
            propName="color"
            label="背景颜色"
            placeholder="输入背景颜色"
          ></TextSetter>
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
          text: '组件渲染器(num:#{state.num})',
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
    warpper: styled.div`
      background-color: ${({ props }: ProtoWarpperProps) => props?.color};
    `,
  });
};
