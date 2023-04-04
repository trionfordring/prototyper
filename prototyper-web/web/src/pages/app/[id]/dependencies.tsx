import { DirectDependencyLines } from '@/components/application/dependency/DirectDependencyLines';
import { ResourceLines } from '@/components/application/dependency/ResourceLines';
import { ResourceTreeMap } from '@/components/application/dependency/ResourceTreeMap';
import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { PageMain } from '@/layout/PageMain';
import { Button, Switch, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

const FloatRight = styled.div`
  float: right;
`;

const LinesBox = styled.div``;

const EMBEDDED_DEPS = [
  'react',
  'react-is',
  'styled-components',
  'lodash',
  'react-dom',
  '@prototyper/core',
  '@prototyper/previewer',
];

export default function Page() {
  const app = useApplicationInfo();
  const [showEmbedded, setShowEmbedded] = useState(true);
  return (
    <>
      <PageMain>
        <Typography.Title level={2}>
          直接依赖
          <FloatRight>
            <Link
              passHref
              legacyBehavior
              href={{
                pathname: '/app/[id]/settings',
                query: {
                  id: app.id,
                  editing: 'depencency',
                },
                hash: 'depencency',
              }}
            >
              <Button type="text">管理依赖</Button>
            </Link>
          </FloatRight>
        </Typography.Title>
        <DirectDependencyLines />
        <Typography.Title level={2}>资源分析</Typography.Title>
        <ResourceTreeMap />
        <Typography.Title level={2}>
          所有依赖(按拓扑顺序)
          <FloatRight>
            <Tooltip title={<p>是否显示内置依赖</p>}>
              <Switch
                checkedChildren="全部"
                unCheckedChildren="主要"
                checked={showEmbedded}
                onChange={setShowEmbedded}
              />
            </Tooltip>
          </FloatRight>
        </Typography.Title>
        <LinesBox>
          <ResourceLines linesExclude={showEmbedded ? [] : EMBEDDED_DEPS} />
        </LinesBox>
      </PageMain>
    </>
  );
}
