import { useSetterContext } from '@prototyper/core';
import { Button, Form, Input, Switch, Typography } from 'antd';
import React, { useState } from 'react';

export const NodeSetter = () => {
  const { forVal, hiddenVal, slot, forKey, setFor, setHidden, setSlot } =
    useSetterContext();
  const [changed, setChanged] = useState(false);
  const [form] = Form.useForm();
  const formForVal = Form.useWatch('forVal', form);
  const onCommit = (obj) => {
    setFor(obj.forVal, obj.forKey);
    setSlot(obj.slot);
    setHidden(obj.hiddenVal);
    setChanged(false);
  };
  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={onCommit}
      onValuesChange={() => setChanged(true)}
    >
      <Form.Item>
        <Typography>
          <Typography.Text>节点通用配置</Typography.Text>
        </Typography>
      </Form.Item>
      <Form.Item label="隐藏节点" name="hiddenVal" initialValue={hiddenVal}>
        <Input placeholder="输入Bool格式的JS表达式"></Input>
      </Form.Item>
      <Form.Item label="重复节点" name="forVal" initialValue={forVal}>
        <Input placeholder="输入数组格式的JS表达式"></Input>
      </Form.Item>
      {formForVal ? (
        <Form.Item label="循环索引" name="forKey" initialValue={forKey}>
          <Input placeholder="默认为'#{loop.index}',请输入格式化字符串"></Input>
        </Form.Item>
      ) : null}
      <Form.Item
        label="作为槽"
        name="slot"
        initialValue={slot}
        valuePropName="checked"
      >
        <Switch></Switch>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type={changed ? 'primary' : 'dashed'} htmlType="submit">
          {changed ? '提交修改' : '确定'}
        </Button>
      </Form.Item>
    </Form>
  );
};
