import { Button, Space } from 'antd';
import { noop } from 'lodash';
import React from 'react';
import { Props as RndProps } from 'react-rnd';
import styled from 'styled-components';

const Header = styled.div.attrs({
  height: '48px',
})`
  position: relative;
  z-index: 10;
  background-color: #fff;
  min-width: 600px;
  padding: 0 24px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => props.height};
`;

const Title = styled.h1`
  margin-bottom: 0;
  margin-top: 0;
`;

const Center = styled.div`
  flex-grow: 1;
  max-width: 1600px;
`;

const Right = styled(Space)`
  justify-self: flex-end;
`;

function format(content: string | number) {
  if (typeof content === 'number') {
    return content.toFixed(1);
  }
  return content;
}

export type EditorMode = 'edit-canvas' | 'edit-script' | 'edit-container';

const EditorHeader = ({
  height,
  size,
  setSize,
  mode = 'edit-canvas',
  setMode = noop,
  onSave = noop,
}: {
  height?: string;
  size: RndProps['size'];
  setSize: (size: RndProps['size']) => void;

  mode?: EditorMode;
  setMode?: (mode: EditorMode) => void;
  onSave?: () => void;
}) => {
  return (
    <Header height={height}>
      <Title>Editor</Title>
      <Center></Center>
      <Right>
        {mode === 'edit-canvas' && (
          <Button type="dashed">{`画布尺寸: ${format(size.height)} x ${format(
            size.width
          )}`}</Button>
        )}
        {mode !== 'edit-script' && (
          <Button type="primary" onClick={() => setMode('edit-script')}>
            编辑脚本
          </Button>
        )}
        {mode !== 'edit-container' && (
          <Button type="primary" onClick={() => setMode('edit-container')}>
            编辑样式表
          </Button>
        )}
        {mode !== 'edit-canvas' && (
          <Button type="primary" onClick={() => setMode('edit-canvas')}>
            返回画布
          </Button>
        )}
        {mode === 'edit-canvas' && (
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        )}
      </Right>
    </Header>
  );
};

export default EditorHeader;
