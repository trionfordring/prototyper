import { ID } from '@/types/api';
import { isNil } from 'lodash';
import { SerializedProtoComponent } from '@prototyper/editor/src/types/SerializedProtoComponent';
import { FetchKey, fetcher } from './fetcher';
import { mutate } from 'swr';
import { CreateComponentFormType } from '@/components/component/CreateComponentForm';
import { ApplicationByIdDocument } from './application';
import {
  CreateComponentDocument,
  UpdateComponentDataDocument,
} from './component-gql';

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
  }
}
