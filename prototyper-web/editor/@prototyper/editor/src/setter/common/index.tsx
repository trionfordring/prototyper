import React from 'react';

import { ClassNameSetter } from './ClassNameSetter';
import { EventSetter } from './EventSetter';
import { StyleSetter } from './StyleSetter';

import { FormHeader } from '../form/FormHeader';

export * from './EventSetter';
export * from './ClassNameSetter';
export * from './StyleSetter';

export function HTMLSetter() {
  return (
    <>
      <FormHeader title="Html属性" />
      <ClassNameSetter />
      <StyleSetter />
      <EventSetter />
    </>
  );
}
