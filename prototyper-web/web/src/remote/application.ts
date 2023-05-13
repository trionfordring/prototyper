import { fragment } from '@/utils/fragments';
import { graphql } from '@/utils/graphql';
import {
  ResponseCollectionFragmentType,
  ResponseFragmentType,
  responseCollectionFragment,
} from './fragments';
import { useRemote } from './useRemote';
import { ID, Merge, PaginationArg } from '@/types/api';
import { Application } from '@/types/application';
import { unwarpEntity } from './utils';
import { FragmentSimpleUserEntity, useMe } from './user';
import { resolveFragmentMainPackage } from './package';
import { FragmentComponentDescriptor } from './component-gql';
import { useMemo } from 'react';
import { isEmpty, isNil } from 'lodash';
import { SimpleUser } from '@/types/user';
import {
  FragmentMainPackageEntity,
  FragmentMainPackageType,
} from './package-gql';
import type { ComponentDescriptor } from '@prototyper/core';
import { fetcher } from './fetcher';
import { mutate } from 'swr';
import { PackageType } from '@/types/resourcePackage';
import { useAuthChecker } from '@/hooks/useAuthChecker';

const FragmentSimpleApplication = fragment`
fragment simpleApplication on Application {
  name
  label
  description
}
`;

const FragmentUserApplication = fragment`
fragment userApplication on Application {
  name
  label
  description
  readme
  creator {
    ...${FragmentSimpleUserEntity}
  }
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
    applications: ResponseCollectionFragmentType<
      Merge<
        Pick<
          Application,
          'id' | 'creator' | 'name' | 'label' | 'description' | 'readme'
        >,
        {
          creator: ResponseFragmentType<SimpleUser>;
        }
      >
    >;
  },
  {
    filters: any;
    pagination?: PaginationArg;
    sort?: string[];
  }
>()`query applications($filters: ApplicationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  applications(
    filters: $filters
    pagination: $pagination
    sort: $sort
  ) {
    ...${responseCollectionFragment('Application', FragmentUserApplication)}
  }
}
`;

export const UserApplicationsDocument = graphql<
  {
    applications: ResponseCollectionFragmentType<
      Merge<
        Pick<
          Application,
          'id' | 'creator' | 'name' | 'label' | 'description' | 'readme'
        >,
        {
          creator: ResponseFragmentType<SimpleUser>;
        }
      >
    >;
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
      id: {
        eq: $uid
      }
    }
  }) {
    ...${responseCollectionFragment('Application', FragmentUserApplication)}
  }
}
`;

export function useApplications(
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
        or: [
          {
            name: {
              containsi: keys[0],
            },
          },
          {
            label: {
              containsi: keys[0],
            },
          },
        ],
      };
    }
    const ands = keys.map((k) => ({
      or: [
        {
          name: {
            containsi: k,
          },
        },
        {
          label: {
            containsi: k,
          },
        },
      ],
    }));
    return {
      and: ands,
    };
  }, [searchKey]);
  const { data, ...others } = useRemote([
    ApplicationsDocument,
    { filters, pagination, sort },
  ]);
  const applicationsAndPage = useMemo(() => {
    if (isNil(data)) return null;
    const {
      applications: {
        data: values,
        meta: { pagination },
      },
    } = data;
    const applications = values.map((app) => {
      const {
        id,
        attributes: {
          creator: { data: creatorInfo },
          ...applicationInfo
        },
      } = app;
      return {
        ...applicationInfo,
        id,
        creator: unwarpEntity(creatorInfo),
      };
    });
    return {
      applications,
      pagination,
    };
  }, [data]);
  return {
    ...others,
    ...applicationsAndPage,
  };
}

