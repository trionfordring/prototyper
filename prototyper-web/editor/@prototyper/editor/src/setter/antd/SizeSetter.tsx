import React from 'react';

import { AutoCompleteSetter } from '../auto-complete';

export function SizeSetter() {
  return (
    <AutoCompleteSetter
      label="尺寸"
      propName="size"
      options={[
        { value: 'small', label: 'small' },
        { value: 'middle', label: 'middle' },
        { value: 'large', label: 'large' },
      ]}
    />
  );
}
