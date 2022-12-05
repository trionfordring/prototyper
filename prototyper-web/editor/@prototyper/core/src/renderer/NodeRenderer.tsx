import { NodeElement, NodeId, useNode } from '@craftjs/core';
import React, { FC, useMemo } from 'react';

import { defaultMapProps } from '../component/mapProps';
import { useComponentContext } from '../context';
import { useProtoExprContext } from '../hook/useProtoExprContext';

export const NodeRenderer: FC = () => {
  const { type, props, nodes, hydrationTimestamp, id } = useNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    nodes: node.data.nodes,
    hydrationTimestamp: node._hydrationTimestamp,
    id: node.id,
  }));
  const componentContext = useComponentContext();
  const exprContext = useProtoExprContext();
  const realProps = (componentContext.component.mapProps || defaultMapProps)(
    props,
    exprContext
  );

  return useMemo(() => {
    let children = props.children;

    if (nodes && nodes.length > 0) {
      children = (
        <React.Fragment>
          {nodes.map((id: NodeId) => (
            <NodeElement id={id} key={id} />
          ))}
        </React.Fragment>
      );
    }

    if (id === 'ROOT') return children;

    const render = React.createElement(type, realProps, children);

    if (typeof type == 'string') {
      return <SimpleElement render={render} />;
    }

    return render;
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [type, realProps, hydrationTimestamp, nodes]);
};

export const SimpleElement = ({ render }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return typeof render.type === 'string'
    ? connect(drag(React.cloneElement(render)))
    : render;
};
