import { Collapse } from 'antd';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { ComponentInfo } from './info';
import { NodeSettings } from './settings/NodeSettings';
import { RootSettings } from './settings/RootSettings';

const Panel = styled.div`
  width: 400px;
  margin: 0 5px;
  overflow: auto;
  margin-left: auto;
  height: fit-content;
  position: relative;
  z-index: 15;
  max-height: calc(100vh - 64px);
`;

const EditorRight: FC = () => {
  const [currentNode, setCurrentNode] = useState('');
  const onNodeSelected = (node?: { name: string; id: string }) => {
    if (node) setCurrentNode(` - ${node.name}[${node.id}]`);
    else setCurrentNode('');
  };
  return (
    <Panel>
      <Collapse defaultActiveKey={['info', 'settings']}>
        <Collapse.Panel header="组件信息" key="info">
          <ComponentInfo></ComponentInfo>
        </Collapse.Panel>
        <Collapse.Panel header="组件设置" key="component-settings">
          <RootSettings></RootSettings>
        </Collapse.Panel>
        <Collapse.Panel header={`节点设置${currentNode}`} key="settings">
          <NodeSettings onSelected={onNodeSelected}></NodeSettings>
        </Collapse.Panel>
      </Collapse>
    </Panel>
  );
};

export default EditorRight;
