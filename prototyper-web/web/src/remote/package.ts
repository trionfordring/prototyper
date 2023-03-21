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
  resolveUploadFileEntity,
} from './uploadFile';
import {
  ComponentWithDataType,
  FragmentComponentWithDataCollection,
  FragmentComponentWithDataType,
  FragmentSimpleComponentCollection,
  FragmentSimpleComponentType,
  SimpleComponentType,
  resolveComponentWithDataCollection,
  resolveSimpleComponentEntity,
} from './component-gql';
import { ID, Merge, Nil, WithCreatedAndUpdatedAt } from '@/types/api';
import { isNil } from 'lodash';
import { unwarpEntity } from './utils';
import { useRemote } from './useRemote';
import { graphql } from '@/utils/graphql';
import { useMemo } from 'react';
import { FragmentDraggerCollection } from './dragger';
import { Dragger } from '@/types/dragger';
import { fetcher } from './fetcher';
import { useAsyncMemo } from '@/hooks/useAsyncMemo';

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
> & {
  components: SimpleComponentType[];
};

type _overrideMainPackageType = {
  umds: ResponseRelationCollectionFragmentType<FragmentUploadFileType>;
  dts: ResponseRelationCollectionFragmentType<FragmentUploadFileType>;
  dependencies: ResponseRelationCollectionFragmentType<FragmentSimplePackageType>;
  devDependencies: ResponseRelationCollectionFragmentType<FragmentSimplePackageType>;
  components: ResponseRelationCollectionFragmentType<FragmentSimpleComponentType>;
  draggers: ResponseRelationCollectionFragmentType<Dragger>;
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
}
`;

export const FragmentMainPackageEntity = responseFragment(
  'Package',
  FragmentMainPackage
);

export function resolveFragmentSimplePackage(
  pkg: FragmentSimplePackageType
): SimplePackageType;
export function resolveFragmentSimplePackage(
  pkg?: FragmentSimplePackageType
): SimplePackageType | Nil {
  if (isNil(pkg)) return pkg;
  const { creator, ...others } = pkg;
  return {
    ...others,
    creator: unwarpEntity(creator.data),
  };
}

export function resolveFragmentSimplePackageEntity(
  entity: Entity<FragmentSimplePackageType>
): SimplePackageType;
export function resolveFragmentSimplePackageEntity(
  entity?: Entity<FragmentSimplePackageType>
): SimplePackageType | Nil {
  if (isNil(entity)) return entity;
  return resolveFragmentSimplePackage(unwarpEntity(entity));
}

export function resolveFragmentMainPackage(
  mainPackage?: FragmentMainPackageType
): MainPackageType | undefined {
  if (isNil(mainPackage)) return mainPackage;
  const {
    umds,
    dts,
    dependencies,
    devDependencies,
    creator,
    components,
    draggers,
    ...others
  } = mainPackage;

  return {
    umds: umds.data.map(resolveUploadFileEntity),
    dts: dts.data.map(resolveUploadFileEntity),
    dependencies: dependencies.data.map(resolveFragmentSimplePackageEntity),
    devDependencies: devDependencies.data.map(
      resolveFragmentSimplePackageEntity
    ),
    creator: unwarpEntity(creator.data),
    components: components.data.map((c) => resolveSimpleComponentEntity(c)),
    draggers: draggers.data.map((d) => unwarpEntity(d)),
    ...others,
  };
}

export const SimplePackageDocument = graphql<
  {
    packageByName: Entity<FragmentMainPackageType>;
  },
  {
    name: string;
  }
>()`
  query simplePackageDocument($name: String) {
    packageByName(name: $name) {
      id
      attributes {
        ...${FragmentMainPackage}
      }
    }
  }
`;

export function usePackageByName(name?: string | Nil) {
  const { data, ...others } = useRemote(
    name ? [SimplePackageDocument, { name }] : null
  );
  const pkg = useMemo<MainPackageType | undefined>(() => {
    if (isNil(data)) return undefined;
    const { packageByName: entity } = data;
    return resolveFragmentMainPackage(unwarpEntity(entity));
  }, [data]);
  return {
    ...others,
    pkg,
  };
}

export type PackageWithUrl = Pick<
  ResourcePackage,
  'name' | 'version' | 'id' | 'umds' | 'dts' | 'draggers' | 'globalSymbols'
> & {
  components: ComponentWithDataType[];
};

export type FragmentPackageWithUrlType = Merge<
  PackageWithUrl,
  {
    umds: ResponseRelationCollectionFragmentType<ResourceUrl>;
    dts: ResponseRelationCollectionFragmentType<ResourceUrl>;
    components: ResponseRelationCollectionFragmentType<FragmentComponentWithDataType>;
    draggers: ResponseRelationCollectionFragmentType<Dragger>;
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
          }
        }
      }
    }
  }
}`;

export function resolvePackageWithUrl(
  fragmentData: FragmentPackageWithUrlType
): PackageWithUrl;
export function resolvePackageWithUrl(
  fragmentData?: FragmentPackageWithUrlType
): PackageWithUrl | Nil {
  if (isNil(fragmentData)) return fragmentData;
  const { umds, dts, components, draggers, ...others } = fragmentData;
  return {
    ...others,
    umds: umds.data.map(resolveUploadFileEntity),
    dts: dts.data.map(resolveUploadFileEntity),
    components: resolveComponentWithDataCollection(components),
    draggers: draggers.data.map((d) => unwarpEntity(d)),
  };
}

export function useFlatDevDependencies(id?: ID) {
  const data = useAsyncMemo(async () => {
    if (!id) return undefined;
    return await fetcher([FlatDevDependenciesDocument, { id }]);
  }, [id]);
  const flatDevDependencies = useMemo<PackageWithUrl[] | undefined>(() => {
    if (isNil(data)) return undefined;
    return data.package.data.attributes.flatDevDependencies.map((fd) =>
      resolvePackageWithUrl(unwarpEntity(fd))
    );
  }, [data]);
  return {
    flatDevDependencies,
  };
}
