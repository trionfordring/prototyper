import { Tabs, TabsProps } from 'antd';
import React from 'react';

import { DraggerCatePage } from './DraggerCatePage';
import { DraggersCatalogue } from './types';

export function DraggerTabs({
  draggersCatalogue,
}: {
  draggersCatalogue: DraggersCatalogue;
}) {
  const tabs: TabsProps['items'] = draggersCatalogue.map((cate) => ({
    key: cate.name,
    label: cate.label,
    children: <DraggerCatePage draggersCategory={cate} />,
  }));
  return (
    <Tabs
      items={tabs}
      size="small"
      tabBarStyle={{
        marginBottom: '3px',
      }}
    />
  );
}
