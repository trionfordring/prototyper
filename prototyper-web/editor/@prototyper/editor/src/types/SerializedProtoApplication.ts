import { ProtoApplication, WithDescriptor } from '@prototyper/core';

import { SerializedModule } from './SerializedModule';
import { SerializedProtoComponent } from './SerializedProtoComponent';

export interface SerializedProtoApplication extends ProtoApplication {
  index: SerializedProtoComponent & Partial<WithDescriptor>;
  useSetupAppStatesInfo?: SerializedModule;
}
