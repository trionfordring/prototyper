import { ComponentPackage, ProtoWarpperProps } from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';
import { useState } from 'react';
import styled from 'styled-components';

import StdNodes from './std.json';

export const setupStd = (pkg: ComponentPackage) => {
  pkg.createComponent({
    name: 'StdComponent',
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
      { namespace: 'std', name: 'Typography' },
      { namespace: 'std', name: 'Button' },
      { namespace: 'std', name: 'Div' },
      { namespace: 'std', name: 'Divider' },
      { namespace: 'std', name: 'GridRow' },
    ],
    virtualDom: StdNodes,
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
