import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { notification } from 'antd';
import { noop } from 'lodash';
import type { editor } from 'monaco-editor';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { withEditorContainer } from './EditorContainer';
import { EditorInstance, EditorPropsType } from './EditorProps';

import { SerializedModule } from '../../types/SerializedModule';
import { JSXParser } from '../../utils/parser/JSXParser';

function RawTsxEditor(props: EditorPropsType) {
  const [ready, setReady] = useState(false);
  const [notificationApi, notificationContext] = notification.useNotification();
  const monaco = useMonaco()!;
  const editor = useRef<editor.IStandaloneCodeEditor>();
  const editorInstance = useRef<EditorInstance>();
  useEffect(() => {
    if (!monaco) return;
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
    });
  }, [monaco]);
  const {
    name,
    tabSize = 2,
    initCode,
    defaultCode,
    onSave = noop,
    editorDidMount = noop,
    onChange = noop,
  } = props;
  const lastsave = useRef(initCode);
  const getValue = useCallback(() => {
    return editor.current?.getValue();
  }, []);
  const setValue = useCallback((text: string | undefined) => {
    const model = editor.current?.getModel();
    if (!model) return;
    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: text || null,
        },
      ],
      undefined as any
    );
  }, []);
  const save = useCallback(async (): Promise<SerializedModule | null> => {
    try {
      const instance = editor.current;
      if (!instance) return null;
      const rawCode = instance.getValue({
        preserveBOM: false,
        lineEnding: '\n',
      });
      lastsave.current = rawCode || '';
      if (!rawCode) {
        onSave(null, editorInstance.current);
        return null;
      }
      const parser = new JSXParser();
      const compiledCode = await parser.parse(rawCode, 'tsx');
      const module: SerializedModule = {
        compiledSrc: compiledCode,
        src: rawCode,

        parser: JSXParser.NAME,
        langType: 'tsx',
      };
      onSave(module, editorInstance.current);
      return module;
    } catch (e) {
      console.error('代码编译失败', e);
      notificationApi.error({
        message: '代码编译失败!',
        description: e.message,
      });
      return null;
    }
  }, [notificationApi, onSave]);
  const [options, setOptions] =
    useState<editor.IStandaloneEditorConstructionOptions>({});
  useEffect(() => {
    const saveListener = function (e: KeyboardEvent) {
      const instance = editor.current;
      if (!instance) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.code === 'KeyS') {
          save();
          e.preventDefault();
        } else if (e.code === 'keyZ') {
          instance.popUndoStop();
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', saveListener);
    return () => {
      document.removeEventListener('keydown', saveListener);
    };
  }, [save]);
  const init = () => {
    if (initCode === undefined) {
      onChange(defaultCode);
    }
    if (!monaco) throw new Error('monaco尚未初始化');
    const uri = monaco.Uri.parse(`ts:filename/${name}.tsx`);
    const code = initCode === undefined ? defaultCode : initCode;
    setOptions({
      tabSize,
      model:
        monaco.editor.getModel(uri) ||
        monaco.editor.createModel(code || '', 'typescript', uri),
    });
    setReady(true);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);
  function setupEditor(editor: editor.IStandaloneCodeEditor) {}
  if (!ready) return <>编辑器尚未就绪</>;
  return (
    <>
      {notificationContext}
      <MonacoEditor
        language="typescript"
        options={options}
        onChange={onChange}
        onMount={(instance) => {
          editor.current = instance;
          setupEditor(instance);
          editorInstance.current = {
            save,
            getRawCode: getValue,
            setRawCode: setValue,
            reset() {
              setValue(lastsave.current);
            },
          };
          editorDidMount(editorInstance.current);
        }}
      ></MonacoEditor>
    </>
  );
}

export const TsxEditor = withEditorContainer(RawTsxEditor, 'tsx');
