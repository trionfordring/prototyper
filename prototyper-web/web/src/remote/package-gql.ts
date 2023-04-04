import { fragment } from '@/utils/fragments';
import { FragmentSimpleUserEntity } from './user';
import {
  Entity,
  ResponseCollectionFragmentType,
  ResponseFragmentType,
  ResponseRelationCollectionFragmentType,
  responseCollectionFragment,
  responseFragment,
  responseRelationCollection,
} from './fragments';
import {
  PackageType,
  ResourcePackage,
  ResourceUrl,
} from '@/types/resourcePackage';
import { SimpleUser } from '@/types/user';
import {
  FragmentUploadFileCollection,
  FragmentUploadFileType,
} from './uploadFile';
import {
  ComponentWithDataType,
  FragmentComponentWithDataCollection,
  FragmentComponentWithDataType,
  FragmentSimpleComponentCollection,
  FragmentSimpleComponentType,
  SimpleComponentType,
} from './component-gql';
import {
  ID,
  JSONType,
  Merge,
  PageMeta,
  PaginationArg,
  WithCreatedAndUpdatedAt,
} from '@/types/api';
import { graphql } from '@/utils/graphql';
import { FragmentDraggerType, FragmentDraggerCollection } from './dragger-gql';

export const FragmentSimplePackage = fragment`
fragment simplePackage on Package {
  name
  version
  type
  public
  creator {
    ...${FragmentSimpleUserEntity}
  }
}
`;

export const FragmentBasicPackage = fragment`
fragment basicPackage on Package {
  name
  version
  type
  public
}
`;

export const FragmentSimplePackageCollection = responseRelationCollection(
  'Package',
  FragmentSimplePackage
);

export const FragmentSimplePackageResponse = responseFragment(
  'Package',
  FragmentSimplePackage
);
export type BasicPackageType = Pick<
  ResourcePackage,
  'name' | 'version' | 'type' | 'public' | 'id'
>;

export type SimplePackageType = BasicPackageType & {
  creator: SimpleUser;
};

type _overrideSimplePackageType = {
  creator: ResponseFragmentType<SimpleUser>;
};

export type FragmentSimplePackageType = Merge<
  SimplePackageType,
  _overrideSimplePackageType
>;

export type MainPackageType = Pick<
  ResourcePackage,
  | keyof FragmentSimplePackageType
  | keyof WithCreatedAndUpdatedAt
  | 'excludeDependencies'
  | 'globalSymbols'
  | 'umds'
  | 'dts'
  | 'dependencies'
  | 'devDependencies'
  | 'draggers'
  | 'catalogue'
> & {
  components: SimpleComponentType[];
};

type _overrideMainPackageType = {
  umds: ResponseRelationCollectionFragmentType<FragmentUploadFileType>;
  dts: ResponseRelationCollectionFragmentType<FragmentUploadFileType>;
  dependencies: ResponseRelationCollectionFragmentType<FragmentSimplePackageType>;
  devDependencies: ResponseRelationCollectionFragmentType<FragmentSimplePackageType>;
  components: ResponseRelationCollectionFragmentType<FragmentSimpleComponentType>;
  draggers: ResponseRelationCollectionFragmentType<FragmentDraggerType>;
} & _overrideSimplePackageType;

export type FragmentMainPackageType = Omit<
  MainPackageType,
  keyof _overrideMainPackageType
> &
  _overrideMainPackageType;

export const FragmentMainPackage = fragment`
fragment mainPackage on Package {
  name
  version
  type
  public
  createdAt
  updatedAt
  publishedAt
  excludeDependencies
  globalSymbols
  creator {
    ...${FragmentSimpleUserEntity}
  }
  umds {
    ...${FragmentUploadFileCollection}
  }
  dts {
    ...${FragmentUploadFileCollection}
  }
  dependencies {
    ...${FragmentSimplePackageCollection}
  }
  devDependencies {
    ...${FragmentSimplePackageCollection}
  }
  components {
    ...${FragmentSimpleComponentCollection}
  }
  draggers {
    ...${FragmentDraggerCollection}
  }
  catalogue
}
`;

export const FragmentMainPackageEntity = responseFragment(
  'Package',
  FragmentMainPackage
);

export type PackageWithUrl = Pick<
  ResourcePackage,
  | 'name'
  | 'version'
  | 'id'
  | 'umds'
  | 'dts'
  | 'draggers'
  | 'globalSymbols'
  | 'catalogue'
  | 'type'
  | 'public'
> & {
  components: ComponentWithDataType[];
};

export type FragmentPackageWithUrlType = Merge<
  PackageWithUrl,
  {
    umds: ResponseRelationCollectionFragmentType<ResourceUrl>;
    dts: ResponseRelationCollectionFragmentType<ResourceUrl>;
    components: ResponseRelationCollectionFragmentType<FragmentComponentWithDataType>;
    draggers: ResponseRelationCollectionFragmentType<FragmentDraggerType>;
  }
>;

export const FlatDevDependenciesDocument = graphql<
  {
    package: ResponseFragmentType<
      {
        flatDevDependencies: Entity<FragmentPackageWithUrlType>[];
      },
      undefined
    >;
  },
  {
    id: ID;
  }
>()`
query flatDevDependencies($id:ID!){
  package(id: $id) {
    data {
      attributes {
        flatDevDependencies {
          id
          attributes {
            name
            version
            globalSymbols
            type
            public
            umds {
              ...${FragmentUploadFileCollection}
            }
            dts {
              ...${FragmentUploadFileCollection}
            }
            components {
              ...${FragmentComponentWithDataCollection}
            }
            draggers {
              ...${FragmentDraggerCollection}
            }
            catalogue
          }
        }
      }
    }
  }
}`;

export const FlatDependenciesDocument = graphql<
  {
    package: ResponseFragmentType<
      {
        flatDependencies: Entity<FragmentPackageWithUrlType>[];
      },
      undefined
    >;
  },
  {
    id: ID;
  }
>()`
query flatDependencies($id:ID!){
  package(id: $id) {
    data {
      attributes {
        flatDependencies {
          id
          attributes {
            name
            version
            globalSymbols
            type
            public
            umds {
              ...${FragmentUploadFileCollection}
            }
            dts {
              ...${FragmentUploadFileCollection}
            }
            components {
              ...${FragmentComponentWithDataCollection}
            }
            draggers {
              ...${FragmentDraggerCollection}
            }
            catalogue
          }
        }
      }
    }
  }
}`;

export const UpdatePackageCatalogueDocument = graphql<
  {},
  {
    id: ID;
    catalogue?: JSONType;
  }
>()`
mutation updatePackageCatalogue($id: ID!, $catalogue: JSON) {
  updatePackage(id: $id, data: { catalogue: $catalogue }) {
    data {
      id
    }
  }
}
`;

export const BasicPackagePagedDocument = graphql<
  {
    packages: ResponseCollectionFragmentType<BasicPackageType>;
  },
  {
    filters: any;
    pagination?: PaginationArg;
    sort?: string[];
  }
>()`
query getBasicPackages($filters: PackageFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  packages(
    filters: $filters
    pagination: $pagination
    sort: $sort
  ) {
    ...${responseCollectionFragment('Package', FragmentBasicPackage)}
  }
}
`;

export const UpdatePackageDepsDocument = graphql<
  {},
  {
    id: ID;
    dependencies: ID[];
  }
>()`
mutation updatePackageDeps($id:ID!, $dependencies: [ID!]!) {
  updatePackage(id: $id, data: {
    dependencies: $dependencies
  }) {
    data{
      id
    }
  }
}`;
