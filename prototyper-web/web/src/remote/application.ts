import { fragment } from '@/utils/fragments';
import { graphql } from '@/utils/graphql';
import {
  ResponseCollectionFragmentType,
  ResponseFragmentType,
  responseCollectionFragment,
} from './fragments';
import { useRemote } from './useRemote';
import { ID, PageMeta } from '@/types/api';
import { Application, SimpleApplication } from '@/types/application';
import { unwarpEntity } from './utils';
import { FragmentSimpleUserEntity } from './user';
import {
  FragmentMainPackageEntity,
  FragmentMainPackageType,
  FragmentSimplePackageCollection,
  FragmentSimplePackageType,
  resolveFragmentMainPackage,
  resolveFragmentSimplePackageEntity,
} from './package';
import { FragmentComponentDescriptor } from './component-gql';
import { useMemo } from 'react';
import { isNil } from 'lodash';
import { SimpleUser } from '@/types/user';

const FragmentSimpleApplication = fragment`
fragment simpleApplication on Application {
  name
  label
  description
}
`;

const FragmentApplication = fragment`
fragment application on Application {
  # 基本信息
  ...${FragmentSimpleApplication}
  readme
  createdAt
  updatedAt
  publishedAt

  # 数据
  initProps
  creator {
    ...${FragmentSimpleUserEntity}
  }
  dependencies(pagination: {
    pageSize: $dependenciesPageSize
    page: $dependenciesPage
  }) {
    ...${FragmentSimplePackageCollection}
  }
  index {
    ...${FragmentComponentDescriptor}
  }
  mainPackage {
    ...${FragmentMainPackageEntity}
  }
}
`;

export const ApplicationByIdDocument = graphql<
  {
    application: ResponseFragmentType<
      Omit<Application, 'id' | 'creator' | 'dependencies' | 'mainPackage'> & {
        creator: ResponseFragmentType<SimpleUser>;
        dependencies: ResponseCollectionFragmentType<FragmentSimplePackageType>;
        mainPackage: ResponseFragmentType<FragmentMainPackageType>;
      }
    >;
  },
  {
    id: ID;
  }
>()`
query applicationById($id:ID!, $dependenciesPageSize:Int!=10, $dependenciesPage:Int!=1) {
  application(id: $id) {
    data {
      id
      attributes {
        ...${FragmentApplication}
      }
    }
  }
}
`;

export const ApplicationsDocument = graphql<
  {
    applications: ResponseCollectionFragmentType<{
      name: string;
      label?: string;
      description?: string;
    }>;
  },
  {
    page?: number;
  }
>()`query applications($page: Int=1, $pageSize: Int=10) {
  applications(pagination: {
    page: $page
    pageSize: $pageSize
  }) {
    ...${responseCollectionFragment('Application', FragmentSimpleApplication)}
  }
}
`;

export function useApplications(page: number) {
  const { data, ...others } = useRemote([ApplicationsDocument, { page }]);
  const ret: typeof others & {
    pagination?: PageMeta;
    applications?: SimpleApplication[];
  } = {
    ...others,
  };
  if (data) {
    const {
      applications: {
        meta: { pagination },
        data: applicationEntities,
      },
    } = data;
    ret.pagination = pagination;
    ret.applications = applicationEntities.map((e) => unwarpEntity(e));
  }
  return ret;
}

export function useApplicationById(id?: ID) {
  const { data, ...other } = useRemote(
    isNil(id) ? null : [ApplicationByIdDocument, { id }]
  );
  let application = useMemo<Application | null>(() => {
    if (isNil(data)) return null;
    const {
      application: {
        data: {
          id,
          attributes: {
            creator: { data: creatorInfo },
            dependencies: { data: dependencyEntities },
            mainPackage: { data: mainPkgEntity },
            ...applicationInfo
          },
        },
      },
    } = data;
    const dependencies = dependencyEntities.map(
      resolveFragmentSimplePackageEntity
    );
    const mainPackage = resolveFragmentMainPackage(unwarpEntity(mainPkgEntity));
    return {
      ...applicationInfo,
      id,
      dependencies,
      creator: unwarpEntity(creatorInfo),
      mainPackage,
    };
  }, [data]);
  return {
    ...other,
    application,
  };
}
