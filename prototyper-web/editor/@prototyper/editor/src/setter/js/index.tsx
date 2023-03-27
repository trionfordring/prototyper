import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import React, { useRef } from 'react';
import styled from 'styled-components';

import { useUncontrolledState } from '../../hooks/useUncontrolledState';
import { FormItem } from '../form/FormItem';
import { BasicSetterProps } from '../types/SetterProps';

export function JSSetter({
  height,
  defaultArr,
  defaultValue,
  ...props
}: BasicSetterProps & {
  height?: number | string;
  defaultArr?: boolean;
  defaultValue?: string;
}) {
  return (
    <FormItem {...props} allow={['jsExpr']} wide initialValue={defaultValue}>
      <JSEditor height={height} defaultArr={defaultArr} />
    </FormItem>
  );
}
const DEFALUT_JS = `// @export(data)
const data = {
  
}
`;

const DEFALUT_JSARR = `// @export(data)
const data = [

]
`;

const EditorContainer = styled.div`
  border: 1px solid #d9d9d9;
`;

function JSEditor({
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
    defaultValue || (defaultArr ? DEFALUT_JSARR : DEFALUT_JS)
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
        language="javascript"
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
