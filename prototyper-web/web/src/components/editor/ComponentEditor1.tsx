import { Alert } from 'antd';
import { FullPage } from '../gizmo/FullPage';
import { PackageWithUrl } from '@/remote/package';
import {
  Category,
  ComponentDescriptor,
  ProtoComponent,
  ProtoDragger,
  WithDescriptor,
  globalPackagesRegistry,
} from '@prototyper/core';
import { useState } from 'react';
import { FullPageCenter } from '../gizmo/FullPageCenter';
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

type EditorStateType = 'loading' | 'running' | 'error';

export function ComponentEditor1({
  resources,
  index: indexDesc,
}: {
  resources: PackageWithUrl[];
  index: ComponentDescriptor;
}) {
  const [id, setId] = useState<ID>();
  const [version, setVersion] = useState(0);
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
      })
    );
    // 装入所有draggers
    const pkgs = globalPackagesRegistry.getAllPackages();
    const finalDraggers = pkgs.flatMap((pkg) => pkg.draggers);
    setDraggers(finalDraggers);
    // 装入dragger的目录信息
    const finalCatalogue = pkgs.flatMap((pkg) => pkg.catalogue);
    setCatalogue(finalCatalogue);
  }

  async function initMonaco() {
    await loader.init();
    console.log('monaco已异步载入');
  }
  if (editorState === 'loading') {
    return (
      <FullPageCenter background="light-grey">
        <Alert type="info" message="正在加载..." />
      </FullPageCenter>
    );
  }
  if (!currentComponent) {
    return (
      <FullPageCenter background="light-grey">
        <Alert type="error" message="加载失败.." />
      </FullPageCenter>
    );
  }
  return (
    <FullPage>
      <Editor
        key={version}
        app={{
          index: currentComponent,
        }}
        draggers={draggers}
        catalogue={catalogue}
        right={EditorHeaderRight}
        onSave={(comp) => {
          if (!id) throw new Error('你不能更新原生包的内建组件');
          updateComponentData(id, comp);
        }}
      ></Editor>
    </FullPage>
  );
}
