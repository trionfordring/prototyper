import { createComponent } from '@/remote/component';
import { ID } from '@/types/api';
import { ProtoComponent } from '@/types/component';
import { EmptyProtoComponentData } from '@/utils/EmptyProtoComponentData';
import { AutoComplete, Button, Form, Input, Modal, Space } from 'antd';
import { noop } from 'lodash';
import { useState } from 'react';
import { FormTemplateItem } from './FormTemplateItem';
import { ProcessClientError } from '../gizmo/ProcessClientError';

export type CreateComponentFormType = Pick<
  ProtoComponent,
  'name' | 'data' | 'label' | 'description' | 'type'
>;

function stringify(str?: string): string | undefined {
  if (str) return str;
  return undefined;
}

export function CreateComponentForm({
  onSave = noop,
  onCancel,
}: {
  onSave?: (data: CreateComponentFormType) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [form] = Form.useForm();
  const [error, setError] = useState<Error | undefined>();
  const [changed, setChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const submitForm = async (data: any) => {
    setIsSaving(true);
    setError(undefined);
    try {
      await onSave({
        name: data.name,
        data: EmptyProtoComponentData,
        label: stringify(data.label),
        description: stringify(data.description),
        type: stringify(data.type),
      });
      form.resetFields();
    } catch (e) {
      setError(e);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Form
      form={form}
      labelWrap
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      onFinish={submitForm}
      onValuesChange={() => setChanged(true)}
    >
      {error && (
        <Form.Item>
          <ProcessClientError err={error} />
        </Form.Item>
      )}
      <Form.Item
        label="唯一名称"
        name="name"
        rules={[{ required: true, message: '此项必填' }]}
      >
        <Input placeholder="建议输入英文名称"></Input>
      </Form.Item>
      <Form.Item label="显示名称" name="label">
        <Input placeholder="默认等于唯一名称"></Input>
      </Form.Item>
      <Form.Item label="简介" name="description">
        <Input.TextArea placeholder="输入简介"></Input.TextArea>
      </Form.Item>
      <Form.Item label="分类" name="type" initialValue="组件">
        <AutoComplete
          options={[{ value: '组件' }, { value: '页面' }]}
        ></AutoComplete>
      </Form.Item>
      <Form.Item label="初始模板">
        <FormTemplateItem></FormTemplateItem>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8 }}>
        <Space>
          {onCancel && <Button onClick={onCancel}>取消</Button>}
          <Button
            type={changed ? 'primary' : 'dashed'}
            htmlType="submit"
            loading={isSaving}
          >
            保存
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export function CreateComponentModal({
  onSave = noop,
  onCancel = noop,
  open,
}: {
  onSave?: (data: CreateComponentFormType) => void | Promise<void>;
  onCancel?: () => void;
  open: boolean;
}) {
  return (
    <Modal open={open} title="创建组件" footer={null} onCancel={onCancel}>
      <CreateComponentForm onSave={onSave} onCancel={onCancel} />
    </Modal>
  );
}

export function useCreateComponentModal(packageId?: ID, appId?: ID) {
  const [isOpen, setIsOpen] = useState(false);
  async function onSave(data: CreateComponentFormType) {
    if (!packageId) {
      console.warn('需要packageId');
      return;
    }
    await createComponent(
      {
        ...data,
        package: packageId,
      },
      appId
    );
    setIsOpen(false);
  }
  const modalNode = (
    <CreateComponentModal
      open={isOpen}
      onSave={onSave}
      onCancel={() => setIsOpen(false)}
    />
  );
  return {
    modalNode,
    isOpen,
    setIsOpen,
    open() {
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
    },
  };
}
