import { ComponentPackage } from '@prototyper/core';

import { ContentSettings, Content } from './Content';
import { FooterSettings, Footer } from './Footer';
import { HeaderSettings, Header } from './Header';
import { Layout, LayoutSettings } from './Layout';
import { SiderSettings, Sider } from './Sider';

export * from './Layout';
export * from './Header';
export * from './Footer';
export * from './Sider';
export * from './Content';

export const setupLayout = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: LayoutSettings,
    component: Layout,
    name: 'Layout',
  });
  pkg.createComponent({
    type: 'native',
    settings: HeaderSettings,
    component: Header,
    name: 'Header',
  });
  pkg.createComponent({
    type: 'native',
    settings: FooterSettings,
    component: Footer,
    name: 'Footer',
  });
  pkg.createComponent({
    type: 'native',
    settings: SiderSettings,
    component: Sider,
    name: 'Sider',
  });
  pkg.createComponent({
    type: 'native',
    settings: ContentSettings,
    component: Content,
    name: 'Content',
  });
};
