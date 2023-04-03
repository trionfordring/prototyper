import { DirectDependencyLines } from '@/components/application/dependency/DirectDependencyLines';
import { ResourceLines } from '@/components/application/dependency/ResourceLines';
import { ResourceTreeMap } from '@/components/application/dependency/ResourceTreeMap';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { PageMain } from '@/layout/PageMain';
import { Button, Typography } from 'antd';
import Link from 'next/link';

export default function Page() {
  const app = useApplicationInfo();
  return (
    <>
      <PageMain>
        <Typography.Title level={2}>
          直接依赖
          <div style={{ float: 'right' }}>
            <Link
              passHref
              legacyBehavior
              href={{
                pathname: '/app/[id]/settings',
                query: {
                  id: app.id,
                  editing: 'denpendency',
                },
                hash: 'denpendency',
              }}
            >
              <Button type="text">管理依赖</Button>
            </Link>
          </div>
        </Typography.Title>
        <DirectDependencyLines />
        <Typography.Title level={2}>资源分析</Typography.Title>
        <ResourceTreeMap />
        <Typography.Title level={2}>所有依赖(按拓扑顺序)</Typography.Title>
        <ResourceLines />
      </PageMain>
    </>
  );
}
