import { SetterForm, SliderSetter, TextSetter } from '@prototyper/editor';
import { Col, ColProps } from 'antd';
import React from 'react';
import { PropsWithChildren } from 'react';

import { useConnectors } from '../../utils/useConnectors';
import { DropArea } from '../basic';

export const GridCol = ({
  children,
  ...props
}: PropsWithChildren<ColProps>) => {
  const { connectAndDrag } = useConnectors();
  return (
    <Col {...props} ref={connectAndDrag}>
      <DropArea id="context">{children}</DropArea>
    </Col>
  );
};

export const GridColSettings = () => {
  return (
    <SetterForm>
      <SliderSetter
        propName="span"
        label="宽度"
        placeholder="输入数字(<=24)"
        max={24}
        min={0}
      />
      <TextSetter propName="flex" label="flex" singleLine />
      <SliderSetter
        propName="offset"
        label="向右偏移"
        placeholder="输入数字(偏移的格数)"
        max={24}
        min={0}
      />
      <TextSetter
        propName="order"
        label="栅格顺序"
        placeholder="输入数字"
        jsOnly
        singleLine
      />
      <TextSetter
        propName="pull"
        label="向左移动"
        placeholder="输入数字"
        jsOnly
        singleLine
      />
      <TextSetter
        propName="push"
        label="向右移动"
        placeholder="输入数字"
        jsOnly
        singleLine
      />
    </SetterForm>
  );
};
