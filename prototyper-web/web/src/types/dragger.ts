import { ComponentDescriptor } from '@prototyper/core';
import { JSONType, WithCreatedAndUpdatedAt, WithId } from './api';
import { ResourceUrl } from './resourcePackage';

export type ImgSizeType = 'fit' | 'small';
export interface Dragger extends WithId, WithCreatedAndUpdatedAt {
  label: string;
  component: ComponentDescriptor;
  type: string;
  canvas: boolean;
  draggerProps?: JSONType;
  compProps?: JSONType;
  compPropsMapper?: JSONType;

  category?: string;
  subcategory?: string;
  order?: number;
  img?: ResourceUrl;
  imgSize: ImgSizeType;
}
