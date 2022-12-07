import { ComponentDescriptor, ProtoComponent } from '@prototyper/core';
import { Button, Typography } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

const Header = styled.div`
  width: 100%;
  background: none;
  min-width: 600px;
  padding: 0 24px;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
`;

const Title = styled(Typography.Title)`
  margin-bottom: 0 !important;
`;

const Center = styled.div`
  flex-grow: 1;
  max-width: 1600px;
`;
const Item = styled.div`
  margin: 0 auto;
  padding: 0 24px;
`;

const Right = styled.div`
  justify-self: flex-end;
`;

const EditorHeader: FC<{
  component: ProtoComponent;
  descriptor?: ComponentDescriptor;
}> = ({ descriptor }) => {
  return (
    <Header>
      <Title>Editor</Title>
      <Center>
        <Item>
          <Typography.Text>
            当前组件: {descriptor?.name || '临时组件'}
          </Typography.Text>
        </Item>
      </Center>
      <Right>
        <Button type="primary">保存</Button>
      </Right>
    </Header>
  );
};

export default EditorHeader;
