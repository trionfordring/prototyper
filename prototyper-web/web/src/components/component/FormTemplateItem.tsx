import { FileOutlined } from '@ant-design/icons';
import { Card, Row, Col, Radio } from 'antd';

export function FormTemplateItem() {
  return (
    <Card className="hover-shadow none-select">
      <Row>
        <Col span={4}>
          <FileOutlined
            style={{
              fontSize: '2em',
              color: 'gray',
            }}
          />
        </Col>
        <Col span={19}>
          <span>空模板</span>
        </Col>
        <Col span={1}>
          <Radio checked />
        </Col>
      </Row>
    </Card>
  );
}
