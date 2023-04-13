import { ApplicationInfoProvider } from '@/components/context/ApplicationInfoProvider';
import { ComponentEditor } from '@/components/editor';
import { ErrorPage } from '@/components/gizmo/ErrorPage';
import { LoadingPage } from '@/components/gizmo/LoadingPage';
import { useApplicationById } from '@/remote/application';
import { useFlatDevDependencies } from '@/remote/package';
import { isNil } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function Page() {
  const router = useRouter();
  const name = router.query.name as string;
  const appId = router.query.id as string;
  const { application } = useApplicationById(appId);
  const pkg = application?.mainPackage;
  const namespace = pkg?.name;
  const { flatDevDependencies } = useFlatDevDependencies(pkg?.id);
  const componentInfo = useMemo(() => {
    if (isNil(pkg)) return undefined;
    return pkg.components?.find((c) => c.name === name);
  }, [pkg, name]);
  if (isNil(pkg) || isNil(flatDevDependencies)) {
    return <LoadingPage message="正在加载资源包..." />;
  }
  if (isNil(componentInfo)) return <ErrorPage message="找不到对应组件" />;
  return (
    <>
      <Head>
        <title>{`正在编辑[${componentInfo.name}]`}</title>
      </Head>
      <ApplicationInfoProvider application={application}>
        <ComponentEditor
          resources={flatDevDependencies}
          baseurl={encodeURI(`/edit/${appId}/${name}`)}
          index={{
            name,
            namespace,
          }}
        />
      </ApplicationInfoProvider>
    </>
  );
}
