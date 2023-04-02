import { resolveUploadFileEntity } from './uploadFile';
import { Dragger } from '@/types/dragger';
import { isNil } from 'lodash';
import { fetcher } from './fetcher';
import { mutate } from 'swr';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { ApplicationByIdDocument } from './application';
import {
  FragmentDraggerType,
  CreateDraggerDocument,
  DeleteDraggerDocument,
} from './dragger-gql';
import { ID } from '@/types/api';
import { FlatDevDependenciesDocument } from './package-gql';
import { useFlatDevDependenciesCached } from './package';

export function resolveFragmentDragger(
  draggerData: FragmentDraggerType
): Dragger;
export function resolveFragmentDragger(
  draggerData?: FragmentDraggerType
): Dragger | undefined {
  if (isNil(draggerData)) return undefined;
  const { img, ...others } = draggerData;
  return {
    ...others,
    img: resolveUploadFileEntity(img.data),
  };
}

async function createDragger(data: Dragger, packageId: ID) {
  await fetcher([
    CreateDraggerDocument,
    {
      data: {
        ...data,
        publishedAt: new Date(),
        type: 'native',
        canvas: false,
        package: packageId,
      },
    },
  ]);
}

export function useCreateDragger() {
  const appInfo = useApplicationInfo();

  return {
    async createDragger(data: Dragger) {
      await createDragger(data, appInfo.mainPackage.id);
      await mutate([ApplicationByIdDocument, { id: appInfo.id }]);
      mutate([FlatDevDependenciesDocument, { id: appInfo.mainPackage.id }]);
    },
  };
}

export function useDraggers() {
  const appInfo = useApplicationInfo();
  const { flatDevDependencies } = useFlatDevDependenciesCached(
    appInfo?.mainPackage?.id
  );
  return {
    draggers: flatDevDependencies?.flatMap((d) => d.draggers || []),
  };
}

export async function deleteDragger(did: ID) {
  await fetcher([
    DeleteDraggerDocument,
    {
      id: did,
    },
  ]);
}

export function useDeleteDragger() {
  const appInfo = useApplicationInfo();
  return {
    async deleteDragger(did: ID) {
      await deleteDragger(did);
      await mutate([ApplicationByIdDocument, { id: appInfo.id }]);
      mutate([FlatDevDependenciesDocument, { id: appInfo.mainPackage.id }]);
    },
  };
}
