import type { Category } from '@prototyper/core';
import { Form, Input, Modal, Slider } from 'antd';
import { useState } from 'react';

export function CreateCategoryModal({
  open,
  onCancel,
  onOk,
  categories,
}: {
  open: boolean;
  categories: Category[];
  current?: string;
  onCancel: () => void;
  onOk: (cate: Category) => void;
}) {
  const [form] = Form.useForm();
  const minOrder =
    categories.length > 0 ? Math.min((categories[0].order || 0) - 1, 0) : 0;
  const maxOrder =
    categories.length > 0
      ? Math.max((categories[categories.length - 1].order || 0) + 1, 10)
      : 10;
  function handleOk() {
    form.submit();
  }
  function formFinish(data: any) {
    onOk({
      ...data,
      subcategories: [],
    });
    form.resetFields();
  }
  return (
    <Modal title="创建分类" open={open} onCancel={onCancel} onOk={handleOk}>
      <Form
        form={form}
        onFinish={formFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="分类id"
          name="name"
          rules={[
            { required: true, message: '分类id不能为空' },
            {
              async validator(rule, value, callback) {
                const exist = categories.some((c) => c.name === value);
                if (exist) throw new Error('分类id重复');
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="分类名" name="label">
          <Input />
        </Form.Item>
        <Form.Item label="优先级" name="order" initialValue={0}>
          <Slider min={minOrder} max={maxOrder} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function useCreateCategoryModal(
  categories: Category[],
  setCategory: (cate: Category) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }
  const modalNode = (
    <CreateCategoryModal
      open={isOpen}
      categories={categories}
      onCancel={close}
      onOk={(cate) => {
        setCategory(cate);
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
