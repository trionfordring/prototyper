import { Collapse } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ComponentSettings } from './settings';

const Panel = styled.div`
  min-width: 300px;
  margin: 0 5px;
  height: auto;
`;

const EditorRight: FC = () => {
  return (
    <Panel>
      <Collapse>
        <Collapse.Panel header="组件设置" key="settings">
          <ComponentSettings></ComponentSettings>
        </Collapse.Panel>
      </Collapse>
    </Panel>
  );
};

export default EditorRight;
