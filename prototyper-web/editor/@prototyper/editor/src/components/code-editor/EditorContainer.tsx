import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { noop } from 'lodash';
import React, { forwardRef, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { EditorInstance, EditorPropsType } from './EditorProps';

import { LangType } from '../../utils/parser/Parser';

const Container = styled.div`
  height: 100%;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;

  .footer,
  .header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    background-color: #f5f5f5;
  }
`;

const Header = styled.div`
  height: 35px;
`;

const HeaderLeft = styled.div``;

const HeaderRight = styled.div``;

const Content = styled.div`
  flex-grow: 1;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Footer = styled.div`
  height: 22px;
`;

const HeaderItem = styled.div<{
  actived?: boolean;
}>`
  height: 100%;
  padding: 0 5px;
  display: flex;
  align-items: center;
  ${({ actived }) =>
    actived &&
    css`
      background-color: #fff;
      border-top: 2px solid #6bd425;
    `}
`;

const HeaderButton = styled(
  forwardRef<any, any>(({ actived, children, ...props }, ref) => (
    <Button {...props} ref={ref}>
      {children}
    </Button>
  ))
)`
  height: 100%;
  border-radius: 0;
  svg {
    font-size: 1.2em;
  }
`;

const SaveButtom = styled(HeaderButton)<{
  actived?: boolean;
}>`
  ${({ actived }) =>
    actived &&
    css`
      padding-left: 45px;
      padding-right: 45px;
      background-color: #52c41a;
      color: #fff;
      font-weight: bold;

      &:hover {
        background-color: #b5f5ec;
      }
    `}
`;

const RollbackButtom = styled(HeaderButton)<{
  actived?: boolean;
}>`
  ${({ actived }) =>
    actived
      ? css`
          width: 120px;
        `
      : css`
          width: 0;
          padding: 0;
          border: 0;
          overflow: hidden;
        `}
`;

function trasformStr(str: string) {
  return str ? str.trim().replaceAll('\r', '') : '';
}
function matchString(a: string, b: string) {
  return trasformStr(a) === trasformStr(b);
}

export function withEditorContainer(
  Editor: React.ComponentType<EditorPropsType>,
  langType: LangType
) {
  function EditorContainer(props: EditorPropsType) {
    const editor = useRef<EditorInstance>();
    const [changed, setChanged] = useState(false);
    const {
      label,
      editorDidMount = noop,
      onChange = noop,
      onSave = noop,
      initCode,
    } = props;
    function init(instance: EditorInstance) {
      if (initCode !== undefined && instance) {
        const code = instance.getRawCode();
        setChanged(!matchString(code, initCode));
      }
    }
    return (
      <Container>
        <Header className="header">
          <HeaderLeft>
            <HeaderItem actived={changed}>{label}</HeaderItem>
          </HeaderLeft>
          <HeaderRight>
            <SaveButtom
              type={changed ? undefined : 'dashed'}
              actived={changed}
              onClick={() => {
                editor?.current.save();
              }}
            >
              <SaveOutlined />
              保存 ( Ctrl + s )
            </SaveButtom>
            <RollbackButtom
              actived={changed}
              danger
              type="primary"
              onClick={editor.current?.reset}
            >
              <CloseOutlined />
              放弃修改
            </RollbackButtom>
          </HeaderRight>
        </Header>
        <Content>
          <Editor
            {...props}
            editorDidMount={(instance) => {
              editor.current = instance;
              editorDidMount(instance);
              init(instance);
            }}
            onChange={(code, instance) => {
              setChanged(true);
              onChange(code, instance);
            }}
            onSave={(...args) => {
              setChanged(false);
              onSave(...args);
            }}
          ></Editor>
        </Content>
      </Container>
    );
  }
  return EditorContainer;
}
