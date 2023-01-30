import { ComponentPackage } from '@prototyper/core';

export const withDraggerRegister = (pkg: ComponentPackage) => {
  const register = (
    name: string,
    label: string,
    icon: React.ReactNode,
    defaultProps?: any,
    canvas?: boolean
  ) => {
    pkg.addDragger({
      label,
      type: 'icon',
      draggerProps: {
        icon,
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
  };
};
