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
import { FragmentSimpleUserEntity, useMe } from './user';
import { resolveFragmentMainPackage } from './package';
import { FragmentComponentDescriptor } from './component-gql';
import { useMemo } from 'react';
import { isNil } from 'lodash';
import { SimpleUser } from '@/types/user';
import {
  FragmentMainPackageEntity,
  FragmentMainPackageType,
} from './package-gql';
import type { ComponentDescriptor } from '@prototyper/core';
import { fetcher } from './fetcher';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { mutate } from 'swr';

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
        mainPackage: ResponseFragmentType<FragmentMainPackageType>;
      }
    >;
  },
  {
    id: ID;
  }
>()`
query applicationById($id:ID!) {
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
    pageSize?: number;
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

export const UserApplicationsDocument = graphql<
  {
    applications: ResponseCollectionFragmentType<{
      name: string;
      label?: string;
      description?: string;
    }>;
  },
  {
    page?: number;
    pageSize?: number;
    uid: ID;
  }
>()`query userApplications($page: Int=1, $pageSize: Int=10, $uid: ID!) {
  applications(pagination: {
    page: $page
    pageSize: $pageSize
  }, filters: {
    creator: {
      id: $uid
    }
  }) {
    ...${responseCollectionFragment('Application', FragmentSimpleApplication)}
  }
}
`;

export function useApplications(page: number = 1, pageSize: number = 10) {
  const { data, ...others } = useRemote([
    ApplicationsDocument,
    { page, pageSize },
  ]);
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

export function useMyApplications(page: number = 1, pageSize: number = 10) {
  const { me } = useMe();
  const { data, ...others } = useRemote(
    me ? [UserApplicationsDocument, { page, pageSize, uid: me.id }] : null
  );
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
            mainPackage: { data: mainPkgEntity },
            ...applicationInfo
          },
        },
      },
    } = data;
    const mainPackage = resolveFragmentMainPackage(unwarpEntity(mainPkgEntity));
    return {
      ...applicationInfo,
      id,
      creator: unwarpEntity(creatorInfo),
      mainPackage,
    };
  }, [data]);
  return {
    ...other,
    application,
  };
}

export type UpdateApplicationInfoProps = {
  label?: string;
  description?: string;
  readme?: string;
  index: ComponentDescriptor;
};

const UpdateApplicationDocument = graphql<
  {},
  {
    id: ID;
  } & UpdateApplicationInfoProps
>()`
mutation updateApplication(
  $id: ID!
  $label: String
  $description: String
  $readme: String
  $index: ComponentComponentDescriptorInput!
) {
	updateApplication(id: $id, data: {
    label: $label
    description: $description
    readme: $readme
    index: $index
  }) {
    data {
      id
    }
  }
}`;

export async function updateApplicationInfo(
  aid: ID,
  params: UpdateApplicationInfoProps
) {
  await fetcher([
    UpdateApplicationDocument,
    {
      ...params,
      id: aid,
    },
  ]);
  await mutate([ApplicationByIdDocument, { id: aid }]);
}
