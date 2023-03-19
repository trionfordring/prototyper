import { ComponentEditor } from '@/components/editor';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
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
    return (
      <>
        <Head>
          <title>正在加载资源包...</title>
        </Head>
        <FullPageCenter background="light-grey"></FullPageCenter>
      </>
    );
  }
  if (isNil(componentInfo)) return <></>;
  return (
    <>
      <Head>
        <title>{`正在编辑[${componentInfo.name}]`}</title>
      </Head>
      {/* <FullPageCenter background="light-grey">
        <Card
          style={{
            maxHeight: '800px',
            overflowY: 'auto',
          }}
        >
          <Typography.Title level={3}>包信息</Typography.Title>
          <JsonView src={pkg || {}}></JsonView>
          <Typography.Title level={3}>展开依赖</Typography.Title>
          <JsonView src={flatDevDependencies || []}></JsonView>
        </Card>
      </FullPageCenter> */}
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