export function useMyApplications(page: number = 1, pageSize: number = 10) {
  const { me } = useMe();
  const { data, ...others } = useRemote(
    me ? [UserApplicationsDocument, { page, pageSize, uid: me.id }] : null
  );
  const applicationsAndPage = useMemo(() => {
    if (isNil(data)) return null;
    const {
      applications: {
        data: values,
        meta: { pagination },
      },
    } = data;
    const applications = values.map((app) => {
      const {
        id,
        attributes: {
          creator: { data: creatorInfo },
          ...applicationInfo
        },
      } = app;
      return {
        ...applicationInfo,
        id,
        creator: unwarpEntity(creatorInfo),
      };
    });
    return {
      applications,
      pagination,
    };
  }, [data]);
  return {
    ...others,
    ...applicationsAndPage,
  };
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

// 2PC创建
const DraftApplicationDocument = graphql<
  {
    createPackage: ResponseFragmentType<{}>;
    createApplication: ResponseFragmentType<{}>;
  },
  {
    appInput: {
      name: string;
      label?: string;
      description?: string;
      readme?: string;
      creator: ID;
    };
    pkgInput: {
      name: string;
      version: string;
      type: PackageType;
      public: boolean;
      dependencies?: ID[];
      creator: ID;
    };
  }
>()`
mutation draftApplication($appInput: ApplicationInput!, $pkgInput: PackageInput!) {
  createPackage(data: $pkgInput) {
    data {
      id
    }
  }
  createApplication(data: $appInput) {
    data {
      id
    }
  }
}`;
const LinkApplicationDocument = graphql<
  {
    updateApplication: ResponseFragmentType<{}>;
    updatePackage: ResponseFragmentType<{}>;
  },
  {
    appId: ID;
    pkgId: ID;
  }
>()`
mutation linkApplication($appId: ID!, $pkgId:ID!) {
  updateApplication(id: $appId, data: {
    mainPackage: $pkgId
  }) {
    data {
      id
    }
  }
  updatePackage(id: $pkgId, data: {
    application: $appId
  }) {
    data {
      id
    }
  }
}
`;
const PublishApplicationDocument = graphql<
  {
    updateApplication: ResponseFragmentType<{}>;
    updatePackage: ResponseFragmentType<{}>;
  },
  {
    appId: ID;
    pkgId: ID;
    time: Date;
  }
>()`
mutation publishApplication($appId: ID!, $pkgId:ID!, $time: DateTime!) {
  updateApplication(id: $appId, data: {
    publishedAt: $time
  }) {
    data {
      id
    }
  }
  updatePackage(id: $pkgId, data: {
    publishedAt: $time
  }) {
    data {
      id
    }
  }
}
`;

export type CreateAppForm = {
  name: string;
  label?: string;
  description?: string;
  readme?: string;
  dependencies?: ID[];
};

export function useCreateApplication() {
  useAuthChecker();
  const { me } = useMe();
  async function createApplication(createAppForm: CreateAppForm) {
    if (!me) throw new Error('找不到用户信息。');
    // 先创建app草稿
    const {
      createApplication: {
        data: { id: appId },
      },
      createPackage: {
        data: { id: pkgId },
      },
    } = await fetcher([
      DraftApplicationDocument,
      {
        appInput: {
          name: createAppForm.name,
          label: createAppForm.label,
          description: createAppForm.description,
          readme: createAppForm.readme,
          creator: me.id,
        },
        pkgInput: {
          name: createAppForm.name,
          type: 'application',
          public: true,
          version: '0.0.0',
          creator: me.id,
          dependencies: createAppForm.dependencies,
        },
      },
    ]);
    // 链接草稿
    await fetcher([LinkApplicationDocument, { appId, pkgId }]);
    // 发布草稿
    await fetcher([
      PublishApplicationDocument,
      { appId, pkgId, time: new Date() },
    ]);
    return appId;
  }
  return { createApplication };
}

const DeleteApplicationDocument = graphql<
  {},
  {
    appId: ID;
  }
>()`
mutation deleteApplication($appId: ID!) {
  deleteApplication(id: $appId) {
    data {
      id
    }
  }
}`;

export async function deleteApplication(appId: ID) {
  await fetcher([DeleteApplicationDocument, { appId }]);
}
