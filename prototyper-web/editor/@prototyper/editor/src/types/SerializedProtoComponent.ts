import { ProtoComponent, WithDescriptor } from '@prototyper/core';

import { ComponentEditorMeta } from './ComponentEditorMeta';

export const META_EDITOR_KEY = '_editor' as const;

export interface SerializedProtoComponent
  extends ProtoComponent,
    WithDescriptor {
  meta?: {
    [META_EDITOR_KEY]?: ComponentEditorMeta;
    [key: string]: any;
  };
}
