import { ComponentPackage } from '@prototyper/core';

import { Link, LinkSettings } from './components/Link';
import { Outlet, OutletSettings } from './components/Outlet';
import {
  RouterProvider,
  RouterProviderSettings,
} from './components/RouterProvider';
import { Routes, RoutesSettings } from './components/Routes';

export const setupComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: RouterProviderSettings,
    component: RouterProvider,
    name: 'RouterProvider',
  });

  pkg.createComponent({
    type: 'native',
    settings: RoutesSettings,
    component: Routes,
    name: 'Routes',
  });

  pkg.createComponent({
    type: 'native',
    settings: OutletSettings,
    component: Outlet,
    name: 'Outlet',
  });

  pkg.createComponent({
    type: 'native',
    settings: LinkSettings,
    component: Link,
    name: 'Link',
  });
};
