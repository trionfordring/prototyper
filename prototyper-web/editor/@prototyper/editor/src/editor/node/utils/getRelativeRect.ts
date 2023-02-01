import { NodePos } from './NodeRect';

export function getRelativeRect(basePos: NodePos) {
  return <T extends NodePos>(pos: T): T => {
    return {
      ...pos,
      top: pos.top - basePos.top,
      left: pos.left - basePos.left,
    };
  };
}
