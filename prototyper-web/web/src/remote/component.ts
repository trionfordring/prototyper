import { fragment } from '@/utils/fragments';
import {
  Entity,
  ResponseFragmentType,
  ResponseRelationCollectionFragmentType,
  responseRelationCollection,
} from './fragments';
import { ProtoComponent } from '@/types/component';
import { Nil } from '@/types/api';
import { isNil } from 'lodash';
import { unwarpEntity } from './utils';

export const FragmentSimpleComponent = fragment`
fragment simpleComponent on Component {
  name
}`;

export const FragmentSimpleComponentCollection = responseRelationCollection(
  'Component',
  FragmentSimpleComponent
);

export const FragmentComponentDescriptor = fragment`
fragment componentDescriptor on ComponentComponentDescriptor {
  namespace
  name
}`;

export type SimpleComponentType = Pick<ProtoComponent, 'name' | 'id'>;
export type FragmentSimpleComponentType = SimpleComponentType;

export type FragmentSimpleComponentResponseType =
  ResponseFragmentType<FragmentSimpleComponentType>;

export function resolveSimpleComponent(
  data: FragmentSimpleComponentType
): SimpleComponentType;
export function resolveSimpleComponent(
  data?: FragmentSimpleComponentType
): SimpleComponentType | Nil {
  return data;
}

export function resolveSimpleComponentEntity(
  entity: Entity<FragmentSimpleComponentType>
): SimpleComponentType;
export function resolveSimpleComponentEntity(
  entity?: Entity<FragmentSimpleComponentType>
): SimpleComponentType | Nil {
  if (isNil(entity)) return entity;
  return resolveSimpleComponent(unwarpEntity(entity));
}

export type ComponentWithDataType = Pick<
  ProtoComponent,
  'name' | 'data' | 'id'
>;
export type FragmentComponentWithDataType = ComponentWithDataType;
export const FragmentComponentWithData = fragment`
fragment componentWithData on Component {
  name
  data
}`;

export const FragmentComponentWithDataCollection = responseRelationCollection(
  'Component',
  FragmentComponentWithData
);

export function resolveComponentWithData(
  c: FragmentComponentWithDataType
): ComponentWithDataType;
export function resolveComponentWithData(
  c?: FragmentComponentWithDataType
): ComponentWithDataType | undefined {
  if (isNil(c)) return c;
  return c;
}

export function resolveComponentWithDataCollection(
  v: ResponseRelationCollectionFragmentType<FragmentComponentWithDataType>
): ComponentWithDataType[];
export function resolveComponentWithDataCollection(
  v?: ResponseRelationCollectionFragmentType<FragmentComponentWithDataType>
): ComponentWithDataType[] | undefined {
  if (isNil(v)) return v;
  return v.data.map((c) => resolveComponentWithData(unwarpEntity(c)));
}
