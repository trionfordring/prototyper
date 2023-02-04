import { pick } from 'lodash';

type ExtractArray<T> = T extends ReadonlyArray<infer E> ? E : never;
type AsKey<T> = T extends string | number | symbol ? T : never;
type RecordFromArray<K, V> = { [key in AsKey<ExtractArray<K>>]: V };

const POS_KEYS = ['top', 'left'] as const;
const SHAPE_KEYS = ['width', 'height'] as const;
const RECT_KEYS = [...POS_KEYS, ...SHAPE_KEYS] as const;

export type NodePos = RecordFromArray<typeof POS_KEYS, number>;
export type NodeRect = RecordFromArray<typeof RECT_KEYS, number>;
export function newNodeRect(rect: DOMRect): NodeRect {
  return pick(rect, RECT_KEYS);
}
