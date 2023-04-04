import { Button, ButtonProps, Modal } from 'antd';
import { noop } from 'lodash';
import React, { PropsWithChildren, forwardRef, useState } from 'react';

export type ComfirmOprions = {
  title: React.ReactNode;
  content?: React.ReactNode;
};

export const AsyncButton = forwardRef<
  HTMLElement,
  PropsWithChildren<ButtonProps> & {
    comfirm?: ComfirmOprions | (() => ComfirmOprions);
  }
>((props, ref) => {
  const [modalApi, modalContext] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  async function doOnClick(...args: any[]) {
    const fn = props.onClick || noop;
    setLoading(true);
    try {
      fn(...args);
    } finally {
      setLoading(false);
    }
  }
  function handleOnClick(e: React.MouseEvent) {
    let option = props.comfirm;
    if (typeof option === 'function') option = option();
    if (option) {
      e.preventDefault();
      modalApi.confirm({
        title: option.title,
        content: option.content,
        onOk() {
          doOnClick(e);
        },
      });
    } else {
      doOnClick(e);
    }
  }
  return (
    <>
      {modalContext}
      <Button
        {...props}
        ref={ref}
        onClick={handleOnClick}
        loading={loading || props.loading}
      >
        {props.children}
      </Button>
    </>
  );
});
