import { fragment } from '@/utils/fragments';
import { responseRelationCollection } from './fragments';

export const FragmentDragger = fragment`
fragment dragger on Dragger {
  label
  type
  canvas
  draggerProps
  compProps
  component {
    namespace
    name
  }
  publishedAt
  createdAt
  updatedAt
}
`;

export const FragmentDraggerCollection = responseRelationCollection(
  'Dragger',
  FragmentDragger
);
