import { FileOutlined } from '@ant-design/icons';
import { ProtoDragger } from '@prototyper/core';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;
  font-size: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
`;

export function NativeDragger({ dragger }: { dragger: ProtoDragger }) {
  const NativeComponent = dragger.draggerProps?.renderer;
  const rendererProps = dragger.draggerProps?.rendererProps || {};
  if (!NativeComponent)
    return (
      <Container>
        <FileOutlined />
      </Container>
    );
  return (
    <NativeComponent {...rendererProps} dragger={dragger}></NativeComponent>
  );
}
