import { useComponentContext } from '@prototyper/core';
import { JSSetter, SetterForm } from '@prototyper/editor';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import styled from 'styled-components';

import { PRouterObjects, mapRoutes } from '../utils/mapRoutes';
import { useConnectors } from '../utils/useConnectors';

export const Box = styled.div`
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed darkblue;
`;

export function Routes({ routes = [] }: { routes?: PRouterObjects }) {
  const { connectAndDrag } = useConnectors();
  const { editing } = useComponentContext()!;
  const el = useRoutes(
    useMemo(() => {
      if (editing || isEmpty(routes)) return [];
      return mapRoutes(routes);
    }, [editing, routes])
  );
  if (editing) {
    return <Box ref={connectAndDrag}>路由节点</Box>;
  }
  return el;
}

export function RoutesSettings() {
  return (
    <SetterForm>
      <JSSetter propName="routes" label="路由配置" defaultArr />
    </SetterForm>
  );
}
