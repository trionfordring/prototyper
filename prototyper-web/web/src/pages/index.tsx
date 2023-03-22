import Head from 'next/head';
import { useAuthChecker } from '@/hooks/useAuthChecker';
import { Avatar, Card, InputNumber, List, Typography } from 'antd';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { useApplications } from '@/remote/application';
import { useMemo, useState } from 'react';
import { MeSmallInfo } from '@/components/me/MeSmallInfo';
import Link from 'next/link';
import { PageHeader } from '@/layout/PageHeader';

export default function Home() {
  useAuthChecker();
  const [page, setPage] = useState<number | null>(1);
  const { applications, pagination } = useApplications(page || 1);
  const pageInfo = useMemo(() => {
    if (!pagination) return <></>;
    const { page, pageCount, pageSize, total } = pagination;
    return (
      <span>
        (页码{page}/{pageCount}, 总共{total}条,每页显示{pageSize}条)
      </span>
    );
  }, [pagination]);
  return (
    <>
      <Head>
        <title>Prototyper</title>
      </Head>
      <PageHeader
        nav={[
          {
            href: '/',
            label: '总览',
          },
          {
            href: '/materials',
            label: '物料市场',
          },
          {
            href: '/me/apps',
            label: '我的应用',
          },
          {
            href: '/me',
            label: '用户信息',
          },
        ]}
      />
      <FullPageCenter background="light-grey">
        <Card
          className="shadow-box"
          style={{
            width: '500px',
          }}
        >
          <Typography.Title level={3}>Home</Typography.Title>
          <Card>
            <MeSmallInfo />
          </Card>
          <Typography.Title level={3}>应用列表</Typography.Title>
          <div>
            当前页:
            <InputNumber
              value={page}
              size="small"
              onChange={(v) => setPage(v)}
            ></InputNumber>
            {pageInfo}
          </div>
          <List
            itemLayout="horizontal"
            dataSource={applications}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar>{item.id}</Avatar>}
                  title={
                    <Link
                      passHref
                      legacyBehavior
                      href={{
                        pathname: '/app/[id]',
                        query: {
                          id: item.id,
                        },
                      }}
                    >
                      <Typography.Link>
                        {item.label || item.name}
                      </Typography.Link>
                    </Link>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </FullPageCenter>
    </>
  );
}
