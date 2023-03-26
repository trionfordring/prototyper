import React from 'react';

import { TextSetter } from '../text';

export function ClassNameSetter() {
  return (
    <TextSetter
      propName="className"
      label="类名"
      placeholder="输入类名"
      singleLine
    />
  );
}
