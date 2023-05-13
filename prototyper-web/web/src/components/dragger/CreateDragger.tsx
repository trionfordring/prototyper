import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { JSONEditor } from '../editor/JSONEditor';
import { ComponentInput } from '../component/ComponentInput';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { ImageInput } from '../gizmo/ImageInput';
import { useEffect, useState } from 'react';
import { Application } from '@/types/application';
import { useCreateDragger } from '@/remote/dragger';
import { useRouter } from 'next/router';
import { isNil } from 'lodash';

const INIT_COMP_PROPS = `{
  "appName": "%APP_NAME%",
  "namespace": "%NAMESPACE%"
}`;

function initCompProps(application?: Application) {
  if (!application) return ``;
  return INIT_COMP_PROPS.replace(
    '%APP_NAME%',
    String.raw`${application.name}`
  ).replace('%NAMESPACE%', String.raw`${application.mainPackage?.name}`);
}

export function CreateDraggerModal({
  initialComponentName,
  open,
  onCancel,
  onOk,
}: {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  initialComponentName?: string;
}) {
  const [loading, setLoading] = useState(false);
  const application = useApplicationInfo();
  const { createDragger } = useCreateDragger();
  const [form] = Form.useForm();
  const imgSize = Form.useWatch('imgSize', form);
  function handleOk() {
    form.submit();
  }
  async function formFinish(data: any) {
    setLoading(true);
    try {
      if (data.compProps) {
        data.compProps = JSON.parse(data.compProps);
      }
      console.log('创建导出', data);
      await createDragger(data);
      onOk();
      form.resetFields();
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="导出组件"
      confirmLoading={loading}
    >
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 18,
        }}
        form={form}
        onFinish={formFinish}
      >
        <Form.Item
          label="目标组件"
          name="component"
          initialValue={{
            namespace: application.mainPackage.name,
            name: initialComponentName,
          }}
          required
          rules={[
            {
              async validator(rule, value) {
                if (typeof value !== 'object')
                  throw new Error('目标组件必须存在');
                if (!value.namespace) throw new Error('必须指定包名');
                if (!value.name) throw new Error('必须指定组件名');
              },
            },
          ]}
        >
          <ComponentInput disabledNamespace />
        </Form.Item>
        <Form.Item
          label="名称"
          name="label"
          rules={[{ required: true, message: '必须指定导出名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="初始参数"
          name="compProps"
          initialValue={initCompProps(application)}
          rules={[
            {
              async validator(rule, value) {
                if (!value) return;
                try {
                  JSON.parse(value);
                } catch (e) {
                  throw new Error('JSON格式错误', {
                    cause: e,
                  });
                }
              },
            },
          ]}
          validateTrigger="submit"
        >
          <JSONEditor height={200} />
        </Form.Item>
        <Form.Item label="封面尺寸" name="imgSize">
          <Select
            options={[
              { value: 'fit', label: '自适应' },
              { value: 'small', label: '小图标' },
            ]}
          />
        </Form.Item>
        <Form.Item label="封面" name="img">
          <ImageInput noCrop={imgSize === 'fit'} />
        </Form.Item>
        <Form.Item label="分类" name="category">
          <Input />
        </Form.Item>
        <Form.Item label="子分类" name="subcategory">
          <Input />
        </Form.Item>
        <Form.Item label="优先级" name="order" initialValue={0}>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function useCreateDraggerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const createDraggerModal = router.query.createDraggerModal as
      | undefined
      | string;
    if (!isNil(createDraggerModal)) {
      open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }
  const modalNode = (
    <CreateDraggerModal
      open={isOpen}
      onCancel={close}
      initialComponentName={
        (router.query.initialComponentName as string) || undefined
      }
      onOk={() => {
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
