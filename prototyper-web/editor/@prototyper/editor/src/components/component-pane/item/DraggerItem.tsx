import { ProtoDragger } from '@prototyper/core';
import { Typography } from 'antd';
import React, { PropsWithChildren, forwardRef } from 'react';
import styled from 'styled-components';

import { getSupportDraggerByType } from './draggers';

const ItemBox = styled.div`
  min-width: 5.2em;
  min-height: 6.3em;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin: 1px;
  border: 1px solid #f0f0f0;
  padding: 1px;
`;

const ItemContent = styled.div`
  flex-grow: 1;
  min-width: 5em;
  min-height: 5em;
  overflow: hidden;
  position: relative;
`;

const ItemTitle = styled(Typography.Text)`
  text-align: center;
  line-height: 1.8em;
`;

export const DraggerItem = forwardRef<
  HTMLDivElement,
  { dragger: ProtoDragger }
>(({ dragger }, ref) => {
  const Content = getSupportDraggerByType(dragger.type);
  if (!Content)
    throw new Error(`找不到dragger[type=${dragger.type}]对应类型的渲染器`);
  return (
    <DraggerItemBox ref={ref} label={dragger.label}>
      <Content dragger={dragger} />
    </DraggerItemBox>
  );
});

export const DraggerItemBox = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ label: React.ReactNode }>
>(({ children, label }, ref) => {
  return (
    <ItemBox ref={ref}>
      <ItemContent>{children}</ItemContent>
      <ItemTitle ellipsis={true}>{label}</ItemTitle>
    </ItemBox>
  );
});
