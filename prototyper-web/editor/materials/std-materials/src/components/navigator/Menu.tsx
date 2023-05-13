import { Element } from '@prototyper/core';
import {
  BoolSetter,
  HTMLSetter,
  JSSetter,
  SegmentedSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Menu as AntMenu, MenuProps } from 'antd';
import React from 'react';

import { renderNode } from '../../utils/renderNode';
import { useConnectors } from '../../utils/useConnectors';
import { DropSpanNode } from '../basic/DropSpan';

export function Menu(props: MenuProps) {
  const { connectAndDrag } = useConnectors();
  console.log(props.items);
  const items = (props.items || []).map((item: any) => {
    if (item.slot) {
      const slot = item.slot;
      const label = `选项[${slot}]`;
      return {
        ...item,
        label: (
          <Element
            canvas
            id={slot}
            is={DropSpanNode}
            label={label}
            custom={{
              displayName: label,
            }}
          />
        ),
      };
    }
    if (item.descriptor) {
      const descriptor = item.descriptor;
      return {
        ...item,
        label: renderNode(item.key, descriptor),
      };
    }
    return item;
  });
  return (
    <AntMenu
      {...props}
      items={items}
      ref={(menu) => {
        const dom = menu?.menu?.list;
        if (dom) return connectAndDrag(dom);
      }}
    />
  );
}

const DEFALUT_ITEMS = `// @export(data)
const data = [
  // { label: 'item', key: 'item' },
  // {
  //   label: 'submenu',
  //   key: 'submenu',
  //   children: [{label:'subitem',key: 'subitem'}],
  // },
  // { slot: 'item2', key: 'item2' },
];
`;
export function MenuSettings() {
  return (
    <SetterForm>
      <JSSetter
        propName="items"
        label="菜单"
        height={300}
        defaultValue={DEFALUT_ITEMS}
      />
      <TextSetter
        jsOnly
        singleLine
        propName="defaultOpenKeys"
        label="默认展开"
        tooltip="默认展开的子菜单数组"
        placeholder="[]"
      />
      <TextSetter
        jsOnly
        singleLine
        propName="defaultSelectedKeys"
        label="默认选中"
        tooltip="初始选中的菜单项 key 数组"
        placeholder="[]"
      />
      <SegmentedSetter
        propName="mode"
        label="类型"
        options={[
          { value: 'vertical', label: '垂直' },
          { value: 'horizontal', label: '水平' },
          { value: 'inline', label: '行内' },
        ]}
      />
      <SegmentedSetter
        propName="theme"
        label="主题"
        options={[
          { value: 'light', label: '明亮' },
          { value: 'dark', label: '黑暗' },
        ]}
      />
      <SegmentedSetter
        propName="triggerSubMenuAction"
        label="子菜单触发"
        options={[
          { value: 'hover', label: '悬停' },
          { value: 'click', label: '点击' },
        ]}
      />
      <BoolSetter propName="multiple" label="支持多选" />
      <BoolSetter propName="selectable" label="允许选中" />
      <TextSetter
        jsOnly
        singleLine
        propName="openKeys"
        label="展开菜单"
        tooltip="当前展开的子菜单数组"
        placeholder="[]"
      />
      <TextSetter
        jsOnly
        singleLine
        propName="selectedKeys"
        label="选中项"
        tooltip="	当前选中的菜单项 key 数组"
        placeholder="[]"
      />

      <TextSetter
        jsOnly
        singleLine
        propName="subMenuCloseDelay"
        label="关闭时延"
        tooltip="用户鼠标离开子菜单后关闭延时，单位：秒"
        placeholder="0.1"
      />
      <TextSetter
        jsOnly
        singleLine
        propName="subMenuOpenDelay"
        label="展开时延"
        tooltip="用户鼠标进入子菜单后开启延时，单位：秒"
        placeholder="0"
      />

      <HTMLSetter />
    </SetterForm>
  );
}
