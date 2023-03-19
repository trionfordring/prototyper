import { MainPackageType, SimplePackageType } from '@/remote/package';
import { WithCreatedAndUpdatedAt, WithId } from './api';
import { SimpleUser } from './user';
import { ComponentDescriptor } from '@prototyper/core';

export interface Application extends WithCreatedAndUpdatedAt, WithId {
  name: string;
  label?: string;
  description?: string;
  readme?: string;

  creator?: SimpleUser;
  dependencies?: SimplePackageType[];
  index?: ComponentDescriptor;
  initProps: any;

  mainPackage?: MainPackageType;
}

export type SimpleApplication = Pick<
  Application,
  'name' | 'id' | 'label' | 'description'
>;
