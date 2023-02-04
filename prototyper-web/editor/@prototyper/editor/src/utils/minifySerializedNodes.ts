import { SerializedNodes } from '@prototyper/core';

import { forEachSerializedNode } from './forEachSerializedNode';

export function minifySerializedNodes(tree: SerializedNodes) {
  const ret = {};
  forEachSerializedNode(tree, (node, id) => {
    ret[id] = node;
  });
  return ret;
}
