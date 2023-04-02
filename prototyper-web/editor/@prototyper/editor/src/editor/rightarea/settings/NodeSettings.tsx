import {
  ComponentDescriptor,
  EmbeddedComponentRenderer,
  ROOT_NODE,
  SetterCommonContextProvider,
  useApplicationContext,
  useEditor,
} from '@prototyper/core';
import React, { ElementType, useEffect, useMemo, useRef } from 'react';

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
      const settings = (node.related && node.related.settings) || undefined;
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
  const oldSelectedRef = useRef(selected);
  const noRootSelected = useMemo(() => {
    if (!selected || selected.id === ROOT_NODE) return oldSelectedRef.current;
    const vt = selected.isVirtual && selected.descriptor;
    const nt = selected.settings;
    if (!vt && !nt) return oldSelectedRef.current;
    oldSelectedRef.current = selected;
    return selected;
  }, [selected]);
  useEffect(() => {
    if (onSelected) {
      if (noRootSelected && noRootSelected.id !== 'ROOT')
        onSelected(noRootSelected);
      else onSelected();
    }
  }, [noRootSelected, onSelected]);
  if (!noRootSelected || noRootSelected.id === ROOT_NODE) {
    return <span>点击左侧画板选择一个节点</span>;
  }
  if (noRootSelected.isVirtual && noRootSelected.descriptor) {
    const component = applicationContext.getComponent(
      noRootSelected.descriptor
    );
    const editorMeta = component?.meta?.[META_EDITOR_KEY] as
      | ComponentEditorMeta
      | undefined;
    const settingsMeta = editorMeta?.settings;
    switch (settingsMeta?.type) {
      case 'none':
        return <span>该组件没有可编辑属性。</span>;
      case 'component':
        return (
          <SetterCommonContextProvider id={noRootSelected.id} virtual>
            <EmbeddedComponentRenderer descriptor={settingsMeta.descriptor} />
          </SetterCommonContextProvider>
        );
      case 'auto':
        return (
          <SetterCommonContextProvider id={noRootSelected.id} virtual>
            <AutoSettingsRender struct={settingsMeta.settingsStruct} />
          </SetterCommonContextProvider>
        );
    }
  }
  if (noRootSelected.settings) {
    return React.createElement(noRootSelected.settings);
  } else {
    return <span>错误：找不到对应设置器。</span>;
  }
};
