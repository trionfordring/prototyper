import { Entity } from './fragments';
import { resolveUploadFileEntity } from './uploadFile';
import {
  resolveComponentWithDataCollection,
  resolveSimpleComponentEntity,
} from './component-gql';
import { ID, JSONType, Nil, PageMeta, PaginationArg } from '@/types/api';
import { isEmpty, isNil } from 'lodash';
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
  FlatDependenciesDocument,
  BasicPackagePagedDocument,
  BasicPackageType,
  UpdatePackageDepsDocument,
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

export function useFlatDependenciesNoCache(id?: ID) {
  const data = useAsyncMemo(async () => {
    if (!id) return undefined;
    return await fetcher([FlatDependenciesDocument, { id }]);
  }, [id]);
  const flatDependencies = useMemo<PackageWithUrl[] | undefined>(() => {
    if (isNil(data)) return undefined;
    return data.package.data.attributes.flatDependencies.map((fd) =>
      resolvePackageWithUrl(unwarpEntity(fd))
    );
  }, [data]);
  return {
    flatDependencies,
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

export function useBasicPackages(
  searchKey: string,
  pagination?: PaginationArg,
  sort?: string[]
) {
  const filters = useMemo(() => {
    if (isEmpty(searchKey)) return {};
    const keys = searchKey
      .trim()
      .split(' ')
      .filter((k) => !isEmpty(k));
    if (keys.length === 1) {
      return {
        name: {
          containsi: keys[0],
        },
      };
    }
    const ands = keys.map((k) => ({
      name: {
        containsi: k,
      },
    }));
    return {
      and: ands,
    };
  }, [searchKey]);
  const { data, ...others } = useRemote([
    BasicPackagePagedDocument,
    {
      filters,
      pagination,
      sort,
    },
  ]);
  const solvedData = useMemo<
    | {
        pageMeta: PageMeta;
        packages: BasicPackageType[];
      }
    | undefined
  >(() => {
    if (!data) return undefined;
    const { meta, data: d } = data.packages;
    const packages: BasicPackageType[] = d.map((v) => unwarpEntity(v));
    return { pageMeta: meta.pagination, packages };
  }, [data]);
  return {
    ...others,
    ...solvedData,
  };
}

export async function loadBasicPackagesByIds(ids: ID[]) {
  const data = await fetcher([
    BasicPackagePagedDocument,
    {
      filters: {
        id: {
          in: ids,
        },
      },
    },
  ]);
  if (isEmpty(data)) return [];
  const packages: BasicPackageType[] = data.packages.data.map((v) =>
    unwarpEntity(v)
  );
  return packages;
}

export async function updatePackageDeps(id: ID, deps: ID[]) {
  await fetcher([UpdatePackageDepsDocument, { id, dependencies: deps }]);
}

export function useUpdatePackageDeps() {
  const app = useApplicationInfo();
  return {
    async updatePackageDeps(deps: ID[]) {
      await updatePackageDeps(app.mainPackage.id, deps);
      await mutate([ApplicationByIdDocument, { id: app.id }]);
      await mutate([FlatDependenciesDocument, { id: app.mainPackage.id }]);
    },
  };
}
