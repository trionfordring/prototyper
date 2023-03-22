import { useApplicationById } from '@/remote/application';
import { parseID } from '@/utils/parseID';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FullPageCenter } from '../components/gizmo/FullPageCenter';
import { Alert } from 'antd';
import { ApplicationInfoProvider } from '../components/context/ApplicationInfoProvider';
import { ApplicationPageHeader } from '../components/application/ApplicationPageHeader';
import { PropsWithChildren } from 'react';

export function ApplicationLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const id = parseID(router.query.id as string);
  const { application } = useApplicationById(id);
  if (!application)
    return (
      <>
        <Head>
          <title>正在加载应用信息...</title>
        </Head>
        <FullPageCenter background="light-grey">
          <Alert type="info" message="正在加载..."></Alert>
        </FullPageCenter>
      </>
    );
  return (
    <ApplicationInfoProvider application={application}>
      <Head>
        <title>{`Prototyper应用- ${
          application.label || application.name
        }`}</title>
      </Head>
      <ApplicationPageHeader />
      {children}
    </ApplicationInfoProvider>
  );
}
