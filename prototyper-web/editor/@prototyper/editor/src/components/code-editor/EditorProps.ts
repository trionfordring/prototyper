import { SerializedModule } from '../../types/SerializedModule';

export interface EditorInstance {
  reset(): void;
  save(): Promise<SerializedModule | null>;
  getRawCode(): string | undefined;
  setRawCode(text: string): void;
}

export type WithEditorInstance = {
  editorDidMount: (instance: EditorInstance) => void;
};

export interface EditorPropsType extends Partial<WithEditorInstance> {
  name: string;
  label?: React.ReactNode;
  initCode?: string;
  /**
   * defaultCode表示当initCode为空时显示的默认输入值。
   */
  defaultCode?: string;
  onSave?: (module: SerializedModule | null, instance: EditorInstance) => void;
  onChange?: (rawCode?: string, instance?: EditorInstance) => void;

  tabSize?: number;
}
