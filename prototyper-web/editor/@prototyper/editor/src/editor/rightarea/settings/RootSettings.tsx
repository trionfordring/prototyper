import {
  LinkOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  EmbeddedComponentRenderer,
  ProtoComponent,
  ProtoElementType,
  SetterRootContextProvider,
  WithDescriptor,
  useApplicationContext,
} from '@prototyper/core';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  AutoCompleteSetter,
  BoolSetter,
  SegmentedSetter,
  SetterForm,
  SliderSetter,
  TextSetter,
} from '../../../setter';
import { ComponentEditorMeta } from '../../../types/ComponentEditorMeta';
import { META_EDITOR_KEY } from '../../../types/SerializedProtoComponent';
import {
  AutoSettingsStruct,
  SerializedSettings,
} from '../../../types/SerializedSettings';

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

export const RootSettings = ({
  onEditComponentSettings,
  onSettingsMetaChange = noop,
}: {
  onEditComponentSettings?: (
    component: ProtoComponent & Partial<WithDescriptor>
  ) => void;
  onSettingsMetaChange?: (settingsMeta?: SerializedSettings) => void;
}) => {
  const { currentComponent } = useApplicationContext();
  const { settings: nativeSettings, meta: componentMeta = {} } =
    currentComponent;
  const { [META_EDITOR_KEY]: meta = {} } = componentMeta;
  const { settings: settingsInfo } = meta as ComponentEditorMeta;
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  function initType() {
    if (!settingsInfo && !nativeSettings) return 'none';
    return settingsInfo?.type || 'native';
  }
  const [type, setType] = useState(initType);

  function toggleEditingMode(checked: boolean) {
    if (!checked) form.submit();
    else
      form.setFieldsValue({
        settingsStruct: settingsInfo?.settingsStruct,
        descriptor: settingsInfo?.descriptor,
      });
    setEditing(checked);
  }
  function onFinish(data) {
    onSettingsMetaChange({
      type: type,
      settingsStruct: data.settingsStruct,
      descriptor: data.descriptor,
    });
    setEditing(false);
    reset();
  }
  function reset() {
    form.resetFields();
    setEditing(false);
  }
  useEffect(
    () => setType(initType),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settingsInfo || undefined]
  );
  const autoForm = (
    <Form.List name="settingsStruct">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }) => (
            <AutoFormItem key={key} name={name} remove={remove} />
          ))}
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              添加字段
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
  const componentForm = (
    <React.Fragment>
      <Form.Item label="组件id">
        <Space style={{ display: 'flex' }} align="baseline">
          <Form.Item
            name={['descriptor', 'namespace']}
            initialValue={settingsInfo?.descriptor?.namespace}
            noStyle
          >
            <Input placeholder="namespace"></Input>
          </Form.Item>
          .
          <Form.Item
            name={['descriptor', 'name']}
            initialValue={settingsInfo?.descriptor?.name}
            noStyle
          >
            <Input placeholder="name"></Input>
          </Form.Item>
        </Space>
      </Form.Item>
      {onEditComponentSettings && (
        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <Button
            type="dashed"
            block
            icon={<LinkOutlined />}
            onClick={() => onEditComponentSettings(currentComponent)}
          >
            选择/创建 组件
          </Button>
        </Form.Item>
      )}
    </React.Fragment>
  );

  const editForm = (
    <Form
      style={{
        minHeight: '300px',
      }}
      form={form}
      onFinish={onFinish}
      onValuesChange={() => setChanged(true)}
    >
      {type === 'auto' && autoForm}
      {type === 'component' && componentForm}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Space>
          <Button type={changed ? 'primary' : 'dashed'} htmlType="submit">
            {changed ? '提交修改' : '确定'}
          </Button>
          <Button onClick={reset}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
  return (
    <React.Fragment>
      <FormHeader>
        <Select
          style={{
            flexGrow: 1,
          }}
          value={type}
          options={[
            { value: 'none', label: '无组件设置器' },
            { value: 'auto', label: '简单配置组件设置器' },
            { value: 'component', label: '从组件库中选择组件设置器' },
            { value: 'native', label: '内嵌组件设置器' },
          ]}
          onChange={setType}
          disabled={!editing}
        ></Select>
        <Switch
          checkedChildren="应用"
          unCheckedChildren="编辑"
          checked={editing}
          onChange={toggleEditingMode}
        ></Switch>
      </FormHeader>
      {editing ? (
        editForm
      ) : (
        <RenderSettings
          {...settingsInfo}
          type={type}
          nativeComponent={nativeSettings}
        />
      )}
    </React.Fragment>
  );
};

function AutoFormItem({ name, remove }) {
  return (
    <>
      <Divider
        dashed
        style={{
          margin: '8px 0',
        }}
      />
      <Row align="middle">
        <Col span={22}>
          <Form.Item
            name={[name, 'settingType']}
            label="输入类型"
            labelCol={{ span: 5 }}
          >
            <Select
              options={[
                { value: 'text', label: '通用输入' },
                { value: 'bool', label: '布尔输入' },
                { value: 'auto-complete', label: '带提示输入' },
                { value: 'segmented', label: '分段选择' },
                { value: 'slider', label: '滑动选择' },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item name={[name, 'label']} label="标签" labelCol={{ span: 5 }}>
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[name, 'propName']}
            label="属性名"
            labelCol={{ span: 5 }}
          >
            <Input></Input>
          </Form.Item>
        </Col>
        <Col span={2}>
          <MinusCircleOutlined
            onClick={() => remove(name)}
            style={{
              width: '100%',
              fontSize: '1.5em',
              color: '#f5222d',
            }}
          />
        </Col>
      </Row>
    </>
  );
}

function RenderSettings({
  type,
  descriptor,
  nativeComponent: NativeComponent,
  settingsStruct,
}: SerializedSettings & {
  nativeComponent?: ProtoElementType;
}) {
  const node = (() => {
    switch (type) {
      case 'auto':
        return <AutoSettingsRender struct={settingsStruct} />;
      case 'component':
        return <EmbeddedComponentRenderer descriptor={descriptor} />;
      case 'native':
        return <NativeComponent />;
      case 'none':
      default:
        return null;
    }
  })();
  return <SetterRootContextProvider>{node}</SetterRootContextProvider>;
}

function AutoSettingsRender({ struct = [] }: { struct: AutoSettingsStruct }) {
  const nodes = struct.map(({ settingType, ...props }, index) => {
    switch (settingType) {
      case 'auto-complete':
        return <AutoCompleteSetter key={index} {...props} />;
      case 'bool':
        return <BoolSetter key={index} {...props} />;
      case 'segmented':
        return <SegmentedSetter key={index} {...props} />;
      case 'slider':
        return <SliderSetter key={index} {...props} />;
      case 'text':
      default:
        return <TextSetter key={index} {...props} />;
    }
  });
  return <SetterForm>{nodes}</SetterForm>;
}
