import { Entity } from './fragments';
import { resolveUploadFileEntity } from './uploadFile';
import {
  UpdateComponentDescriptionDocument,
  resolveComponentWithDataCollection,
  resolveSimpleComponentEntity,
} from './component-gql';
import { ID, JSONType, Nil } from '@/types/api';
import { isNil } from 'lodash';
import { unwarpEntity } from './utils';
import { useRemote } from './useRemote';
import { graphql } from '@/utils/graphql';
import { useMemo } from 'react';
import { resolveFragmentDragger } from './dragger';
import { fetcher } from './fetcher';
import { useAsyncMemo } from '@/hooks/useAsyncMemo';
import {
  FragmentSimplePackageType,
  SimplePackageType,
  FragmentMainPackageType,
  MainPackageType,
  FragmentMainPackage,
  FlatDevDependenciesDocument,
  FragmentPackageWithUrlType,
  PackageWithUrl,
  UpdatePackageCatalogueDocument,
} from './package-gql';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { mutate } from 'swr';
import { ApplicationByIdDocument } from './application';

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
    draggers: draggers.data.map((d) => resolveFragmentDragger(unwarpEntity(d))),
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
    draggers: draggers.data.map((d) => resolveFragmentDragger(unwarpEntity(d))),
  };
}

export function useFlatDevDependenciesCached(pid?: ID) {
  const { data, ...others } = useRemote(
    isNil(pid) ? null : [FlatDevDependenciesDocument, { id: pid }]
  );
  const flatDevDependencies = useMemo<PackageWithUrl[] | undefined>(() => {
    if (isNil(data)) return undefined;
    return data.package.data.attributes.flatDevDependencies.map((fd) =>
      resolvePackageWithUrl(unwarpEntity(fd))
    );
  }, [data]);
  return {
    ...others,
    flatDevDependencies,
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

export async function updateCatalogue(pid: ID, catalogue?: JSONType) {
  await fetcher([
    UpdatePackageCatalogueDocument,
    {
      id: pid,
      catalogue: catalogue,
    },
  ]);
}

export function useUpdateCatalogue() {
  const app = useApplicationInfo();
  return {
    async updateCatalogue(catalogue?: JSONType) {
      if (!app) throw new Error('找不到app');
      await updateCatalogue(app.mainPackage.id, catalogue);
      await mutate([ApplicationByIdDocument, { id: app.id }]);
    },
  };
}
