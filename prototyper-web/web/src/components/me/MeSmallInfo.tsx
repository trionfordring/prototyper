import { useMe } from '@/remote';
import { Alert, Button, Descriptions } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function MeSmallInfo({
  gotoLogin: gotoLoginProps,
}: {
  gotoLogin?: () => void;
}) {
  const { me, logout, hasLoggedin } = useMe();
  const router = useRouter();
  const loginUrl = {
    pathname: '/login',
    query: {
      source: router.pathname,
    },
  };
  function defaultGotoLogin() {
    router.push(loginUrl);
  }
  const gotoLogin = gotoLoginProps || defaultGotoLogin;
  function doLogin(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    gotoLogin();
  }
  async function doLogout(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    await logout();
    gotoLogin();
  }
  if (!me || !hasLoggedin) {
    return (
      <Link href={loginUrl} onClick={doLogin}>
        <Alert
          message="尚未登录"
          description="登陆后即可查看您的用户信息。"
          type="warning"
          showIcon
        ></Alert>
      </Link>
    );
  }
  return (
    <Descriptions
      column={2}
      style={{
        whiteSpace: 'nowrap',
      }}
    >
      <Descriptions.Item label="当前用户">{me.username}</Descriptions.Item>
      <br />
      <Descriptions.Item label="认证邮箱">{me.email}</Descriptions.Item>
      <br />
      <Descriptions.Item label="权限组">{me.role?.name}</Descriptions.Item>
      <Descriptions.Item label="账户状态">
        {me.blocked ? '已封禁' : '已授权'}
      </Descriptions.Item>
      <Descriptions.Item span={2}>
        <Link href={loginUrl} passHref legacyBehavior>
          <Button danger onClick={doLogout}>
            登出
          </Button>
        </Link>
      </Descriptions.Item>
    </Descriptions>
  );
}
