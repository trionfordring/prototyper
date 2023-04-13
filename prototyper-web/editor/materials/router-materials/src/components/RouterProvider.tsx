import { useApplicationContext, useComponentContext } from '@prototyper/core';
import { JSSetter, SegmentedSetter, SetterForm } from '@prototyper/editor';
import { isEmpty, isNil } from 'lodash';
import React, { useMemo } from 'react';
import {
  RouterProvider as RP,
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
} from 'react-router-dom';

import { Box } from './Routes';

import {
  NodeDescriptor,
  PRouterObjects,
  mapNodeDescriptor,
  mapRoutes,
} from '../utils/mapRoutes';
import { useConnectors } from '../utils/useConnectors';

export function RouterProvider({
  routes = [],
  fallbackElement: fallbackElementProp,
  type = 'memory',
}: {
  type?: 'memory' | 'history' | 'hash';
  routes?: PRouterObjects;
  fallbackElement?: NodeDescriptor;
}) {
  const { connectAndDrag } = useConnectors();
  const { editing } = useComponentContext()!;
  const { baseurl = '/' } = useApplicationContext();
  const router = useMemo(() => {
    if (editing || isEmpty(routes)) return undefined;
    const finalRoutes = mapRoutes(routes);
    switch (type) {
      case 'history':
        return createBrowserRouter(finalRoutes, { basename: baseurl });
      case 'hash':
        return createHashRouter(finalRoutes);
      case 'memory':
      default:
        return createMemoryRouter(finalRoutes);
    }
  }, [baseurl, editing, routes, type]);
  const fallbackElement = useMemo(() => {
    if (editing || isEmpty(routes)) return undefined;
    if (fallbackElementProp)
      return mapNodeDescriptor('fallback', fallbackElementProp);
    return undefined;
  }, [editing, fallbackElementProp, routes]);
  if (editing) {
    return <Box ref={connectAndDrag}>根路由</Box>;
  }
  if (isNil(router)) return null;
  return <RP router={router} fallbackElement={fallbackElement} />;
}

export function RouterProviderSettings() {
  return (
    <SetterForm>
      <SegmentedSetter
        propName="type"
        label="路由类型"
        options={[
          { value: 'memory', label: 'memory' },
          { value: 'history', label: 'history' },
          { value: 'hash', label: 'hash' },
        ]}
      />
      <JSSetter propName="routes" label="路由配置" defaultArr />
    </SetterForm>
  );
}
