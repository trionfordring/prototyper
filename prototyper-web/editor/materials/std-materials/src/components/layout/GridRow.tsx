import { Element } from '@prototyper/core';
import {
  AutoCompleteSetter,
  SetterForm,
  SliderSetter,
} from '@prototyper/editor';
import { Row } from 'antd';
import React from 'react';

import { GridCol } from './GridCol';

import { useConnectors } from '../../utils/useConnectors';
import { usePlaceholder } from '../../utils/usePlaceholder';
import { DropAreaContainer } from '../basic';

export const GridRow = ({ colNum, ...props }: { colNum: number }) => {
  const { connectAndDrag } = useConnectors();
  const cols = usePlaceholder(
    <DropAreaContainer>点此编辑栅格</DropAreaContainer>,
    () => {
      const nodes = [];
      for (let i = 0; i < colNum; i++) {
        const id = `col_${i}`;
        nodes.push(
          <Element
            key={id}
            id={id}
            is={GridCol as any}
            canvas
            span={Math.floor(24 / colNum)}
          />
        );
      }
      return nodes.length > 0 ? nodes : null;
    }
  );
  return (
    <Row {...props} ref={connectAndDrag}>
      {cols}
    </Row>
  );
};

export const GridRowSettings = () => {
  return (
    <SetterForm>
      <SliderSetter
        propName="colNum"
        label="栅格数"
        placeholder="输入数字(<=24)"
        max={24}
        min={0}
      />
      <SliderSetter
        propName="gutter"
        label="栅格间隔"
        placeholder="输入数字(px)"
        max={64}
        min={0}
      />
      <AutoCompleteSetter
        propName="align"
        label="垂直对齐"
        options={[
          { value: 'top', label: 'top(顶部对齐)' },
          { value: 'middle', label: 'middle(居中对齐)' },
          { value: 'bottom', label: 'bottom(底部对齐)' },
          { value: 'stretch', label: 'stretch(拉伸)' },
        ]}
        placeholder="默认为top"
      />
      <AutoCompleteSetter
        propName="justify"
        label="水平排列"
        options={[
          { value: 'start', label: 'start(左对齐)' },
          { value: 'end', label: 'end(右对齐)' },
          { value: 'center', label: 'center(居中)' },
          { value: 'space-around', label: 'space-around' },
          { value: 'space-between', label: 'space-between' },
          { value: 'space-evenly', label: 'space-evenly' },
        ]}
        placeholder="默认为start"
      />
    </SetterForm>
  );
};
