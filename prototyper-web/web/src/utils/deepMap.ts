import { isNil, mapValues } from 'lodash';

export function deepMapValues(
  obj: Object | null | undefined,
  callback: (v: any, key: string | number, parent: Object) => any
): any {
  if (isNil(obj)) return obj;
  if (Array.isArray(obj)) {
    return obj.map((v, index) => {
      if (typeof v === 'object') return deepMapValues(v, callback);
      return callback(v, index, obj);
    });
  }
  return mapValues(obj, (v, k) => {
    if (typeof v === 'object') return deepMapValues(v, callback);
    return callback(v, k, obj);
  });
}
