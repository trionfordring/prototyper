import {
  AutoCompleteSetter,
  BoolSetter,
  SetterForm,
  SizeSetter,
} from '@prototyper/editor';
import { SpaceProps } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { useConnectors } from '../../utils/useConnectors';
import { DropArea, DropSpan } from '../basic';

const SpaceDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
`;
const SpaceSpan = styled.span`
  display: inline-flex;
  flex-direction: row;
  gap: 4px;
  padding: 0 4px;
`;

export const Space = ({
  children,
  ...props
}: PropsWithChildren<SpaceProps>) => {
  const { connectAndDrag } = useConnectors();
  const vertical = props.direction === 'vertical';
  if (vertical) {
    return (
      <SpaceDiv ref={connectAndDrag}>
        <DropArea>{children}</DropArea>
      </SpaceDiv>
    );
  }
  return (
    <SpaceSpan ref={connectAndDrag}>
      <DropSpan label="拖拽到这里" dragoverLabel="在这里松开!" noConnect>
        {children}
      </DropSpan>
    </SpaceSpan>
  );
};

export const SpaceSettings = () => {
  return (
    <SetterForm>
      <AutoCompleteSetter
        propName="align"
        label="对齐方式"
        options={[
          { value: 'start', label: 'start(头对齐)' },
          { value: 'end', label: 'end(尾对齐)' },
          { value: 'center', label: 'center(居中对齐)' },
          { value: 'baseline', label: 'baseline(基线对齐)' },
        ]}
      />
      <AutoCompleteSetter
        propName="direction"
        label="间距方向"
        options={[
          { value: 'vertical', label: 'vertical(垂直)' },
          { value: 'horizontal', label: 'horizontal(水平,默认)' },
        ]}
        placeholder="默认为水平方向"
      />
      <SizeSetter />
      <BoolSetter
        propName="warp"
        label="自动换行"
        placeholder="仅在水平排列时有效"
      />
    </SetterForm>
  );
};
