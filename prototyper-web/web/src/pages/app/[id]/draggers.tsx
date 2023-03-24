import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { JsonView } from '@/components/gizmo/JsonView';
import { PageMain } from '@/layout/PageMain';
import { Card } from 'antd';

export default function Page() {
  const app = useApplicationInfo();
  return (
    <>
      <PageMain></PageMain>

      <FullPageCenter>
        <Card>
          <JsonView src={app.mainPackage}></JsonView>
        </Card>
      </FullPageCenter>
    </>
  );
}
