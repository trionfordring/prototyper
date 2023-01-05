import { NodeElement, NodeId, useNode } from '@craftjs/core';
import React, { FC, useMemo } from 'react';

import { RenderError } from './RenderError';
import { RenderFailback } from './RenderFailback';

import { DefaultComponentWarpper } from '../component/DefaultComponentWarpper';
import { defaultMapProps } from '../component/mapProps';
import { useComponentContext } from '../context';
import { useProtoExprContext } from '../hook/useProtoExprContext';

export const NodeRenderer: FC = () => {
  const {
    type,
    props,
    nodes,
    hydrationTimestamp,
    id,
    connectors: { connect },
    name,
  } = useNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    nodes: node.data.nodes,
    hydrationTimestamp: node._hydrationTimestamp,
    id: node.id,
    name: node.data.displayName,
  }));
  const componentContext = useComponentContext();
  const exprContext = useProtoExprContext();
  const protoComponent = componentContext.component;
  const isRoot = id === 'ROOT';
  const isAppRoot = isRoot && componentContext.root;
  const [realProps, propsMapError] = useMemo(() => {
    try {
      return [
        (protoComponent.mapProps || defaultMapProps)(props || {}, exprContext),
        null,
      ];
    } catch (e) {
      return [null, `节点[${name}]的属性计算失败: ${e.message || e}`];
    }
  }, [exprContext, protoComponent.mapProps, props]);
  const node = useMemo(() => {
    if (propsMapError) {
      return <RenderError msg={propsMapError}></RenderError>;
    }
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

    if (isAppRoot) {
      const Warpper = (protoComponent.warpper ||
        DefaultComponentWarpper) as any;
      return (
        <Warpper
          ref={(ref) => connect(ref)}
          props={realProps}
          className={protoComponent.className}
          editing={componentContext.editing}
          descriptor={protoComponent.descriptor}
          root
        >
          {children}
        </Warpper>
      );
    } else if (isRoot) {
      return children;
    }
    const render = React.createElement(type, realProps, children);

    if (typeof type == 'string') {
      return <SimpleElement render={render} />;
    }

    return render;
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [type, realProps, hydrationTimestamp, nodes, id]);
  return <RenderFailback nodeName={name}>{node}</RenderFailback>;
};

export const SimpleElement = ({ render }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return typeof render.type === 'string'
    ? connect(drag(React.cloneElement(render)))
    : render;
};
