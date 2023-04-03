import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { useCreateDraggerModal } from '@/components/dragger/CreateDragger';
import { DraggerList } from '@/components/dragger/DraggerList';
import { EditCatalogue } from '@/components/dragger/EditCatalogue';
import { PageMain } from '@/layout/PageMain';
import { useUpdateCatalogue } from '@/remote/package';
import { Button, Card, Divider } from 'antd';
import styled from 'styled-components';

const FlexBox = styled.div`
  display: flex;
  position: relative;
  z-index: 10;
  gap: 12px;
  h2 {
    margin-bottom: 12px;
  }
`;
const CenterCard = styled(Card)`
  margin: 0 auto;
`;
const CatalogueCard = styled.div`
  margin: 0 auto;
  min-width: 560px;
  width: 35vw;
  max-width: 1440px;
`;

export default function Page() {
  const app = useApplicationInfo();
  const { modalNode, open } = useCreateDraggerModal();
  const { updateCatalogue } = useUpdateCatalogue();
  return (
    <>
      {modalNode}
      <PageMain>
        <FlexBox>
          <CatalogueCard>
            <h2>导出目录编辑</h2>
            <EditCatalogue
              initialValue={app.mainPackage?.catalogue || []}
              onSave={updateCatalogue}
            />
          </CatalogueCard>
        </FlexBox>
        <Divider></Divider>
        <FlexBox>
          <div>
            <h2>导出</h2>
            <Button onClick={open}>添加导出</Button>
          </div>
          <CenterCard>
            <DraggerList />
          </CenterCard>
        </FlexBox>
      </PageMain>
    </>
  );
}
