import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { AsyncButton } from '@/components/gizmo/AsyncButton';
import { useCreateApplication } from '@/remote/application';
import { Form, Input } from 'antd';
import { useState } from 'react';
import { DependenciesInput } from '../dependency/DependenciesInput';
import { ID } from '@/types/api';
import { noop } from 'lodash';

export function CreateApplicationForm({
  onCreateSuccess = noop,
}: {
  onCreateSuccess?: (appId: ID) => void;
}) {
  const { createApplication } = useCreateApplication();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [form] = Form.useForm();
  async function onSubmit(data: any) {
    setLoading(true);
    try {
      console.log('创建应用', data);
      const appId = await createApplication(data);
      setChanged(false);
      onCreateSuccess(appId);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      form={form}
      onFinish={onSubmit}
      onValuesChange={() => setChanged(true)}
    >
      <Form.Item label="唯一名称" name="name">
        <Input placeholder="建议输入英文名称" />
      </Form.Item>
      <Form.Item label="显示名称" name="label">
        <Input />
      </Form.Item>
      <Form.Item label="简要介绍" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="详细介绍"
        name="readme"
        initialValue="# Hello Prototyper!"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <MarkdownEditor />
      </Form.Item>
      <Form.Item label="依赖" name="dependencies">
        <DependenciesInput>
          {changed && (
            <>
              <AsyncButton
                type="primary"
                comfirm={{
                  title: '确定要保存当前的应用信息吗?',
                }}
                onClick={() => form.submit()}
                loading={loading}
              >
                保存
              </AsyncButton>
            </>
          )}
        </DependenciesInput>
      </Form.Item>
    </Form>
  );
}
