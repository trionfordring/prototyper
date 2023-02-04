import {
  ApartmentOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { ProtoDragger } from '@prototyper/core';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Activitybar } from './Activitybar';

import { ComponentPane } from '../../components/component-pane';
import { Layers } from '../../components/layers';

const SideBar = styled(Activitybar)`
  height: calc(98vh - 32px);
`;

const EditorLeft = ({ draggers }: { draggers: ProtoDragger[] }) => {
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
        return <ComponentPane draggers={draggers}></ComponentPane>;
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

      {activePane}
    </React.Fragment>
  );
};

export default EditorLeft;
