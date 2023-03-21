import { Alert, Spin } from 'antd';
import { FullPageCenter } from './FullPageCenter';
import { LoadingOutlined } from '@ant-design/icons';
import Head from 'next/head';

export function LoadingPage(props: {
  title?: string;
  message?: string;
  description?: string;
}) {
  const message = props.message || '正在加载...';
  const title = props.title || message;
  return (
    <FullPageCenter background="light-grey">
      <Head>
        <title key="loading">{title}</title>
      </Head>
      <Alert
        type="info"
        showIcon
        icon={<Spin indicator={<LoadingOutlined spin />} />}
        message={message}
        description={props.description}
      ></Alert>
    </FullPageCenter>
  );
}
