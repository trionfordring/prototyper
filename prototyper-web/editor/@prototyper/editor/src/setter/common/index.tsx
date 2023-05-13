import React from 'react';

import { ClassNameSetter } from './ClassNameSetter';
import { EventSetter } from './EventSetter';
import { HTMLPropsSetter } from './HTMLPropsSetter';
import { StyleSetter } from './StyleSetter';

import { FormHeader } from '../form/FormHeader';

export * from './EventSetter';
export * from './ClassNameSetter';
export * from './StyleSetter';

export function HTMLSetter({
  filterEvents,
  noEvents,
}: {
  filterEvents?: (eventName: string) => boolean;
  noEvents?: boolean;
}) {
  return (
    <>
      <FormHeader title="通用" />
      <HTMLPropsSetter />
      <ClassNameSetter />
      <StyleSetter />
      {noEvents ? null : <EventSetter filterEvents={filterEvents} />}
    </>
  );
}
