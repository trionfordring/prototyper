import { ComponentPackage } from '@prototyper/core';

export const withDraggerRegister = (pkg: ComponentPackage) => {
  let category = pkg.namespace;
  let subcategory = 'default';
  function subcate(name: string) {
    subcategory = name;
  }

  const register = (
    name: string,
    label: string,
    icon: React.ReactNode,
    defaultProps?: any,
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
      canvas,
    });
  };
  const registerCanvas = (
    name: string,
    label: string,
    icon: React.ReactNode,
    defaultProps?: any
  ) => register(name, label, icon, defaultProps, true);
  return {
    register,
    registerCanvas,
    subcate,
  };
};
