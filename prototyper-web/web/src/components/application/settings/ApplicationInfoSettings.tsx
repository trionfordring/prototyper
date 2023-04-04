import { ComponentInput } from '@/components/component/ComponentInput';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { AsyncButton } from '@/components/gizmo/AsyncButton';
import { updateApplicationInfo } from '@/remote/application';
import { Form, Input, Space } from 'antd';
import { useState } from 'react';

export function ApplicationInfoSettings() {
  const appInfo = useApplicationInfo();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [form] = Form.useForm();
  function onSubmit(data: any) {
    setLoading(true);
    try {
      updateApplicationInfo(appInfo.id, data);
      setChanged(false);
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
      <Form.Item label="唯一名称">
        <Input disabled value={appInfo.name} />
      </Form.Item>
      <Form.Item label="首页组件" name="index" initialValue={appInfo.index}>
        <ComponentInput disabledNamespace />
      </Form.Item>
      <Form.Item label="显示名称" name="label" initialValue={appInfo.label}>
        <Input />
      </Form.Item>
      <Form.Item
        label="简要介绍"
        name="description"
        initialValue={appInfo.description}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="详细介绍"
        name="readme"
        initialValue={appInfo.readme}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <MarkdownEditor />
      </Form.Item>
      <Form.Item>
        <Space style={{ float: 'right' }}>
          {changed && (
            <>
              <AsyncButton
                comfirm={{
                  title: '确定要放弃修改吗?',
                }}
                onClick={() => {
                  form.resetFields();
                  setChanged(false);
                }}
              >
                放弃修改
              </AsyncButton>
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
        </Space>
      </Form.Item>
    </Form>
  );
}
