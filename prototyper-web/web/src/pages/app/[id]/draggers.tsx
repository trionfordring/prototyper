import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { EditCatalogue } from '@/components/dragger/EditCatalogue';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { PageMain } from '@/layout/PageMain';
import { Card } from 'antd';

export default function Page() {
  const app = useApplicationInfo();
  return (
    <>
      <PageMain></PageMain>

      <FullPageCenter>
        <Card>
          <EditCatalogue initCatalogue={app.mainPackage.catalogue || []} />
        </Card>
      </FullPageCenter>
    </>
  );
}
