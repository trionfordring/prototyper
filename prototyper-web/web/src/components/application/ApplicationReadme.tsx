import styled from 'styled-components';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { Markdown } from '../gizmo/Markdown';
import { Card, Tooltip, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const Box = styled.div`
  margin: 12px auto;
  .ant-card-body {
    padding-top: 8px;
    padding-bottom: 12px;
  }
  .md-header {
    line-height: 14px;
    display: flex;
    justify-content: space-between;
  }
`;

const EditBtn = styled.div``;

export function ApplicationReadme({ disableEdit }: { disableEdit?: boolean }) {
  const applicationInfo = useApplicationInfo();
  return (
    <Box>
      <Card className="box-shadow">
        {disableEdit ? null : (
          <div className="md-header">
            <Typography.Text type="secondary">
              {applicationInfo.name}/README.md
            </Typography.Text>
            <EditBtn>
              <Tooltip title="编辑" placement="bottom">
                <EditOutlined onClick={() => {}} />
              </Tooltip>
            </EditBtn>
          </div>
        )}
        <Markdown value={applicationInfo.readme} />
      </Card>
    </Box>
  );
}
