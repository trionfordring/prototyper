import {
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useDebounceMemo, useSetterContext } from '@prototyper/core';
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { forEach, isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import styled from 'styled-components';

import { FormHeader } from '../form/FormHeader';

// 由ChatGPT生成
const EVENT_LIST = [
  // Clipboard Events
  {
    label: '剪贴板事件',
    children: ['onCopy', 'onCopyCapture', 'onCut', 'onCutCapture'],
  },

  // Composition Events
  {
    label: '合成事件',
    children: [
      'onCompositionEnd',
      'onCompositionEndCapture',
      'onCompositionStart',
      'onCompositionStartCapture',
      'onCompositionUpdate',
      'onCompositionUpdateCapture',
    ],
  },

  // Focus Events
  {
    label: '焦点事件',
    children: ['onFocus', 'onFocusCapture', 'onBlur', 'onBlurCapture'],
  },

  // Form Events
  {
    label: '表单事件',
    children: [
      'onChange',
      'onChangeCapture',
      'onInput',
      'onInputCapture',
      'onReset',
      'onResetCapture',
      'onSubmit',
      'onSubmitCapture',
    ],
  },
  // Image Events
  {
    label: '图片事件',
    children: ['onLoad', 'onLoadCapture', 'onError', 'onErrorCapture'],
  },

  // Keyboard Events
  {
    label: '键盘事件',
    children: [
      'onKeyDown',
      'onKeyDownCapture',
      'onKeyPress',
      'onKeyPressCapture',
      'onKeyUp',
      'onKeyUpCapture',
    ],
  },

  // Mouse Events
  {
    label: '鼠标事件',
    children: [
      'onClick',
      'onClickCapture',
      'onContextMenu',
      'onContextMenuCapture',
      'onDoubleClick',
      'onDoubleClickCapture',
      'onDrag',
      'onDragCapture',
      'onDragEnd',
      'onDragEndCapture',
      'onDragEnter',
      'onDragEnterCapture',
      'onDragExit',
      'onDragExitCapture',
      'onDragLeave',
      'onDragLeaveCapture',
      'onDragOver',
      'onDragOverCapture',
      'onDragStart',
      'onDragStartCapture',
      'onDrop',
      'onDropCapture',
      'onMouseDown',
      'onMouseDownCapture',
      'onMouseEnter',
      'onMouseLeave',
      'onMouseMove',
      'onMouseMoveCapture',
      'onMouseOut',
      'onMouseOutCapture',
      'onMouseOver',
      'onMouseOverCapture',
      'onMouseUp',
      'onMouseUpCapture',
    ],
  },

  // Selection Events
  {
    label: '选择事件',
    children: ['onSelect', 'onSelectCapture'],
  },

  // Touch Events
  {
    label: '触摸事件',
    children: [
      'onTouchCancel',
      'onTouchCancelCapture',
      'onTouchEnd',
      'onTouchEndCapture',
      'onTouchMove',
      'onTouchMoveCapture',
      'onTouchStart',
      'onTouchStartCapture',
    ],
  },

  // UI Events
  {
    label: '界面事件',
    children: ['onScroll', 'onScrollCapture'],
  },

  // Wheel Events
  {
    label: '滚轮事件',
    children: ['onWheel', 'onWheelCapture'],
  },
] as const;

const renderTitle = (title: string) => <span>{title}</span>;

function processSearchUrl(eventName: string) {
  eventName = eventName.replace('Capture', '');
  const toBeQuery = encodeURIComponent(eventName);
  return `https://developer.mozilla.org/zh-CN/search?q=${toBeQuery}`;
}

const renderItem = (title: string) => ({
  value: title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
      <span>
        <a
          style={{ float: 'right' }}
          href={processSearchUrl(title)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SearchOutlined />
        </a>
      </span>
    </div>
  ),
});

const EVENT_OPTIONS = EVENT_LIST.map((group) => {
  return {
    label: renderTitle(group.label),
    options: group.children.map(renderItem),
  };
});

const RomoveIcon = styled(MinusCircleOutlined)`
  color: #ff6567;
`;

export function EventSetter() {
  const [messageApi, messageContext] = message.useMessage();
  const { props } = useSetterContext();
  const [eventList, setEventList] = useState<Set<string>>(new Set<string>());
  useEffect(() => {
    setEventList((list) => {
      const ans = list;
      forEach(props, (v, k) => {
        if (!k.startsWith('on')) return;
        ans.add(k);
      });
      return new Set(ans);
    });
  }, [props]);
  const [searchKey, setSearchKey] = useState('');
  const searchKeyRef = useRef(searchKey);
  searchKeyRef.current = searchKey;
  const form = Form.useFormInstance();
  function removeEvent(event: string) {
    setEventList((list) => {
      list.delete(event);
      return new Set(list);
    });
    const data = form.getFieldsValue();
    delete data[event];
    form.setFieldsValue(data);
  }
  const options = useDebounceMemo(
    () => {
      return EVENT_OPTIONS.map((group) => {
        return {
          label: group.label,
          options: group.options.filter((opt) =>
            opt.value.toLowerCase().includes(searchKey?.toLowerCase())
          ),
        };
      }).filter((group) => !isEmpty(group.options));
    },
    [searchKey],
    100
  );
  function addEvent() {
    if (!searchKeyRef.current.startsWith('on')) {
      messageApi.error('事件应该以"on"开头!');
      return;
    }
    setEventList((list) => {
      list.add(searchKeyRef.current);
      return new Set(list);
    });
  }
  return (
    <>
      <FormHeader title="事件管理" />
      {messageContext}
      <Form.Item
        label={<Tooltip title="事件输入建议由ChatGPT生成">添加事件</Tooltip>}
      >
        <Space.Compact
          style={{
            display: 'flex',
          }}
        >
          <AutoComplete
            placeholder="HTML事件监听"
            value={searchKey}
            onChange={setSearchKey}
            options={options}
            dropdownMatchSelectWidth={230}
          />
          <Button icon={<PlusOutlined />} type="primary" onClick={addEvent} />
        </Space.Compact>
      </Form.Item>
      {Array.from(eventList).map((e) => (
        <Form.Item
          label={
            <Typography.Paragraph
              ellipsis={{
                rows: 1,
                tooltip: {
                  color: 'geekblue',
                  title: e,
                },
              }}
            >
              <Popconfirm
                title={`确定要删除事件${e}吗?`}
                onConfirm={() => removeEvent(e)}
              >
                <RomoveIcon />
              </Popconfirm>
              <span>{e}</span>
            </Typography.Paragraph>
          }
          key={e}
          name={e}
          initialValue={props[e]}
        >
          <Input.TextArea placeholder="()=>{}" />
        </Form.Item>
      ))}
    </>
  );
}
