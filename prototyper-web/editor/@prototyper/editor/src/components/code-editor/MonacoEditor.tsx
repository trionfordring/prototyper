import { noop } from 'lodash';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';

export type EditorDidMount = (
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor
) => void;
export type ChangeHandler = (
  value: string,
  event: monacoEditor.editor.IModelContentChangedEvent
) => void;

interface MonacoEditorProps {
  /**
   * Width of editor. Defaults to 100%.
   */
  width?: string | number;
  /**
   * Height of editor. Defaults to 100%.
   */
  height?: string | number;
  /**
   * The initial value of the auto created model in the editor.
   */
  defaultValue?: string;
  /**
   * The initial language of the auto created model in the editor. Defaults to 'javascript'.
   */
  language?: string;
  /**
   * Theme to be used for rendering.
   * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
   * You can create custom themes via `monaco.editor.defineTheme`.
   */
  theme?: string | null;
  /**
   * Optional string classname to append to the editor.
   */
  className?: string | null;
  /**
   * Refer to Monaco interface {monaco.editor.IStandaloneEditorConstructionOptions}.
   */
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions;
  /**
   * Refer to Monaco interface {monaco.editor.IEditorOverrideServices}.
   */
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;
  /**
   * An event emitted when the editor has been mounted (similar to componentDidMount of React).
   */
  editorDidMount?: EditorDidMount;
  /**
   * An event emitted when the content of the current model has changed.
   */
  onChange?: ChangeHandler;
}

function processSize(size: number | string) {
  return !/^\d+$/.test(size as string) ? size : `${size}px`;
}

function MonacoEditor({
  width,
  height,
  defaultValue,
  language,
  theme,
  options,
  overrideServices,
  editorDidMount,
  onChange,
  className,
}: MonacoEditorProps) {
  const containerElement = useRef<HTMLDivElement | null>(null);

  const editor = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  const _subscription = useRef<monacoEditor.IDisposable | null>(null);

  const fixedWidth = processSize(width);

  const fixedHeight = processSize(height);

  const style = useMemo(
    () => ({
      width: fixedWidth,
      height: fixedHeight,
    }),
    [fixedWidth, fixedHeight]
  );

  const handleEditorDidMount = () => {
    editorDidMount(editor.current, monacoEditor);

    _subscription.current = editor.current.onDidChangeModelContent((event) => {
      onChange(editor.current.getValue(), event);
    });
  };

  const initMonaco = () => {
    const finalValue = defaultValue;
    if (containerElement.current) {
      const finalOptions = options;
      editor.current = monacoEditor.editor.create(
        containerElement.current,
        {
          value: finalValue,
          language,
          ...(className ? { extraEditorClassName: className } : {}),
          ...finalOptions,
          ...(theme ? { theme } : {}),
        },
        overrideServices
      );
      // After initializing monaco editor
      handleEditorDidMount();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initMonaco, []);

  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      monacoEditor.editor.setModelLanguage(model, language);
    }
  }, [language]);

  useEffect(() => {
    if (editor.current) {
      // Don't pass in the model on update because monaco crashes if we pass the model
      // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
      const { model: _model, ...optionsWithoutModel } = options;
      editor.current.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel,
      });
    }
  }, [className, options]);

  useEffect(() => {
    if (editor.current) {
      editor.current.layout();
    }
  }, [width, height]);

  useEffect(() => {
    monacoEditor.editor.setTheme(theme);
  }, [theme]);

  useEffect(
    () => () => {
      if (editor.current) {
        editor.current.dispose();
        const model = editor.current.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (_subscription.current) {
        _subscription.current.dispose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      ref={containerElement}
      style={style}
      className="react-monaco-editor-container"
    />
  );
}

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  options: {},
  overrideServices: {},
  editorDidMount: noop,
  onChange: noop,
  className: null,
};

export default MonacoEditor;
