import React from 'react';

import { TextSetter } from '../text';

export function HTMLPropsSetter() {
  return (
    <>
      <TextSetter propName="id" label="id" placeholder="Html id" singleLine />
    </>
  );
}
