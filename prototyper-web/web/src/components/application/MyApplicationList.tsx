import { useQueryState } from '@/hooks/useQueryState';
import { useMyApplications } from '@/remote/application';
import { getQueryString } from '@/utils/getQueryString';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  Pagination,
  Space,
  Spin,
  Typography,
} from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

const ListEl = styled.div``;
const Content = styled.div`
  min-height: 350px;
`;
const Header = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 12px;
`;

export function MyApplicationList() {
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
  const { applications, pagination, isLoading } = useMyApplications(
    page,
    pageSize
  );
  return (
    <ListEl>
      <Header>
        <Space>
          <Link legacyBehavior passHref href="/me/apps/create">
            <Button type="primary" icon={<PlusOutlined />}>
              创建新应用
            </Button>
          </Link>
        </Space>
      </Header>
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined spin />}
        tip="正在载入"
      >
        <Content>
          {applications?.map((app) => (
            <MyApplicationItem key={app.id} application={app} />
          ))}
        </Content>
      </Spin>

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
        onChange={(pageNumber, newPageSize) => {
          setPage(pageNumber);
          if (newPageSize !== pageSize) setPageSize(newPageSize);
        }}
        style={{
          float: 'right',
        }}
      />
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
function MyApplicationItem({
  application,
}: {
  application: InferArray<ReturnType<typeof useMyApplications>['applications']>;
}) {
  const moreMenu: MenuProps = {
    items: [
      {
        key: 'editor',
        label: (
          <Link
            passHref
            legacyBehavior
            href={{
              pathname: '/app/[id]',
              query: {
                id: application.id,
              },
            }}
          >
            <Typography.Link>
              <Space>
                <LinkOutlined />
                打开应用编辑器
              </Space>
            </Typography.Link>
          </Link>
        ),
      },
      {
        key: 'edit',
        label: (
          <Link
            passHref
            legacyBehavior
            href={{
              pathname: '/app/[id]/settings',
              hash: 'info',
              query: {
                id: application.id,
              },
            }}
          >
            <Typography.Link>
              <Space>
                <EditOutlined />
                编辑应用元信息
              </Space>
            </Typography.Link>
          </Link>
        ),
      },
      {
        icon: <DeleteOutlined />,
        key: 'delete',
        label: '删除应用',
        danger: true,
        onClick: async () => {},
      },
    ],
  };
  return (
    <Item
      title={
        <Link
          passHref
          legacyBehavior
          href={{
            pathname: '/app/[id]',
            query: {
              id: application.id,
            },
          }}
        >
          <Typography.Link>
            <Space>
              {application.label || application.name}
              <LinkOutlined />
            </Space>
          </Typography.Link>
        </Link>
      }
      extra={
        <Dropdown placement="bottom" trigger={['click']} menu={moreMenu}>
          <EllipsisOutlined className="more-icon" />
        </Dropdown>
      }
    >
      <p>{application.description}</p>
    </Item>
  );
}
