import { fragment } from '@/utils/fragments';
import { ResponseFragmentType, responseRelationCollection } from './fragments';
import { FragmentUploadFileEntity } from './uploadFile';
import { ID, Merge, WithCreatedAndUpdatedAt, WithId } from '@/types/api';
import { Dragger } from '@/types/dragger';
import { ResourceUrl } from '@/types/resourcePackage';
import { graphql } from '@/utils/graphql';

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

export type CreateDraggerProp = Omit<
  Dragger,
  keyof WithId | keyof WithCreatedAndUpdatedAt
>;
export const CreateDraggerDocument = graphql<
  {},
  {
    data: CreateDraggerProp & { publishedAt: Date; package: ID };
  }
>()`
mutation createDragger($data: DraggerInput!){
  createDragger(data: $data) {
    data {
      id
    }
  }
}
`;

export const DeleteDraggerDocument = graphql<
  {},
  {
    id: ID;
  }
>()`
mutation deleteDragger($id:ID!) {
  deleteDragger(id: $id) {
    data {
      id
    }
  }
}
`;
