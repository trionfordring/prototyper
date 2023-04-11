import { useQueryState } from '@/hooks/useQueryState';
import { useApplications } from '@/remote/application';
import { getQueryString } from '@/utils/getQueryString';
import {
  LinkOutlined,
  LoadingOutlined,
  MoreOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Space, Spin, Pagination, Input, Card, Tooltip, Button } from 'antd';
import styled from 'styled-components';
import { ApplicationPlayLink } from './ApplicationPlayLink';
import { ReadmeMarkdown } from './ReadmeMarkdown';

const ListEl = styled.div``;
const Content = styled.div`
  min-height: 350px;
`;
const Header = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 12px;
`;

export function UserApplicationList() {
  const [page, setPage] = useQueryState(
    'page',
    1,
    (p) => Number(getQueryString(p)) || 1
  );
  const [pageSize, setPageSize] = useQueryState(
    'pageSize',
    10,
    (p) => Number(getQueryString(p)) || 10
  );
  const [searchKey, setSearchKey] = useQueryState('search', '', getQueryString);

  const { applications, pagination, isLoading } = useApplications(searchKey, {
    page,
    pageSize,
  });
  return (
    <ListEl>
      <Header>
        <Space>
          搜索应用:{' '}
          <Input.Search
            placeholder="通过名称检索"
            onSearch={(s) => {
              if (s === searchKey) return;
              setPage(1);
              setSearchKey(s);
            }}
          />
        </Space>
      </Header>
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined spin />}
        tip="正在载入"
      >
        <Content>
          {applications?.map((app) => (
            <ApplicationItem key={app.id} application={app} />
          ))}
        </Content>
        <Pagination
          showQuickJumper
          showSizeChanger
          showTotal={(total, range) =>
            `${range[0]}-${range[1]}(共计${total}个应用)`
          }
          pageSizeOptions={[5, 10, 15, 20]}
          pageSize={pagination?.pageSize || pageSize}
          total={pagination?.total}
          current={pagination?.page || page}
          onChange={(pageNumber, pageSize) => {
            setPage(pageNumber);
            setPageSize(pageSize);
          }}
          style={{
            float: 'right',
          }}
        />
      </Spin>
    </ListEl>
  );
}

const Item = styled(Card)`
  margin-bottom: 8px;
  .more-icon {
    font-size: 1.3em;
  }
`;

type InferArray<T> = T extends Array<infer E> ? E : never;
function ApplicationItem({
  application,
}: {
  application: InferArray<ReturnType<typeof useApplications>['applications']>;
}) {
  const [current, setCurrent] = useQueryState(
    'current',
    undefined,
    getQueryString
  );
  return (
    <Item
      title={
        <ApplicationPlayLink appName={application.name}>
          <Space>
            {application.label || application.name}
            <PlayCircleOutlined />
          </Space>
        </ApplicationPlayLink>
      }
    >
      <p>
        <Tooltip
          title="查看应用Readme"
          color="geekblue"
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={() =>
              setCurrent((c) => {
                if (c !== application.name) return application.name;
                return undefined;
              })
            }
          />
        </Tooltip>
        {application.description}
      </p>
      {current === application.name ? (
        <ReadmeMarkdown value={application.readme} />
      ) : null}
    </Item>
  );
}
