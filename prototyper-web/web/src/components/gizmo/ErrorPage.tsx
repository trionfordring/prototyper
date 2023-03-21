import Head from 'next/head';
import { FullPageCenter } from './FullPageCenter';
import { Alert, Space, Typography } from 'antd';
import Link from 'next/link';

export function ErrorPage(props: {
  title?: string;
  message?: string;
  description?: React.ReactNode;
}) {
  const message = props.message || '出现错误.';
  const title = props.title || message;
  return (
    <FullPageCenter background="light-grey">
      <Head>
        <title key="loading">{title}</title>
      </Head>
      <Alert
        type="error"
        showIcon
        message={message}
        description={
          <Space>
            {props.description}
            <Link legacyBehavior passHref href="/">
              <Typography.Link>返回主页</Typography.Link>
            </Link>
          </Space>
        }
      ></Alert>
    </FullPageCenter>
  );
}
