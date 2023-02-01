import { pick } from 'lodash';
enum PosKeys {
  'top',
  'left',
}
type PosKey = keyof typeof PosKeys;
enum ShapeKeys {
  'width',
  'height',
}
const RectKeys = {
  ...ShapeKeys,
  ...PosKeys,
};
type RectKey = Exclude<keyof typeof RectKeys, number>;
const RECT_KEYS = Object.keys(RectKeys) as RectKey[];

export type NodePos = {
  [k in PosKey]: number;
};
export type NodeRect = {
  [k in RectKey]: number;
};
export function newNodeRect(rect: DOMRect): NodeRect {
  return pick(rect, RECT_KEYS);
}
