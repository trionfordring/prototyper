import { HTMLSetter, SetterForm } from '@prototyper/editor';
import { InputNumber } from 'antd';
import React from 'react';

import { InputSetter, filterControlleredEvents } from './Input';

import { useConnectors } from '../../utils/useConnectors';

export function NumberInput(props) {
  const { connectAndDrag } = useConnectors();
  return <InputNumber {...props} ref={connectAndDrag} />;
}

export function NumberInputSettings() {
  return (
    <SetterForm>
      <InputSetter enableDefault />
      <HTMLSetter filterEvents={filterControlleredEvents} />
    </SetterForm>
  );
}
