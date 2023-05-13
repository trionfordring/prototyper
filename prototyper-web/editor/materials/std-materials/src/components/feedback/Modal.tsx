import { useComponentContext } from '@prototyper/core';
import {
  BoolSetter,
  HTMLSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { ModalProps, Modal as AntModal } from 'antd';
import { PropsWithChildren } from 'react';
import React from 'react';
import styled from 'styled-components';

import { useConnectors } from '../../utils/useConnectors';
import { DropArea } from '../basic/DropArea';
import { DropSpan } from '../basic/DropSpan';

const ModalWarpper = styled.div`
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
  padding: 8px 12px;
  width: fit-content;
  min-width: 520px;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const ModalBody = styled.div``;

export function Modal({
  children,
  title,
  disableEdit,
  ...props
}: PropsWithChildren<
  ModalProps & {
    disableEdit?: boolean;
  }
>) {
  const { connectAndDrag } = useConnectors();
  const { editing } = useComponentContext()!;
  const modalNode = (
    <AntModal
      {...props}
      title={title || <DropSpan id="title" label="对话框标题" />}
    >
      {children}
    </AntModal>
  );
  if (editing) {
    if (disableEdit) return modalNode;
    return (
      <ModalWarpper ref={connectAndDrag}>
        {modalNode}
        <ModalTitle>
          <div>{title || <DropSpan id="title" label="对话框标题" />}</div>
        </ModalTitle>
        <ModalBody>
          <DropArea>{children}</DropArea>
        </ModalBody>
      </ModalWarpper>
    );
  }
  return modalNode;
}

export function ModalSettings() {
  return (
    <SetterForm>
      <BoolSetter propName="disableEdit" label="暂停编辑" />
      <TextSetter propName="title" label="标题" />
      <TextSetter singleLine jsOnly propName="open" label="open" />
      <TextSetter singleLine jsOnly propName="onOk" label="当确认" />
      <TextSetter singleLine jsOnly propName="onCancel" label="当取消" />
      <HTMLSetter noEvents />
    </SetterForm>
  );
}
