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
  padding: 1px;
`;

const ItemContent = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ItemTitle = styled(Typography.Text)`
  text-align: center;
  line-height: 1.8em;
`;

export function ComponentPaneItem({ dragger }: { dragger: ProtoDragger }) {
  const Content = getSupportDraggerByType(dragger.type);
  if (!Content)
    throw new Error(`找不到dragger[type=${dragger.type}]对应类型的渲染器`);
  const descriptor = dragger.descriptor;
  const applicationContext = useApplicationContext();
  const {
    connectors: { create },
  } = useEditor();
  const protoComponent = applicationContext.getComponent(descriptor);
  if (!protoComponent) return <></>;
  let component;
  let props: Record<string, any> = {};
  let custom: Record<string, any>;
  if (protoComponent.type === 'native') {
    props = dragger.compProps;
    component = protoComponent.component;
    if (!component) {
      console.error(
        `组件[${descriptor.namespace}.${descriptor.name}]的类型为native,但未配置渲染函数!`
      );
      return null;
    }
    custom = {
      displayName: dragger.label,
      propsMapper: dragger.compPropsMapper,
    };
  } else {
    props = {
      props: dragger.compProps,
      descriptor: protoComponent.descriptor,
    };
    custom = {
      displayName: dragger.label,
      propsMapper: dragger.compPropsMapper,
    };
    component = ComponentRenderer;
  }
  return (
    <ItemBox
      ref={(ref) =>
        create(
          ref!,
          <Element
            {...props}
            is={component}
            canvas={dragger.canvas}
            custom={custom}
          />
        )
      }
    >
      <ItemContent>
        <Content dragger={dragger} />
      </ItemContent>
      <ItemTitle ellipsis={true}>{dragger.label}</ItemTitle>
    </ItemBox>
  );
}
