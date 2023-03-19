import { login, useMe } from '@/remote';
import { Button, Form, Input, Typography } from 'antd';
import { noop } from 'lodash';
import Link from 'next/link';
import { memo, useState } from 'react';
import { UrlObject } from 'url';
import { MeSmallInfo } from '../me/MeSmallInfo';
import { ClientError } from 'graphql-request';
import { ProcessClientError } from '../gizmo/ProcessClientError';
import { useRouter } from 'next/router';

export function LoginForm({
  gotoWhenLoggedin = '/',
}: {
  gotoWhenLoggedin?: string | UrlObject;
}) {
  const { me, hasLoggedin } = useMe();
  const router = useRouter();
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
        用户登录
      </Typography.Title>
      <LoginByPassword
        onLoginSuccess={() => router.replace(gotoWhenLoggedin)}
      ></LoginByPassword>
    </>
  );
}

const LoginByPassword = memo(
  ({ onLoginSuccess = noop }: { onLoginSuccess?: () => void }) => {
    const [error, setError] = useState<ClientError>();
    function onFinish(data: Record<string, any>) {
      login({
        identifier: data.identifier,
        password: data.password,
      })
        .then(onLoginSuccess)
        .catch((err) => {
          setError(err);
        });
    }
    return (
      <Form
        labelAlign="left"
        labelWrap
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
      >
        {error ? <ProcessClientError err={error} /> : null}
        <Form.Item
          name="identifier"
          label="账号"
          // rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          // rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input type="password"></Input>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
);
