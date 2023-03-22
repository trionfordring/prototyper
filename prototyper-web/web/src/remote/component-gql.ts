import { Nil, ID } from '@/types/api';
import { fragment } from '@/utils/fragments';
import { graphql } from '@/utils/graphql';
import { isNil } from 'lodash';
import {
  responseRelationCollection,
  ResponseFragmentType,
  Entity,
  ResponseRelationCollectionFragmentType,
} from './fragments';
import { unwarpEntity } from './utils';
import { ProtoComponent } from '@/types/component';
import { CreateComponentFormType } from '@/components/component/CreateComponentForm';
import { SerializedProtoComponent } from '@prototyper/editor';

export const FragmentSimpleComponent = fragment`
fragment simpleComponent on Component {
  name
  label
  type
  description
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

export type SimpleComponentType = Pick<
  ProtoComponent,
  'name' | 'id' | 'label' | 'type' | 'description'
>;
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
  'name' | 'data' | 'id' | 'label' | 'type' | 'description'
>;
export type FragmentComponentWithDataType = ComponentWithDataType;
export const FragmentComponentWithData = fragment`
fragment componentWithData on Component {
  name
  data
  label
  type
  description
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

export const UpdateComponentDataDocument = graphql<
  {
    updateComponent: {
      data: {
        id: ID;
      };
    };
  },
  {
    id: ID;
    data: SerializedProtoComponent;
  }
>()`
mutation updateComponent($id: ID!, $data: JSON!) {
  updateComponent(id: $id, data: {
    data: $data
  }) {
    data {
      id
    }
  }
}
`;

export const UpdateComponentDescriptionDocument = graphql<
  {
    updateComponent: ResponseFragmentType<{
      description?: string;
    }>;
  },
  {
    id: ID;
    description?: string;
  }
>()`
mutation updateComponent($id: ID!, $description: String="") {
  updateComponent(id: $id, data: {
    description: $description
  }) {
    data {
      id
      attributes {
        description
      }
    }
  }
}
`;

export const CreateComponentDocument = graphql<
  {
    createComponent: {
      data: {
        id: ID;
      };
    };
  },
  {
    param: CreateComponentFormType & {
      package: ID;
      publishedAt: Date;
    };
  }
>()`
mutation createComponent($param:ComponentInput!) {
  createComponent(data: $param) {
    data {
      id
    }
  }
}`;
