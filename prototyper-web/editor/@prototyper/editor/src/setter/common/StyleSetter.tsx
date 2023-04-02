import {
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  FMT_EXPR,
  JS_EXPR,
  SimplePropDeclear,
  useDebounceMemo,
  useSetterContext,
} from '@prototyper/core';
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { camelCase, keys } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import styled from 'styled-components';

import { STYLE_LIST } from './StyleList';

import { FormHeader } from '../form/FormHeader';
import { TypeTagInput } from '../form/FormItem';

function processSearchUrl(key: string) {
  const toBeQuery = encodeURIComponent(key);
  return `https://developer.mozilla.org/zh-CN/search?q=${toBeQuery}`;
}

const StyleOptions = STYLE_LIST.map((style) => {
  return {
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {camelCase(style.key)}
        <span>
          <a
            style={{ float: 'right' }}
            href={processSearchUrl(style.key)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SearchOutlined />
          </a>
        </span>
      </div>
    ),
    value: camelCase(style.key),
  };
});

const RomoveIcon = styled(MinusCircleOutlined)`
  color: #ff6567;
`;

export function StyleSetter() {
  const { props, propsMapper } = useSetterContext();
  const [styleSet, setStyleSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    setStyleSet((set) => {
      return new Set([...set.values(), ...keys(props['style'])]);
    });
  }, [props]);
  const [searchKey, setSearchKey] = useState('');
  const searchKeyRef = useRef(searchKey);
  searchKeyRef.current = searchKey;
  const form = Form.useFormInstance();
  function removeStyle(key: string) {
    setStyleSet((set) => {
      if (!set.has(key)) return set;
      set.delete(key);
      return new Set(set);
    });
    const data = form.getFieldsValue();
    delete data?.style?.[key];
    form.setFieldsValue(data);
  }
  const options = useDebounceMemo(
    () => {
      return StyleOptions.filter((opt) =>
        opt.value.toLowerCase().includes(searchKey)
      );
    },
    [searchKey],
    100
  );
  function addStyle() {
    setStyleSet((set) => {
      const newSet = new Set(set);
      newSet.add(searchKey);
      return newSet;
    });
  }
  return (
    <>
      <FormHeader title="内联样式管理" />
      <Form.Item
        label={<Tooltip title="输入建议由ChatGPT生成">添加样式</Tooltip>}
      >
        <Space.Compact
          style={{
            display: 'flex',
          }}
        >
          <AutoComplete
            placeholder="CSS内联样式"
            value={searchKey}
            onChange={setSearchKey}
            options={options}
            dropdownMatchSelectWidth={230}
          />
          <Button icon={<PlusOutlined />} type="primary" onClick={addStyle} />
        </Space.Compact>
      </Form.Item>
      {Array.from(styleSet).map((e) => {
        const propName = e;
        const propType: SimplePropDeclear | '' = propsMapper?.[propName] || '';
        const defined = STYLE_LIST.find((style) => camelCase(style.key) === e);
        return (
          <Form.Item
            label={
              <>
                <Popconfirm
                  title={`确定要删除样式${e}吗?`}
                  onConfirm={() => removeStyle(e)}
                >
                  <RomoveIcon />
                </Popconfirm>
                <Form.Item
                  name={['propsMapper', 'style', propName]}
                  initialValue={propType || ''}
                  noStyle
                >
                  <TypeTagInput allow={['', JS_EXPR, FMT_EXPR]} />
                </Form.Item>
                <Typography.Paragraph
                  ellipsis={{
                    rows: 1,
                    tooltip: {
                      color: 'geekblue',
                      title: e,
                    },
                  }}
                  style={{
                    margin: 0,
                  }}
                >
                  <span>{e}</span>
                </Typography.Paragraph>
              </>
            }
            key={e}
            name={['style', camelCase(e)]}
            initialValue={props['style']?.[e]}
          >
            {defined?.values ? (
              <AutoComplete
                placeholder="输入样式"
                options={defined.values.map((d) => ({ label: d, value: d }))}
                filterOption={(input, opt) =>
                  input ? opt?.label.includes(input) || false : true
                }
              />
            ) : (
              <Input placeholder="输入样式" />
            )}
          </Form.Item>
        );
      })}
    </>
  );
}
