import {
  AutoCompleteSetter,
  BoolSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Divider as AntdDivider } from 'antd';
import React from 'react';
import { PropsWithChildren } from 'react';

import { useConnectors } from '../../utils/useConnectors';
import { DropSpan } from '../basic';

export const Divider = ({ children, ...props }: PropsWithChildren) => {
  const { connectAndDrag } = useConnectors();
  return (
    <div ref={connectAndDrag}>
      <AntdDivider {...props}>
        <DropSpan label="标题" dragoverLabel="松开!">
          {children}
        </DropSpan>
      </AntdDivider>
    </div>
  );
};

export const DividerSettings = () => {
  return (
    <SetterForm>
      <TextSetter propName="className" label="类名" singleLine />

      <BoolSetter propName="dashed" label="虚线" />
      <AutoCompleteSetter
        propName="orientation"
        label="标题位置"
        options={[
          { value: 'left', label: 'left(居左)' },
          { value: 'right', label: 'right(居右)' },
          { value: 'center', label: 'center(居中)' },
        ]}
        placeholder="默认为center"
      />
      <TextSetter propName="orientationMargin" label="标题边距" />
      <BoolSetter propName="plain" label="文字普通样式" />
      <AutoCompleteSetter
        propName="type"
        label="方位类型"
        options={[
          { value: 'horizontal', label: 'horizontal(水平分割线)' },
          { value: 'vertical', label: 'vertical(垂直分割线)' },
        ]}
        placeholder="默认为horizontal"
      />
    </SetterForm>
  );
};
