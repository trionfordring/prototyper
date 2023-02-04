import {
  ComponentDescriptor,
  SerializedNodes,
  useComponentContext,
  useEditor,
} from '@prototyper/core';
import { Button, Space, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { forEachSerializedNode } from '../../utils/forEachSerializedNode';
import { minifySerializedNodes } from '../../utils/minifySerializedNodes';

const Header = styled.div`
  min-width: 600px;
  padding: 0 24px;
  margin: 5px auto;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const Title = styled.h1`
  margin-bottom: 0;
  margin-top: 0;
`;

const Center = styled.div`
  flex-grow: 1;
  max-width: 1600px;
`;
const Item = styled.div`
  margin: 0 auto;
  padding: 0 24px;
`;

const Right = styled.div`
  justify-self: flex-end;
`;

const EditorHeader = () => {
  const { query } = useEditor();
  const { component } = useComponentContext();
  function save() {
    const nodes: SerializedNodes = minifySerializedNodes(
      query.getSerializedNodes()
    );
    const depsSet = new Set<string>();
    forEachSerializedNode(nodes, (node) => {
      depsSet.add(node.type['resolvedName']);
    });
    const deps: ComponentDescriptor[] = Array.from(depsSet)
      .filter((dep) => dep.includes('.'))
      .map((dep) => {
        const [namespace, name] = dep.split('.');
        return {
          namespace,
          name,
        };
      });
    console.log('节点树', nodes);
    console.log('依赖', deps);
    navigator.clipboard
      .writeText(JSON.stringify(nodes, undefined, 4))
      .then(() => {
        console.log('已写入剪贴板');
      });
  }
  return (
    <Header>
      <Title>Editor</Title>
      <Center>
        <Item>
          <Typography.Text>
            当前组件: {component.descriptor?.name || '临时组件'}
          </Typography.Text>
        </Item>
      </Center>
      <Right>
        <Space>
          <Button type="primary" onClick={save}>
            编辑脚本
          </Button>
          <Button type="primary" onClick={save}>
            编辑样式表
          </Button>
          <Button type="primary" onClick={save}>
            保存
          </Button>
        </Space>
      </Right>
    </Header>
  );
};

export default EditorHeader;
