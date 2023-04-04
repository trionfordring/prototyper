import { DependenciesForm } from '@/components/application/dependency/DependenciesForm';
import { ApplicationInfoSettings } from '@/components/application/settings/ApplicationInfoSettings';
import { PageMain } from '@/layout/PageMain';
import { PageSecondary } from '@/layout/PageSecondary';
import { Typography } from 'antd';

export default function Page() {
  return (
    <>
      <PageMain>
        <Typography.Title level={2} id="info">
          应用基本信息
        </Typography.Title>
        <PageSecondary>
          <ApplicationInfoSettings />
        </PageSecondary>
        <Typography.Title level={2} id="depencency">
          应用依赖
        </Typography.Title>
        <PageSecondary>
          <DependenciesForm />
        </PageSecondary>
      </PageMain>
    </>
  );
}
