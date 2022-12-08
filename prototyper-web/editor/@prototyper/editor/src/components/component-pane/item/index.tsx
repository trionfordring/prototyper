import {
  ComponentRenderer,
  Element,
  ProtoDragger,
  useApplicationContext,
  useEditor,
} from '@prototyper/core';
import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { getSupportDraggerByType } from './draggers';

const ItemBox = styled.div`
  width: 5rem;
  height: 6rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin: 1px;
  border: 1px solid #f0f0f0;
`;

const ItemContent = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ItemTitle = styled(Typography.Text)`
  text-align: center;
`;

export function ComponentPaneItem({ dragger }: { dragger: ProtoDragger }) {
  const Content = getSupportDraggerByType(dragger.type);
  const descriptor = dragger.descriptor;
  const ApplicationContext = useApplicationContext();
  const {
    connectors: { create },
  } = useEditor();
  const protoComponent = ApplicationContext.getComponent(descriptor);
  let Component;
  let props: Record<string, any> = {};
  if (protoComponent.type === 'native') {
    props = dragger.compProps;
    Component = protoComponent.component;
    if (!Component) {
      console.error(
        `组件[${descriptor.namespace}.${descriptor.name}]的类型为native,但未配置渲染函数!`
      );
      return null;
    }
  } else {
    props = {
      props: dragger.compProps,
      descriptor: protoComponent.descriptor,
    };
    Component = ComponentRenderer;
  }
  return (
    <ItemBox
      ref={(ref) =>
        create(
          ref,
          <Element is={Component} canvas={dragger.canvas} {...props} />
        )
      }
    >
      <ItemContent>
        <Content dragger={dragger} />
      </ItemContent>
      <ItemTitle>{dragger.label}</ItemTitle>
    </ItemBox>
  );
}
