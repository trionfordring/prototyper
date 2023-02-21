import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import { noop } from 'lodash';
import * as monaco from 'monaco-editor';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { withEditorContainer } from './EditorContainer';
import { EditorInstance, EditorPropsType } from './EditorProps';
import MonacoEditor from './MonacoEditor';

import { SerializedModule } from '../../types/SerializedModule';
import { JSXParser } from '../../utils/parser/JSXParser';

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

function RawTsxEditor(props: EditorPropsType) {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
  const editorInstance = useRef<EditorInstance>();
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
  const setValue = useCallback((text: string) => {
    const model = editor.current?.getModel();
    if (!model) return;
    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: text,
        },
      ],
      undefined
    );
  }, []);
  const save = useCallback(async (): Promise<SerializedModule> => {
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
  }, [onSave]);
  const options =
    useMemo<monaco.editor.IStandaloneEditorConstructionOptions>(() => {
      const uri = monaco.Uri.parse(`ts:filename/${name}.tsx`);
      const code = initCode === undefined ? defaultCode : initCode;
      return {
        tabSize,
        model:
          monaco.editor.getModel(uri) ||
          monaco.editor.createModel(code, 'typescript', uri),
      };
    }, [initCode, defaultCode, name, tabSize]);
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
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);
  function setupEditor(editor: monaco.editor.IStandaloneCodeEditor) {}
  return (
    <MonacoEditor
      language="typescript"
      options={options}
      onChange={onChange}
      editorDidMount={(instance) => {
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
  );
}

export const TsxEditor = withEditorContainer(RawTsxEditor, 'tsx');
