import {
  ArrowUpOutlined,
  DeleteOutlined,
  DragOutlined,
} from '@ant-design/icons';
import { useDebounceMemo } from '@prototyper/core';
import { Space } from 'antd';
import React from 'react';
import { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { NodeIndicatorDescriptor } from './utils/NodeIndicatorDescriptor';
import { getBoundingRect } from './utils/getBoundingRect';
import { getNodeRects } from './utils/getNodeRects';
import { getRelativeRect } from './utils/getRelativeRect';

import { consumeProvider, Provider } from '../../utils/Provider';

const NodeIndicatorBox = styled.div`
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  pointer-events: none;
`;
const ToolBarBox = styled.div`
  width: 100%;
`;
const ToolBar = styled(Space)`
  height: 100%;
  margin-left: -1px;
  padding: 0 0.5em;
  pointer-events: initial;
`;

const Icons = styled(Space)`
  font-size: 1.2em;
`;

export const NodeIndicator = ({
  node,
  container,
  queryRoot,
  style,
  padding: paddingProp,
  toolbarHeight: toolbarHeightProp,
  toolBar,
  relativePosition,
}: {
  node: NodeIndicatorDescriptor;
  queryRoot: Provider<HTMLElement>;
  container?: Provider<HTMLElement>;
  relativePosition?: boolean;
  style?: CSSProperties;
  padding?: number;
  toolbarHeight?: number;
  toolBar?: boolean;
}) => {
  const padding = paddingProp || 0;
  const toolbarHeight = toolbarHeightProp || 30;
  const rect = useDebounceMemo(
    () => {
      let rects = getNodeRects(queryRoot)(node);
      if (relativePosition)
        rects = rects.map(
          getRelativeRect(consumeProvider(container).getBoundingClientRect())
        );
      return rects.reduce(getBoundingRect, null);
    },
    undefined,
    100
  );
  if (!rect || rect.height === 0 || rect.width === 0) return null;
  return ReactDOM.createPortal(
    <NodeIndicatorBox
      style={{
        height: `${rect.height + padding * 2}px`,
        width: `${rect.width + padding * 2}px`,
        top: `${rect.top - padding - 1}px`,
        left: `${rect.left - padding - 1}px`,
        border: `1px dashed ${style?.backgroundColor || '#2680eb'}`,
      }}
    >
      <ToolBarBox
        ref={toolBar && node.drag ? node.drag : undefined}
        style={{
          height: `${toolbarHeight}px`,
          marginTop: `-${toolbarHeight - 1}px`,
          cursor: toolBar && node.drag ? 'pointer' : undefined,
        }}
      >
        <ToolBar
          style={{
            backgroundColor: '#2680eb',
            color: '#fff',
            ...style,
          }}
        >
          <span>{node.name}</span>
          {toolBar ? (
            <Icons size="small">
              {node.drag ? <DragOutlined /> : null}
              {node.selectParent ? (
                <ArrowUpOutlined onClick={node.selectParent} />
              ) : null}
              {node.remove ? <DeleteOutlined onClick={node.remove} /> : null}
            </Icons>
          ) : null}
        </ToolBar>
      </ToolBarBox>
    </NodeIndicatorBox>,
    consumeProvider(container)
  );
};
