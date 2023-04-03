import { DirectDependencyLines } from '@/components/application/dependency/DirectDependencyLines';
import { ResourceLines } from '@/components/application/dependency/ResourceLines';
import { ResourceTreeMap } from '@/components/application/dependency/ResourceTreeMap';
import { PageMain } from '@/layout/PageMain';
import { Typography } from 'antd';

export default function Page() {
  return (
    <>
      <PageMain>
        <Typography.Title level={2}>资源分析</Typography.Title>
        <Typography.Paragraph></Typography.Paragraph>
        <ResourceTreeMap />
        <Typography.Title level={2}>直接依赖</Typography.Title>
        <DirectDependencyLines />
        <Typography.Title level={2}>所有依赖(按拓扑顺序)</Typography.Title>
        <ResourceLines />
      </PageMain>
    </>
  );
}
