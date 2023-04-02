import { notification } from 'antd';
import { FullPage } from '../gizmo/FullPage';
import {
  Category,
  ComponentDescriptor,
  ProtoComponent,
  ProtoDragger,
  WithDescriptor,
  globalPackagesRegistry,
} from '@prototyper/core';
import { useState } from 'react';
import { embeddedPackages } from '@/utils/embeddedPackages';
import React from 'react';
import { loadScript } from '@/utils/scriptLoader';
import { HOST } from '@/env';
import { Editor } from '@prototyper/editor';
import { loader } from '@monaco-editor/react';
import { EditorHeaderRight } from './EditorHeaderRight';
import { updateComponentData } from '@/remote/component';
import { ID } from '@/types/api';
import { useEffectOnce } from '@/hooks/useEffectOnce';
import { LoadingPage } from '../gizmo/LoadingPage';
import { ErrorPage } from '../gizmo/ErrorPage';
import { EditorTitle } from './EditorTitle';
import { DraggerImg } from './DraggerImg';
import { PackageWithUrl } from '@/remote/package-gql';
import { identity } from 'lodash';

type EditorStateType = 'loading' | 'running' | 'error';

export function ComponentEditor1({
  resources,
  index: indexDesc,
}: {
  resources: PackageWithUrl[];
  index: ComponentDescriptor;
}) {
  const [id, setId] = useState<ID>();
  const [error, setError] = useState<Error | undefined>();
  const [version, setVersion] = useState(0);
  const [notice, contextHolder] = notification.useNotification();
  const [editorState, setEditorState] = useState<EditorStateType>('loading');
  const [currentComponent, setCurrentComponent] = useState<
    ProtoComponent & WithDescriptor
  >();
  const [draggers, setDraggers] = useState<ProtoDragger[]>([]);
  const [catalogue, setCatalogue] = useState<Category[]>([]);

  // 通过当前的配置载入数据
  useEffectOnce(init);
  async function init() {
    try {
      // 这里应当顺序执行
      await loadExternalPackages();
      await loadAppComponents();
      await loadAppDraggers();
      initMonaco();
      // 装入index组件
      const indexPackage = globalPackagesRegistry.getPackage(
        indexDesc.namespace
      );
      const index = indexPackage.getComponent(indexDesc.name);
      if (index) setCurrentComponent(() => index);
      setEditorState('running');
    } catch (e) {
      setEditorState('error');
      setError(e);
    }
  }
  async function loadExternalPackages() {
    // 内嵌的软件包无需再次载入
    const embeddedSymbols = await embeddedPackages();
    const externalResources = resources.filter(
      (r) => !embeddedSymbols.includes(r.name)
    );
    // umd的方式载入非内嵌的软件包
    console.log('正在载入组件包所依赖的组件包:', externalResources);
    const tasks = externalResources.flatMap((r) => {
      const srcs = r.umds?.map((umd) => umd.url) || [];
      return srcs.map(async (src) => {
        await loadScript(`${HOST}${src}`);
        console.log(`脚本载入完成:`, r.name, src);
      });
    });
    await Promise.all(tasks);
    // 声明非内嵌的软件包的符号引用
    externalResources.forEach((r) =>
      r.globalSymbols?.forEach(({ symbol, name }) => {
        globalPackagesRegistry.registerUmd(symbol, name);
        console.log('全局注册符号引用', symbol, name);
      })
    );
    console.log('脚本已载入完毕');
  }
  async function loadAppComponents() {
    // 载入应用级组件
    const components: (ProtoComponent & WithDescriptor)[] = resources.flatMap(
      (r) =>
        r.components.map((c) => {
          if (r.name === indexDesc.namespace && c.name === indexDesc.name) {
            setId(c.id);
          }
          return {
            ...c.data,
            descriptor: {
              namespace: r.name,
              name: c.name,
            },
          };
        })
    );
    globalPackagesRegistry.addComponents(components);
    console.log('载入应用级组件', components);
  }
  async function loadAppDraggers() {
    // 载入应用级draggers
    const indexPackage = globalPackagesRegistry.getPackage(indexDesc.namespace);
    const appDraggers = resources.flatMap((r) => r.draggers || []);
    console.log('载入应用级draggers:', appDraggers);
    appDraggers.forEach((d) =>
      indexPackage.addDragger({
        ...d,
        descriptor: d.component,
        draggerProps: {
          category: d.category,
          subcategory: d.subcategory,
          order: d.order,
          renderer: DraggerImg,
          rendererProps: d.img
            ? {
                src: d.img.url,
                height: d.img.height,
                width: d.img.width,
                fit: d.imgSize,
              }
            : {},
        },
      })
    );
    // 装入所有draggers
    const pkgs = globalPackagesRegistry.getAllPackages();
    const finalDraggers = pkgs.flatMap((pkg) => pkg.draggers);
    setDraggers(finalDraggers);
    // 装入dragger的目录信息
    const embeddedCatalogue = pkgs.flatMap((pkg) => pkg.catalogue);
    const appCatalogue = resources
      .flatMap((r) => r.catalogue || [])
      .filter(identity);
    setCatalogue([...embeddedCatalogue, ...appCatalogue]);
  }

  async function initMonaco() {
    await loader.init();
    console.log('monaco已异步载入');
  }
  if (editorState === 'loading') {
    return <LoadingPage message="正在载入资源包..." />;
  }
  if (editorState === 'error') {
    return <ErrorPage message="载入失败!" description={error?.message} />;
  }
  if (!currentComponent) {
    return <ErrorPage message="找不到所需组件" />;
  }
  return (
    <FullPage>
      {contextHolder}
      <Editor
        key={version}
        app={{
          index: currentComponent,
        }}
        draggers={draggers}
        catalogue={catalogue}
        title={EditorTitle}
        right={EditorHeaderRight}
        onSave={async (comp) => {
          if (!id) throw new Error('你不能更新原生包的内建组件');
          try {
            await updateComponentData(id, comp);
            const now = new Date();
            notice.success({
              placement: 'topRight',
              message: '保存完成',
              description: `操作时间:${now.toLocaleTimeString()}`,
            });
          } catch (e: any) {
            notice.error({
              placement: 'topRight',
              message: '保存失败',
              description: `请求服务器失败:${e?.message}`,
            });
          }
        }}
      ></Editor>
    </FullPage>
  );
}
