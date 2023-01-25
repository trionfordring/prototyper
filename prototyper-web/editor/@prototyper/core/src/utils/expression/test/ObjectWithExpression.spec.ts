import { expect, test } from '@jest/globals';
import { keysIn } from 'lodash';

import { ObjectWithExpression } from '../ObjectWithExpression';

const createRandomContext = () => {
  return {
    a: Math.floor(Math.random() * 100),
    b: Math.floor(Math.random() * 100),
  };
};

test('PropsMapper', () => {
  let context = createRandomContext();
  const mapper = new ObjectWithExpression(
    {
      'a+b': 'a+b',
      'fmt(a+b)': 'a+b:#{a+b}',
      obj: {
        'a-b': 'a-b',
      },
    },
    {
      'a+b': 'jsExpr',
      'fmt(a+b)': 'fmtExpr',
      obj: {
        'a-b': 'jsExpr',
      },
    },
    keysIn(context)
  );
  expect(mapper.run(context)).toEqual({
    'a+b': context.a + context.b,
    'fmt(a+b)': `a+b:${context.a + context.b}`,
    obj: {
      'a-b': context.a - context.b,
    },
  });
  context = createRandomContext();
  expect(mapper.run(context)).toEqual({
    'a+b': context.a + context.b,
    'fmt(a+b)': `a+b:${context.a + context.b}`,
    obj: {
      'a-b': context.a - context.b,
    },
  });
});
