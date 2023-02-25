import { Divider, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { ComponentPaneItem } from './item';
import { DraggersSubcategory } from './types';

import { withDescriptor } from '../../utils/withDescriptor';

const Components = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Container = styled.div`
  .divider {
    margin: 5px auto;
    height: 1.2em;
  }
`;

export function DraggerSubcate({
  draggersSubcategory,
}: {
  draggersSubcategory: DraggersSubcategory;
}) {
  return (
    <Container>
      <Divider orientation="left" className="divider">
        <Typography.Text type="secondary">
          {draggersSubcategory.label || '未命名组件'}
        </Typography.Text>
      </Divider>
      <Components>
        {draggersSubcategory.draggers.map((dragger) => (
          <ComponentPaneItem
            dragger={dragger}
            key={withDescriptor(dragger.descriptor).toString()}
          />
        ))}
      </Components>
    </Container>
  );
}
