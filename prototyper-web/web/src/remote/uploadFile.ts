import { fragment } from '@/utils/fragments';
import {
  Entity,
  responseFragment,
  responseRelationCollection,
} from './fragments';
import { ResourceUrl } from '@/types/resourcePackage';
import { Nil } from '@/types/api';
import { isNil } from 'lodash';
import { unwarpEntity } from './utils';

export const FragmentUploadFile = fragment`
fragment uploadFile on UploadFile {
  name
  ext
  mime
  size
  url
  provider
  width
  height
}
`;

export const FragmentUploadFileEntity = responseFragment(
  'UploadFile',
  FragmentUploadFile
);

export const FragmentUploadFileCollection = responseRelationCollection(
  'UploadFile',
  FragmentUploadFile
);

export type FragmentUploadFileType = ResourceUrl;

export type FragmentUploadFileEntityType = Entity<FragmentUploadFileType>;

export function resolveUploadFileEntity(
  entity: FragmentUploadFileEntityType
): ResourceUrl;
export function resolveUploadFileEntity(
  entity?: FragmentUploadFileEntityType
): ResourceUrl | Nil {
  if (isNil(entity)) return entity;
  return unwarpEntity(entity);
}
