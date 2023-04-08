import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { MeSmallInfo } from '@/components/me/MeSmallInfo';
import { useAuthChecker } from '@/hooks/useAuthChecker';
import { IndexLayout } from '@/layout/IndexLayout';
import { Card } from 'antd';
import Head from 'next/head';

export default function Page() {
  useAuthChecker();
  return (
    <IndexLayout>
      <Head>
        <title>Prototyper</title>
      </Head>
      <FullPageCenter background="light-grey">
        <Card
          className="shadow-box"
          style={{
            width: '500px',
          }}
        >
          <MeSmallInfo />
        </Card>
      </FullPageCenter>
    </IndexLayout>
  );
}
