import { ProtoComponent, WithDescriptor } from '@prototyper/core';
import { Collapse } from 'antd';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { ComponentInfo } from './info';
import { NodeSettings } from './settings/NodeSettings';
import { RootSettings } from './settings/RootSettings';

import { SerializedSettings } from '../../types/SerializedSettings';

const Content = styled.div`
  width: 450px;
  pointer-events: auto;
  z-index: 15;
`;

const Panel = styled.div`
  padding-left: 310px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: auto;
  height: fit-content;
  position: relative;
  max-height: calc(100vh - 64px);
  z-index: 1;
`;

const EditorRight: FC<{
  onEditComponentSettings?: (
    component: ProtoComponent & Partial<WithDescriptor>
  ) => void;
  onSettingsMetaChange?: (settingsMeta?: SerializedSettings) => void;
}> = ({ onEditComponentSettings, onSettingsMetaChange }) => {
  const [currentNode, setCurrentNode] = useState('');
  const onNodeSelected = (node?: { name: string; id: string }) => {
    if (node) setCurrentNode(` - ${node.name}[${node.id}]`);
    else setCurrentNode('');
  };
  return (
    <Panel>
      <Content>
        <Collapse defaultActiveKey={['info', 'settings']}>
          <Collapse.Panel header="组件信息" key="info">
            <ComponentInfo></ComponentInfo>
          </Collapse.Panel>
          <Collapse.Panel header="组件设置" key="component-settings">
            <RootSettings
              onSettingsMetaChange={onSettingsMetaChange}
              onEditComponentSettings={onEditComponentSettings}
            ></RootSettings>
          </Collapse.Panel>
          <Collapse.Panel header={`节点设置${currentNode}`} key="settings">
            <NodeSettings onSelected={onNodeSelected}></NodeSettings>
          </Collapse.Panel>
        </Collapse>
      </Content>
    </Panel>
  );
};

export default EditorRight;
