import { SimpleComponentType } from '@/remote/component-gql';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
  FileOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Card, Dropdown, MenuProps, Tooltip, Typography, message } from 'antd';
import Link from 'next/link';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { updateComponentDescription } from '@/remote/component';

const StyledCard = styled(Card)`
  width: 300px;
  min-height: 120px;
  margin-bottom: 12px;
  .ant-card-head {
    padding: 0 12px;
  }
  .ant-card-body {
    padding: 8px;
  }
  .title-icon {
    margin-right: 0.1em;
    font-size: 1.2em;
  }
  .descriptor-icon {
    margin-left: 0.8em;
    font-size: 0.9em;
  }
  .edit-icon {
    padding-left: 0.5em;
  }
  .more-icon {
    font-size: 1.5em;
    padding: 5px;
  }
`;

export function ComponentCard({
  componentInfo,
  disableEdit = false,
}: {
  componentInfo: SimpleComponentType;
  disableEdit?: boolean;
}) {
  const application = useApplicationInfo();
  const [invaildDesc, setInvaildDesc] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [description, setDescription] = useState(componentInfo.description);
  const label = componentInfo.label || componentInfo.name;
  useEffect(() => {
    if (invaildDesc) {
      setInvaildDesc(false);
      setDescription(componentInfo.description);
    }
  }, [componentInfo, invaildDesc]);
  const MoreMenu: MenuProps = {
    items: [
      {
        icon: <EditOutlined />,
        key: 'editInfo',
        label: '编辑组件元信息',
      },
      {
        icon: <ExportOutlined />,
        key: 'export',
        label: '导出到拖拽面板',
      },
      {
        icon: <DeleteOutlined />,
        key: 'delete',
        label: '删除组件',
        danger: true,
      },
    ],
  };
  const titleNode = disableEdit ? (
    <span>
      <FileOutlined className="title-icon" />
      {label}
    </span>
  ) : (
    <Tooltip title="编辑组件" placement="bottom">
      <span>
        <Link
          legacyBehavior
          passHref
          key={componentInfo.id}
          href={{
            pathname: '/edit/[id]/[name]',
            query: {
              namespace: application.mainPackage!.name,
              name: componentInfo.name,
              id: application.id,
            },
          }}
        >
          <Typography.Link>
            {isUpdating ? (
              <LoadingOutlined className="title-icon" spin />
            ) : (
              <FileOutlined className="title-icon" />
            )}
            {label}
          </Typography.Link>
        </Link>
      </span>
    </Tooltip>
  );
  return (
    <StyledCard
      className="hover-shadow"
      title={
        <>
          {titleNode}
          <Tooltip
            placement="bottom"
            title={
              <span>
                组件描述符:{application.mainPackage.name}-{componentInfo.name}
              </span>
            }
          >
            <InfoCircleOutlined className="descriptor-icon" />
          </Tooltip>
        </>
      }
      extra={
        disableEdit ? undefined : (
          <Dropdown placement="bottom" trigger={['click']} menu={MoreMenu}>
            <EllipsisOutlined className="more-icon" />
          </Dropdown>
        )
      }
    >
      {contextHolder}
      <Typography.Paragraph
        ellipsis={{
          rows: 3,
          expandable: true,
          symbol: '显示更多',
        }}
        editable={
          disableEdit
            ? undefined
            : {
                autoSize: true,
                text: description,
                onChange: (value) => {
                  setDescription(value);
                  setIsUpdating(true);
                  updateComponentDescription(
                    componentInfo.id,
                    value,
                    application.id
                  )
                    .catch(() => {
                      messageApi.error('组件简介更新失败!');
                      setInvaildDesc(true);
                    })
                    .finally(() => setIsUpdating(false));
                },
              }
        }
      >
        {description || (
          <Typography.Text type="secondary">还没有组件介绍</Typography.Text>
        )}
      </Typography.Paragraph>
    </StyledCard>
  );
}
