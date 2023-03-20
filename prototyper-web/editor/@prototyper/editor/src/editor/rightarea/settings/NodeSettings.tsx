import {
  ComponentDescriptor,
  EmbeddedComponentRenderer,
  ROOT_NODE,
  SetterCommonContextProvider,
  useApplicationContext,
  useEditor,
} from '@prototyper/core';
import React, { ElementType, useEffect } from 'react';

import { AutoSettingsRender } from './RootSettings';

import { ComponentEditorMeta } from '../../../types/ComponentEditorMeta';
import { META_EDITOR_KEY } from '../../../types/SerializedProtoComponent';
type SettingNodeType = {
  id: string;
  name: string;
  settings?: ElementType;
  isVirtual: boolean;
  descriptor?: ComponentDescriptor;
};

export const NodeSettings = ({
  onSelected,
}: {
  onSelected?: (node?: SettingNodeType) => void;
}) => {
  const applicationContext = useApplicationContext();
  const { selected } = useEditor((state, query) => {
    let [currentNodeId] = state.events.selected.values();
    let selected: SettingNodeType | undefined;

    while (currentNodeId && !selected) {
      const node = state.nodes[currentNodeId];
      if (!node) break;
      const settings = node.related && node.related.settings;
      const isVirtual =
        node.data.type === state.options.resolver['ComponentRenderer'];
      if (!settings && !isVirtual) {
        currentNodeId = node.data.parent;
        continue;
      }
      selected = {
        id: currentNodeId,
        name: node.data.custom?.displayName || node.data.displayName,
        settings,
        isVirtual,
        descriptor: node.data.props?.descriptor as
          | ComponentDescriptor
          | undefined,
      };
    }
    return {
      selected,
    };
  });
  useEffect(() => {
    if (onSelected) {
      if (selected && selected.id !== 'ROOT') onSelected(selected);
      else onSelected();
    }
  }, [selected, onSelected]);
  if (!selected || selected.id === ROOT_NODE) {
    return <span>点击左侧画板选择一个节点</span>;
  }
  if (selected.isVirtual && selected.descriptor) {
    const component = applicationContext.getComponent(selected.descriptor);
    const editorMeta = component?.meta?.[META_EDITOR_KEY] as
      | ComponentEditorMeta
      | undefined;
    const settingsMeta = editorMeta?.settings;
    switch (settingsMeta?.type) {
      case 'none':
        return <span>该组件没有可编辑属性。</span>;
      case 'component':
        return (
          <SetterCommonContextProvider id={selected.id} virtual>
            <EmbeddedComponentRenderer descriptor={settingsMeta.descriptor} />
          </SetterCommonContextProvider>
        );
      case 'auto':
        return (
          <SetterCommonContextProvider id={selected.id} virtual>
            <AutoSettingsRender struct={settingsMeta.settingsStruct} />
          </SetterCommonContextProvider>
        );
    }
  }
  if (selected.settings) {
    return React.createElement(selected.settings);
  } else {
    return <span>错误：找不到对应设置器。</span>;
  }
};
