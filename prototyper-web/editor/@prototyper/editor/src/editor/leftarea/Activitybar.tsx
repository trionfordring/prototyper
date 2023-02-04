import { Tooltip } from 'antd';
import React, { forwardRef, useState } from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { consumeProvider, Provider } from '../../utils/Provider';

const Bar = styled.div`
  width: 48px;
  height: 100%;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .item {
    height: 48px;
    width: 100%;
  }
  .activated {
    border-left: #1677ff solid 2px;
    background-color: #e6f4ff;
    color: #1677ff;
  }

  .icon {
    position: block;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const BarTop = styled.div`
  margin-bottom: auto;
`;

export type ActivitybarValueType = string | number | symbol;

export interface ActivitybarOption {
  tooltip?: Provider<ReactNode>;
  icon: ReactNode | ((isActived: boolean) => ReactNode);
  value: ActivitybarValueType;
  position: 'start' | 'end';
}

function getIconNode(
  isActived: boolean,
  icon: ReactNode | ((isActived: boolean) => ReactNode)
): ReactNode {
  if (typeof icon === 'function') return icon(isActived);
  return icon;
}

export const Activitybar = forwardRef<
  HTMLDivElement,
  {
    options: ActivitybarOption[];
    initValue?: ActivitybarValueType;
    value?: ActivitybarValueType;
    onChange?: (val: ActivitybarValueType) => void;
  }
>(({ options, initValue, value, onChange, ...props }, ref) => {
  const [ncValue, setNcValue] = useState<ActivitybarValueType>(initValue);
  const isControlled = value !== undefined;
  const getValue = () => {
    if (isControlled) return value;
    return ncValue;
  };
  const setValue = (val: ActivitybarValueType) => {
    if (!isControlled) setNcValue(val);
    onChange && onChange(val);
  };

  const nodes = optionsToNodes(options);
  function optionsToNodes(options?: ActivitybarOption[]): ReactNode {
    if (!options) return null;
    const start = options.filter((opt) => opt.position === 'start');
    const end = options.filter((opt) => opt.position === 'end');
    const currentActive = getValue();
    const getNode = (option) => {
      const isActive = currentActive === option.value;
      const tooltip = consumeProvider(option.tooltip);
      const icon = getIconNode(isActive, option.icon);
      const onClick = () => {
        setValue(option.value);
      };
      const content = (
        <div className="icon" onClick={onClick}>
          {icon}
        </div>
      );
      return (
        <div
          key={String(option.value)}
          className={`${isActive ? 'activated' : 'normal'} item`}
        >
          {tooltip ? (
            <Tooltip title={consumeProvider(tooltip)} placement="right">
              {content}
            </Tooltip>
          ) : (
            content
          )}
        </div>
      );
    };
    return (
      <React.Fragment>
        <BarTop>{start.map(getNode)}</BarTop>
        <div>{end.map(getNode)}</div>
      </React.Fragment>
    );
  }

  return (
    <Bar {...props} ref={ref}>
      {nodes}
    </Bar>
  );
});
