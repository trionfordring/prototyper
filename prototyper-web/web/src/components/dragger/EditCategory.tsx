import { Form, Modal, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';

export interface CateLike {
  name: string;
  label: string;
}

export function EditCategoryModal({
  cate,
  open,
  onCancel,
  onOk,
}: {
  cate: CateLike;
  open: boolean;
  current?: string;
  onCancel: () => void;
  onOk: (cate: CateLike) => void;
}) {
  const [form] = Form.useForm();
  function handleOk() {
    form.submit();
  }
  function formFinish(data: any) {
    onOk({
      ...data,
      name: cate.name,
    });
    form.resetFields();
  }
  useEffect(() => {
    if (open) {
      form.setFieldValue('label', cate.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, open]);
  return (
    <Modal title="编辑分类" open={open} onCancel={onCancel} onOk={handleOk}>
      <Form
        form={form}
        onFinish={formFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="分类id">
          <Input disabled value={cate.name} />
        </Form.Item>
        <Form.Item
          label="分类名"
          name="label"
          rules={[{ required: true, message: '分类名不能为空' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function useEditCategoryModal(setCateLike: (cate: CateLike) => void) {
  const [currentCate, setCurrentCate] = useState<CateLike | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  function open(cate: CateLike) {
    setIsOpen(true);
    setCurrentCate(cate);
  }
  function close() {
    setIsOpen(false);
  }
  const modalNode = useMemo(() => {
    if (!currentCate) return null;
    return (
      <EditCategoryModal
        open={isOpen}
        cate={currentCate}
        onCancel={close}
        onOk={(cate) => {
          setCateLike(cate);
          close();
        }}
      />
    );
  }, [currentCate, isOpen, setCateLike]);
  return {
    modalNode,
    open,
    close,
    setIsOpen,
    isOpen,
  };
}
