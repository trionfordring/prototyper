import { useCreateComponentModal } from '@/components/component/CreateComponentForm';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { JsonView } from '@/components/gizmo/JsonView';
import { HOST } from '@/env';
import { useApplicationById } from '@/remote/application';
import { parseID } from '@/utils/parseID';
import { Alert, Button, Card, List, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const TestCard = styled(Card)`
  max-height: 800px;
  overflow-y: auto;
  margin: 15px;
  min-width: 200px;
`;

export default function Page() {
  const router = useRouter();
  const id = parseID(router.query.id as string);
  const { application } = useApplicationById(id);
  const { modalNode, open: openCreateComponentModal } = useCreateComponentModal(
    application?.mainPackage?.id,
    id
  );
  if (!application)
    return (
      <>
        <Head>
          <title>正在加载应用信息...</title>
        </Head>
        <FullPageCenter background="light-grey">
          <Alert type="info" message="正在加载..."></Alert>
        </FullPageCenter>
      </>
    );
  return (
    <>
      <FullPageCenter background="light-grey">
        <TestCard title="Application信息" className="box-shadow">
          <JsonView src={application || {}}></JsonView>
        </TestCard>
        <TestCard className="box-shadow">
          <Typography.Paragraph>
            <Typography.Link
              href={`${HOST}/api/preview/${encodeURIComponent(
                application.name
              )}`}
              target="_blank"
            >
              访问应用首页
            </Typography.Link>
          </Typography.Paragraph>
          <Typography.Paragraph>
            {modalNode}
            <Button onClick={openCreateComponentModal}>创建组件</Button>
          </Typography.Paragraph>
          {application.mainPackage ? (
            <>
              <Typography.Title level={3}>组件列表</Typography.Title>
              <List
                dataSource={application.mainPackage.components}
                renderItem={(item) => (
                  <>
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={
                          <Link
                            passHref
                            legacyBehavior
                            href={{
                              pathname: '/edit/[namespace]/[name]',
                              query: {
                                namespace: application.mainPackage!.name,
                                name: item.name,
                                appId: id,
                              },
                            }}
                          >
                            <Typography.Link>
                              {item.label || item.name}
                            </Typography.Link>
                          </Link>
                        }
                      />
                    </List.Item>
                  </>
                )}
              />
            </>
          ) : null}
        </TestCard>
      </FullPageCenter>
    </>
  );
}
