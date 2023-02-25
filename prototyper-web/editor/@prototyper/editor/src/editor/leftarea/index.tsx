import {
  ApartmentOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Category, ProtoDragger } from '@prototyper/core';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Activitybar } from './Activitybar';

import { ComponentPane } from '../../components/component-pane';
import { Layers } from '../../components/layers';

const SideBar = styled(Activitybar)`
  height: 100%;
  margin-right: 16rem;
`;

const Pane = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  z-index: 13;
  padding-left: 5px;
  left: 48px;
  bottom: 0;
  top: 0;
`;

const EditorLeft = ({
  draggers,
  catalogue,
}: {
  draggers: ProtoDragger[];
  catalogue?: Category[];
}) => {
  const [currentActive, setActive] = useState('ComponentPane');
  function toggle(val: string) {
    setActive((current) => {
      if (current === val) return '';
      return val;
    });
  }
  const activePane = useMemo(() => {
    switch (currentActive) {
      case 'ComponentPane':
        return (
          <ComponentPane
            draggers={draggers}
            catalogue={catalogue}
          ></ComponentPane>
        );
      case 'Layers':
        return <Layers />;
      default:
        return null;
    }
  }, [currentActive, draggers]);
  return (
    <React.Fragment>
      <SideBar
        options={[
          {
            icon: (isActived) =>
              isActived ? <FolderOpenOutlined /> : <FolderOutlined />,
            value: 'ComponentPane',
            position: 'start',
            tooltip: '组件库',
          },
          {
            icon: <ApartmentOutlined />,
            value: 'Layers',
            position: 'start',
            tooltip: '节点树',
          },
        ]}
        value={currentActive}
        onChange={toggle}
      />

      <Pane>{activePane}</Pane>
    </React.Fragment>
  );
};

export default EditorLeft;
