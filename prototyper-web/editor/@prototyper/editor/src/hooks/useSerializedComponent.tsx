import { SerializedNodes } from '@prototyper/core';
import { useMemo } from 'react';

import { useSerializedModule } from './useSerializedModule';

import { SerializedModule } from '../types/SerializedModule';
import {
  META_EDITOR_KEY,
  SerializedProtoComponent,
} from '../types/SerializedProtoComponent';

function getEditorMeta(component: SerializedProtoComponent) {
  if (!component.meta) return undefined;
  return component.meta[META_EDITOR_KEY];
}

export function useSerializedComponent(
  component: SerializedProtoComponent,
  useSetupStatesInfo?: SerializedModule,
  warpperInfo?: SerializedModule,
  nodes?: SerializedNodes | string
) {
  const useSetupStates = useSerializedModule(
    useSetupStatesInfo || getEditorMeta(component)?.useSetupStates,
    component.useSetupStates
  );
  const warpper = useSerializedModule(
    warpperInfo || getEditorMeta(component)?.warpper,
    component.warpper
  );

  const retComponent = useMemo(
    () => ({
      ...component,
      useSetupStates,
      warpper,
      virtualDom: nodes,
    }),
    [useSetupStates, warpper, component, nodes]
  );

  return retComponent;
}
