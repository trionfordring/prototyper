import { Segmented, Typography } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { IconCursor } from '../../icons/IconCursor';
import { IconDrag } from '../../icons/IconDrag';
import { IconPlay } from '../../icons/IconPlay';

export type CanvasMode = 'edit' | 'drag' | 'preview';

const StyledSegmented = styled(Segmented)`
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%),
    0 2px 4px 0 rgb(0 0 0 / 2%);
`;

const SliderBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 50px;
  user-select: none;
  z-index: 100;
`;

const Icon = styled.div`
  height: 18px;
  width: 18px;
  padding: 5px;
`;

export function ModeSlider({
  mode,
  setMode,
}: {
  mode: CanvasMode;
  setMode: (mode: CanvasMode) => void;
}) {
  const tooltip = useMemo(() => {
    switch (mode) {
      case 'edit':
        return '正在编辑组件...';
      case 'drag':
        return '正在编辑画布...';
      case 'preview':
        return '正在预览组件...';
    }
  }, [mode]);
  return (
    <SliderBox>
      <StyledSegmented
        value={mode}
        onChange={setMode}
        options={[
          {
            icon: (
              <Icon>
                <IconCursor />
              </Icon>
            ),
            value: 'edit',
          },
          {
            icon: (
              <Icon>
                <IconDrag />
              </Icon>
            ),
            value: 'drag',
          },
          {
            icon: (
              <Icon>
                <IconPlay />
              </Icon>
            ),
            value: 'preview',
          },
        ]}
      />
      <div>
        <Typography.Text type="secondary">{tooltip}</Typography.Text>
      </div>
    </SliderBox>
  );
}
