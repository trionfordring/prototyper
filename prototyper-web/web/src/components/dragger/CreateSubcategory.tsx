import type { Subcategories } from '@prototyper/core';
import { Form, Input, Modal, Slider } from 'antd';
import { useState } from 'react';

export function CreateSubcategoryModal({
  open,
  onCancel,
  onOk,
  subcategories,
}: {
  open: boolean;
  subcategories: Subcategories[];
  current?: string;
  onCancel: () => void;
  onOk: (cate: Subcategories) => void;
}) {
  const [form] = Form.useForm();
  const minOrder =
    subcategories.length > 0
      ? Math.min((subcategories[0].order || 0) - 1, 0)
      : 0;
  const maxOrder =
    subcategories.length > 0
      ? Math.max((subcategories[subcategories.length - 1].order || 0) + 1, 10)
      : 10;
  function handleOk() {
    form.submit();
  }
  function formFinish(data: any) {
    onOk({
      ...data,
    });
    form.resetFields();
  }
  return (
    <Modal title="创建子分类" open={open} onCancel={onCancel} onOk={handleOk}>
      <Form
        form={form}
        onFinish={formFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="子分类id"
          name="name"
          rules={[
            { required: true, message: '子分类id不能为空' },
            {
              async validator(rule, value, callback) {
                const exist = subcategories.some((c) => c.name === value);
                if (exist) throw new Error('子分类id重复');
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="子分类名"
          name="label"
          rules={[{ required: true, message: '子分类名不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="优先级" name="order" initialValue={0}>
          <Slider min={minOrder} max={maxOrder} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function useCreateSubcategoryModal(
  subcategories: Subcategories[],
  setSubcategories: (cate: Subcategories) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }
  const modalNode = (
    <CreateSubcategoryModal
      open={isOpen}
      subcategories={subcategories}
      onCancel={close}
      onOk={(cate) => {
        setSubcategories(cate);
        close();
      }}
    />
  );
  return {
    modalNode,
    open,
    close,
    setIsOpen,
    isOpen,
  };
}
