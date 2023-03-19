import { isNil } from 'lodash';
import { Entity } from './fragments';

export function unwarpEntity(): undefined;
export function unwarpEntity<T, I>(entity?: Entity<T, I>): T & { id: I };
export function unwarpEntity<T, I>(entity?: Entity<T, I>) {
  if (isNil(entity)) {
    return entity;
  } else
    return {
      id: entity.id,
      ...entity.attributes,
    };
}
