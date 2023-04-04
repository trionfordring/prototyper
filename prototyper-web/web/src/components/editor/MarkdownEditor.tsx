import { useUncontrolledState } from '@/hooks/useUncontrolledState';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { Button } from 'antd';
import type monaco from 'monaco-editor';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Markdown } from '../gizmo/Markdown';
import { ReadmeMarkdown } from '../application/ReadmeMarkdown';

const EditorContainer = styled.div`
  border: 1px solid #d9d9d9;
  position: relative;
`;

const Extra = styled.div`
  position: absolute;
  top: -32px;
  right: 0;
  z-index: 1000;
`;

const PreviewBox = styled.div`
  padding: 0 8px;
`;

export function MarkdownEditor({
  value: valueProp,
  onChange,
  defaultValue,
  height = 120,
}: {
  value?: string;
  onChange?: (value?: string) => void;
  defaultValue?: string;
  height?: number | string;
}) {
  const [isPreview, setIsPreview] = useState(false);
  const [value, setValue] = useUncontrolledState<string | undefined>(
    valueProp,
    onChange,
    defaultValue || ''
  );
  const monaco = useMonaco();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  function initEditor(editor: monaco.editor.IStandaloneCodeEditor) {}
  if (!monaco) {
    return <>编辑器尚未初始化!</>;
  }
  return (
    <EditorContainer>
      <Extra>
        {isPreview ? (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsPreview(false)}
          >
            编辑 README.md
          </Button>
        ) : (
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setIsPreview(true)}
          >
            预览 README.md
          </Button>
        )}
      </Extra>
      {isPreview ? (
        <PreviewBox>
          <ReadmeMarkdown value={value} />
        </PreviewBox>
      ) : (
        <MonacoEditor
          value={value}
          onChange={setValue}
          language="markdown"
          options={{
            tabSize: 2,
            folding: false,
            glyphMargin: false,
            lineNumbers: 'off',
          }}
          height={height}
          onMount={(e) => {
            editorRef.current = e;
            initEditor(e);
          }}
        />
      )}
    </EditorContainer>
  );
}
