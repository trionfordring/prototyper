import {
  ComponentRenderer,
  Element,
  ProtoDragger,
  useApplicationContext,
  useEditor,
} from '@prototyper/core';
import React from 'react';

import { DraggerItem } from './DraggerItem';

export function ComponentPaneItem({ dragger }: { dragger: ProtoDragger }) {
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
    <DraggerItem
      dragger={dragger}
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
    />
  );
}
