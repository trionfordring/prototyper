import { useUncontrolledState } from '@/hooks/useUncontrolledState';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import React, { useRef } from 'react';
import styled from 'styled-components';

const DEFALUT_JSON = `{

}
`;

const DEFALUT_JSONARR = `[]
`;

const EditorContainer = styled.div`
  border: 1px solid #d9d9d9;
`;

export function JSONEditor({
  value: valueProp,
  onChange,
  defaultValue,
  height = 120,
  defaultArr = false,
}: {
  value?: string;
  onChange?: (value?: string) => void;
  defaultValue?: string;
  height?: number | string;
  defaultArr?: boolean;
}) {
  const [value, setValue] = useUncontrolledState<string | undefined>(
    valueProp,
    onChange,
    defaultValue || (defaultArr ? DEFALUT_JSONARR : DEFALUT_JSON)
  );
  const monaco = useMonaco();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  function initEditor(editor: monaco.editor.IStandaloneCodeEditor) {}
  if (!monaco) {
    return <>编辑器尚未初始化!</>;
  }
  return (
    <EditorContainer>
      <MonacoEditor
        value={value}
        onChange={setValue}
        language="json"
        options={{
          lineNumbers: 'off',
          tabSize: 2,
          folding: false,
          glyphMargin: false,
        }}
        height={height}
        onMount={(e) => {
          editorRef.current = e;
          initEditor(e);
        }}
      />
    </EditorContainer>
  );
}
