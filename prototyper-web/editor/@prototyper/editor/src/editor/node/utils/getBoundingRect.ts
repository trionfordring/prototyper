import { NodeRect } from './NodeRect';

export function getBoundingRect(a?: NodeRect, b?: NodeRect): NodeRect {
  if (!a) return b;
  if (!b) return a;
  const top = Math.min(a.top, b.top);
  const left = Math.min(a.left, b.left);
  const height = Math.max(a.top + a.height, b.top + b.height) - top;
  const width = Math.max(a.left + a.width, b.left + b.width) - left;
  return {
    top,
    left,
    height,
    width,
  };
}
