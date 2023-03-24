import { ComponentDescriptor } from '@prototyper/core';
import { JSONType, WithCreatedAndUpdatedAt, WithId } from './api';
import { ResourceUrl } from './resourcePackage';

export interface Dragger extends WithId, WithCreatedAndUpdatedAt {
  label: string;
  component: ComponentDescriptor;
  type: string;
  canvas: boolean;
  draggerProps: JSONType;
  compProps: JSONType;

  category?: string;
  subcategory?: string;
  order?: number;
  img?: ResourceUrl;
}
