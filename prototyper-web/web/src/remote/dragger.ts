import { fragment } from '@/utils/fragments';
import { ResponseFragmentType, responseRelationCollection } from './fragments';
import {
  FragmentUploadFileEntity,
  resolveUploadFileEntity,
} from './uploadFile';
import { Merge } from '@/types/api';
import { Dragger } from '@/types/dragger';
import { ResourceUrl } from '@/types/resourcePackage';
import { isNil } from 'lodash';

export const FragmentDragger = fragment`
fragment dragger on Dragger {
  label
  type
  canvas
  draggerProps
  compProps
  compPropsMapper
  component {
    namespace
    name
  }
  publishedAt
  createdAt
  updatedAt
  
  category
  subcategory
  order
  img {
    ...${FragmentUploadFileEntity}
  }
  imgSize
}
`;
export type FragmentDraggerType = Merge<
  Dragger,
  {
    img: ResponseFragmentType<ResourceUrl>;
  }
>;

export const FragmentDraggerCollection = responseRelationCollection(
  'Dragger',
  FragmentDragger
);

export function resolveFragmentDragger(
  draggerData: FragmentDraggerType
): Dragger;
export function resolveFragmentDragger(
  draggerData?: FragmentDraggerType
): Dragger | undefined {
  if (isNil(draggerData)) return undefined;
  const { img, ...others } = draggerData;
  return {
    ...others,
    img: resolveUploadFileEntity(img.data),
  };
}
