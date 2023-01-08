import { useComponentContext, useProtoExprContext } from '@prototyper/core';
import { Descriptions } from 'antd';
import React from 'react';
import JsonView from 'react-json-view';

export const ComponentInfo = () => {
  const { component } = useComponentContext();
  const exprContext = useProtoExprContext();

  const name = component.descriptor ? (
    <Descriptions size="small" column={1}>
      <Descriptions.Item label="Namespace">
        {component.descriptor?.namespace}
      </Descriptions.Item>
      <Descriptions.Item label="组件名">
        {component.descriptor?.name}
      </Descriptions.Item>
    </Descriptions>
  ) : null;

  const context = (
    <Descriptions size="small" column={1} layout="vertical">
      <Descriptions.Item label="组件上下文对象">
        <JsonView
          src={exprContext}
          name={false}
          enableClipboard={false}
          quotesOnKeys={false}
          collapsed
        ></JsonView>
      </Descriptions.Item>
    </Descriptions>
  );

  return (
    <React.Fragment>
      {name}
      {context}
    </React.Fragment>
  );
};
