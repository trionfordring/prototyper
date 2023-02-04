import { ROOT_NODE, SerializedNode, SerializedNodes } from '@prototyper/core';

export function forEachSerializedNode(
  tree: SerializedNodes,
  cb: (node: SerializedNode, id: string) => void
) {
  function iterNode(node?: SerializedNode, id?: string) {
    if (!node || !id) return;
    cb(node, id);
    node.nodes.forEach((cid) => iterNode(tree[cid], cid));
    Object.keys(node.linkedNodes)
      .map((k) => node.linkedNodes[k])
      .forEach((cid) => iterNode(tree[cid], cid));
  }
  iterNode(tree[ROOT_NODE], ROOT_NODE);
}
