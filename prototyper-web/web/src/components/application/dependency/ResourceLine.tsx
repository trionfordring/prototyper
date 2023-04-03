import { HOST } from '@/env';
import { SimplePackageType } from '@/remote/package-gql';
import { PackageType, ResourceUrl } from '@/types/resourcePackage';
import { Space, Tag, TagProps, Typography } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';

const LineBox = styled.div<{
  height: string;
}>`
  height: ${({ height }) => height};
  line-height: ${({ height }) => height};
  width: 100%;
  background-color: rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  z-index: 25;
  .title {
    min-width: 25em;
  }
`;

const ProgressInner = styled.div<{
  progressWidth?: string;
}>`
  background-color: rgba(22, 119, 255, 0.1);
  height: 100%;
  width: ${({ progressWidth }) => {
    return progressWidth || 0;
  }};
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding-left: 12px;
`;

export type ResourceLineType = {
  url?: ResourceUrl;
} & Omit<SimplePackageType, 'creator'>;

export function ResourceLine({
  progressWidth,
  resourceLine,
}: {
  progressWidth?: string;
  resourceLine: ResourceLineType;
}) {
  return (
    <LineBox height="48px">
      <ProgressInner progressWidth={progressWidth} />
      <Content>
        <Space>
          <div className="title">
            <Space>
              <h3>
                {resourceLine.name}@{resourceLine.version || '0.0.0'}
              </h3>
              <ResourceTypeTag type={resourceLine.type} />
            </Space>
          </div>
          {resourceLine.url ? (
            <>
              <Typography.Text type="secondary" className="filename">
                文件名: {resourceLine.url.name}
              </Typography.Text>
              <Typography.Text type="secondary" className="path">
                资源路径:
                <Typography.Link
                  target="_blank"
                  href={`${HOST}${resourceLine.url.url}`}
                >
                  {resourceLine.url.url}
                </Typography.Link>
              </Typography.Text>
              <Typography.Text className="size">
                ({resourceLine.url.size} KB)
              </Typography.Text>
            </>
          ) : null}
        </Space>
      </Content>
    </LineBox>
  );
}

function ResourceTypeTag({ type }: { type: PackageType }) {
  const props = useMemo<TagProps>(() => {
    switch (type) {
      case 'lib':
        return {
          color: 'blue',
        };
      case 'material':
        return {
          color: 'volcano',
        };
      case 'application':
        return {
          color: 'purple',
        };
      default:
        return {};
    }
  }, [type]);
  return <Tag {...props}>{type}</Tag>;
}
