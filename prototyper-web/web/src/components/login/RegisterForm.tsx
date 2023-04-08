import { register, useMe } from '@/remote';
import { Typography, Form, Input, Space, Button } from 'antd';
import { ClientError } from 'graphql-request';
import { noop } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ProcessClientError } from '../gizmo/ProcessClientError';
import { MeSmallInfo } from '../me/MeSmallInfo';

export function RegisterForm({
  gotoWhenLoggedin = '/',
}: {
  gotoWhenLoggedin?: string;
}) {
  const { me, hasLoggedin } = useMe();
  const router = useRouter();
  const [error, setError] = useState<ClientError>();
  function onFinish(data: Record<string, any>) {
    register({
      username: data.username,
      email: data.email,
      password: data.password,
    })
      .then(() => router.replace(gotoWhenLoggedin))
      .catch((err) => {
        setError(err);
      });
  }
  if (me && hasLoggedin) {
    return (
      <>
        <Typography.Paragraph>
          您已经登录,
          <Link href={gotoWhenLoggedin} replace passHref legacyBehavior>
            <Typography.Link strong>点此继续</Typography.Link>
          </Link>
        </Typography.Paragraph>
        <MeSmallInfo gotoLogin={noop} />
      </>
    );
  }
  return (
    <>
      <Typography.Title level={3} className="margin text-align-center">
        用户注册
      </Typography.Title>
      <Form
        labelAlign="left"
        labelWrap
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
        size="large"
      >
        {error ? <ProcessClientError err={error} /> : null}
        <Form.Item
          name="username"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱账户' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '最少输入六位密码' },
          ]}
        >
          <Input type="password"></Input>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
            <Link
              passHref
              legacyBehavior
              href={{
                pathname: '/login',
                query: {
                  source: gotoWhenLoggedin,
                },
              }}
            >
              <Typography.Link>已有账号? 直接登录</Typography.Link>
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
