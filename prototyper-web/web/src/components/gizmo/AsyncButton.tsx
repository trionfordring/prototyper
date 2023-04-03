import { Button, ButtonProps, Modal } from 'antd';
import { noop } from 'lodash';
import { PropsWithChildren, forwardRef, useState } from 'react';

export const AsyncButton = forwardRef<
  HTMLElement,
  PropsWithChildren<ButtonProps> & {
    comfirm?: {
      title: React.ReactNode;
      content?: React.ReactNode;
    };
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
  function handleOnClick(...args: any[]) {
    if (props.comfirm) {
      modalApi.confirm({
        title: props.comfirm.title,
        content: props.comfirm.content,
        onOk() {
          doOnClick(...args);
        },
      });
    } else {
      doOnClick(...args);
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
