import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { LoginForm } from '@/components/login';
import { Card as AntdCard, ConfigProvider } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Card = styled(AntdCard)`
  max-width: 100%;
  width: 450px;
`;

export default function Login() {
  const router = useRouter();
  const { source = '/' } = router.query;
  return (
    <>
      <Head>
        <title>Prototyper - 用户登录</title>
      </Head>
      <FullPageCenter background="light-grey">
        <Card className="box-shadow">
          <ConfigProvider
            theme={{
              token: {
                fontSize: 18,
              },
            }}
          >
            <LoginForm gotoWhenLoggedin={source as string} />
          </ConfigProvider>
        </Card>
      </FullPageCenter>
    </>
  );
}
