import { ApplicationHomeHeader } from '@/components/application/ApplicationHomeHeader';
import { ApplicationPageHeader } from '@/components/application/ApplicationPageHeader';
import { ApplicationReadme } from '@/components/application/ApplicationReadme';
import { ApplicationInfoProvider } from '@/components/context/ApplicationInfoProvider';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { useApplicationById } from '@/remote/application';
import { parseID } from '@/utils/parseID';
import { Alert } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Page() {
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
      <ApplicationPageHeader />
      <ApplicationHomeHeader />
      <ApplicationReadme />
    </ApplicationInfoProvider>
  );
}
