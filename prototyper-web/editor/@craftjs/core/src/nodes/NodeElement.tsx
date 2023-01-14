import React, { useMemo } from 'react';

import { NodeProvider } from './NodeContext';

import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeId } from '../interfaces';
import { useInternalNode } from '../nodes/useInternalNode';
import { SimpleElement } from '../render/SimpleElement';

export type NodeElementProps = {
  id: NodeId;
  render?: React.ReactElement;
};

export const NodeElement: React.FC<
  React.PropsWithChildren<NodeElementProps>
> = ({ id, render }) => {
  return (
    <NodeProvider id={id}>
      <RenderNodeToElement render={render} />
    </NodeProvider>
  );
};

type RenderNodeToElementType = {
  render?: React.ReactElement;
};
export const RenderNodeToElement: React.FC<
  React.PropsWithChildren<RenderNodeToElementType>
> = ({ render }) => {
  const { hidden } = useInternalNode((node) => ({
    hidden: node.data.hidden,
  }));

  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));

  // don't display the node since it's hidden
  if (hidden) {
    return null;
  }

  return React.createElement(onRender, { render: render || <DefaultRender /> });
};

export const DefaultRender = () => {
  const { type, props, nodes, hydrationTimestamp } = useInternalNode(
    (node) => ({
      type: node.data.type,
      props: node.data.props,
      nodes: node.data.nodes,
      hydrationTimestamp: node._hydrationTimestamp,
    })
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

    const render = React.createElement(type, props, children);

    if (typeof type == 'string') {
      return <SimpleElement render={render} />;
    }

    return render;
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [type, props, hydrationTimestamp, nodes]);
};
