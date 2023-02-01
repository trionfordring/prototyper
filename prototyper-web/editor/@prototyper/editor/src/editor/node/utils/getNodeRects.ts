import { NodeIndicatorDescriptor } from './NodeIndicatorDescriptor';
import { newNodeRect } from './NodeRect';

import { consumeProvider, Provider } from '../../../utils/Provider';

export function getNodeRects(searchRootDom: Provider<HTMLElement>) {
  return (node: NodeIndicatorDescriptor) => {
    const { id } = node;
    const root = consumeProvider(searchRootDom);
    const rects = Array.from(root.querySelectorAll(`[nodeid="${id}"]`))
      .map((dom) => dom.getBoundingClientRect())
      .filter((rect) => rect.height > 0 && rect.width > 0)
      .map(newNodeRect);
    return rects;
  };
}
