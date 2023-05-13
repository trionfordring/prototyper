import { ComponentPackage } from '@prototyper/core';

import { Form, FormSettings } from './Form';
import { FormItem, FormItemSettings } from './FormItem';
import { Input, InputSettings } from './Input';
import { NumberInput, NumberInputSettings } from './NumberInput';

export const setupFormComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: FormSettings,
    component: Form,
    name: 'Form',
    dependencies: [{ name: 'DropArea', namespace: pkg.namespace }],
  });
  pkg.createComponent({
    type: 'native',
    settings: FormItemSettings,
    component: FormItem,
    name: 'FormItem',
    dependencies: [
      { name: 'DropArea', namespace: pkg.namespace },
      { name: 'Form', namespace: pkg.namespace },
    ],
  });
  pkg.createComponent({
    type: 'native',
    settings: InputSettings,
    component: Input,
    name: 'Input',
  });
  pkg.createComponent({
    type: 'native',
    settings: NumberInputSettings,
    component: NumberInput,
    name: 'NumberInput',
  });
};
