import { ComponentCard } from '@/components/component/ComponentCard';
import { useCreateComponentModal } from '@/components/component/CreateComponentForm';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { PageMain } from '@/layout/PageMain';
import { FileAddOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input } from 'antd';
import { groupBy, identity, map, toLower, trim } from 'lodash';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

const ListBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 12px;
  justify-content: space-between;
`;

function match(searchKey?: string, matchStr?: string) {
  if (!searchKey) return true;
  if (!matchStr) return false;
  const keys = searchKey.split(' ').map(trim).map(toLower).filter(identity);
  const toBeMatch = toLower(matchStr);
  return !keys.some((key) => !toBeMatch.includes(key));
}

export default function Page() {
  const application = useApplicationInfo();
  const { modalNode, open } = useCreateComponentModal();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const groupComponents = useMemo(() => {
    const datasrc = application.mainPackage?.components || [];
    const filtered = searchKey
      ? datasrc.filter((c) => match(searchKey, c.name + c.label))
      : datasrc;
    const groupComponents = groupBy(filtered, (c) => c.type || '组件');
    return groupComponents;
  }, [application.mainPackage?.components, searchKey]);
  return (
    <PageMain>
      <Card className="box-shadow">
        <Header>
          <div>
            {modalNode}
            <Button type="primary" icon={<FileAddOutlined />} onClick={open}>
              创建组件
            </Button>
          </div>
          <div>
            <Input.Search
              size="large"
              enterButton
              placeholder="检索组件"
              onSearch={(k) => {
                console.log(k);
                setSearchKey(k);
              }}
            />
          </div>
        </Header>
        {map(groupComponents, (components, type) => (
          <ListBox key={type}>
            <Divider orientation="left" className="no-margin">
              {type}
            </Divider>
            {components.map((component) => (
              <ComponentCard key={component.id} componentInfo={component} />
            ))}
          </ListBox>
        ))}
      </Card>
    </PageMain>
  );
}
