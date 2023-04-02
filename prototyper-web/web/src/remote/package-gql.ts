import { fragment } from '@/utils/fragments';
import { FragmentSimpleUserEntity } from './user';
import {
  Entity,
  ResponseFragmentType,
  ResponseRelationCollectionFragmentType,
  responseFragment,
  responseRelationCollection,
} from './fragments';
import { ResourcePackage, ResourceUrl } from '@/types/resourcePackage';
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
import { ID, JSONType, Merge, WithCreatedAndUpdatedAt } from '@/types/api';
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

export const FragmentSimplePackageCollection = responseRelationCollection(
  'Package',
  FragmentSimplePackage
);

export const FragmentSimplePackageResponse = responseFragment(
  'Package',
  FragmentSimplePackage
);

export type SimplePackageType = Pick<
  ResourcePackage,
  'name' | 'version' | 'type' | 'public' | 'id'
> & {
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
query flatDependencies($id:ID!){
  package(id: $id) {
    data {
      attributes {
        flatDevDependencies {
          id
          attributes {
            name
            version
            globalSymbols
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
