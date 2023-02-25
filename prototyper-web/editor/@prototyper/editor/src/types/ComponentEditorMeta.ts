import { SerializedModule } from './SerializedModule';
import { SerializedSettings } from './SerializedSettings';

export interface ComponentEditorMeta {
  warpper?: SerializedModule;
  useSetupStates?: SerializedModule;

  settings?: SerializedSettings;
}
