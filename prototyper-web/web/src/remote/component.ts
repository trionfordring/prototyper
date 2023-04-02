import { ID } from '@/types/api';
import { isNil } from 'lodash';
import { SerializedProtoComponent } from '@prototyper/editor/src/types/SerializedProtoComponent';
import { FetchKey, fetcher } from './fetcher';
import { mutate } from 'swr';
import { CreateComponentFormType } from '@/components/component/CreateComponentForm';
import { ApplicationByIdDocument } from './application';
import {
  CreateComponentDocument,
  DeleteComponentDocument,
  UpdateComponentDataDocument,
  UpdateComponentDescriptionDocument,
} from './component-gql';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { FlatDevDependenciesDocument } from './package-gql';

export async function updateComponentData(
  id: ID,
  data: SerializedProtoComponent
) {
  await fetcher([
    UpdateComponentDataDocument,
    {
      id,
      data,
    },
  ]);
}

export async function updateComponentDescription(
  id: ID,
  description: string,
  appId?: ID
) {
  await fetcher([
    UpdateComponentDescriptionDocument,
    {
      id,
      description,
    },
  ]);
  if (appId) {
    await mutate([ApplicationByIdDocument, { id: appId }]);
  }
}

export async function createComponent(
  form: CreateComponentFormType & {
    package: ID;
  },
  appID?: ID
) {
  await fetcher([
    CreateComponentDocument,
    {
      param: {
        ...form,
        publishedAt: new Date(),
      },
    },
  ]);
  if (!isNil(appID)) {
    const key: FetchKey = [ApplicationByIdDocument, { id: appID }];
    await mutate(key);
    mutate([FlatDevDependenciesDocument, { id: appID }]);
  }
}

export async function deleteComponent(cid: ID) {
  await fetcher([DeleteComponentDocument, { id: cid }]);
}

export function useDeleteComponent() {
  const appInfo = useApplicationInfo();
  return {
    async deleteComponent(cid: ID) {
      await deleteComponent(cid);
      const key: FetchKey = [ApplicationByIdDocument, { id: appInfo.id }];
      await mutate(key);
      mutate([FlatDevDependenciesDocument, { id: appInfo.mainPackage.id }]);
    },
  };
}
