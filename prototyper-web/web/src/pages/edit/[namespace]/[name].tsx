import { ComponentEditor } from '@/components/editor';
import { ErrorPage } from '@/components/gizmo/ErrorPage';
import { LoadingPage } from '@/components/gizmo/LoadingPage';
import { useFlatDevDependencies, usePackageByName } from '@/remote/package';
import { isNil } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function Page() {
  const router = useRouter();
  const name = router.query.name as string;
  const namespace = router.query.namespace as string;
  const { pkg } = usePackageByName(namespace);
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
      <ComponentEditor
        resources={flatDevDependencies}
        index={{
          name,
          namespace,
        }}
      />
    </>
  );
}
