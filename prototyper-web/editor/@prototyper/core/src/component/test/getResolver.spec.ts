import { test, expect } from '@jest/globals';

import { ComponentDescriptor } from '../ProtoComponent';
import { getResolver } from '../getResolver';

test('test getResolver', () => {
  const repo = {
    a: {
      a1: {
        type: 'native',
        component: 1,
        dependencies: [{ namespace: 'a', name: 'a2' }],
      },
      a2: {
        type: 'native',
        component: 2,
        dependencies: [{ namespace: 'a', name: 'a3' }],
      },
      a3: {
        type: 'native',
        component: 3,
      },
    },
    b: {
      b1: {
        type: 'native',
        component: 2,
      },
    },
  };
  const getter = (descriptor: ComponentDescriptor) => ({
    descriptor,
    ...repo[descriptor.namespace][descriptor.name],
  });
  expect(
    getResolver(
      [
        { namespace: 'a', name: 'a1' },
        { namespace: 'b', name: 'b1' },
        { namespace: 'a', name: 'a1' },
        { namespace: 'a', name: 'a4' },
      ],
      getter
    )
  ).toEqual({
    'a.a1': 1,
    'a.a2': 2,
    'a.a3': 3,
    'b.b1': 2,
  });
});
