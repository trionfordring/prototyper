import { ComponentPackage, PropDeclear } from '@prototyper/core';

export const withDraggerRegister = (pkg: ComponentPackage) => {
  let category = 'std';
  let subcategory = 'default';
  function subcate(name: string) {
    subcategory = name;
  }

  const register = (
    name: string,
    label: string,
    icon: React.ReactNode,
    defaultProps?: any,
    mapper?: PropDeclear,
    canvas?: boolean
  ) => {
    pkg.addDragger({
      label,
      type: 'native',
      draggerProps: {
        render: icon,
        category,
        subcategory,
      },
      descriptor: {
        namespace: pkg.namespace,
        name,
      },
      compProps: defaultProps,
      compPropsMapper: mapper,
      canvas,
    });
  };
  const registerCanvas = (
    name: string,
    label: string,
    icon: React.ReactNode,
    defaultProps?: any,
    mapper?: PropDeclear
  ) => register(name, label, icon, defaultProps, mapper, true);
  return {
    register,
    registerCanvas,
    subcate,
  };
};
