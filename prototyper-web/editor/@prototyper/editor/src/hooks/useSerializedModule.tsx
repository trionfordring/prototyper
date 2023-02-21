import { Tool } from '@prototyper/core';
import { values } from 'lodash';
import { useMemo } from 'react';
import React from 'react';

import { SerializedModule } from '../types/SerializedModule';
import { loadModuleFromCode } from '../utils/loadModuleFromCode';

function fallback(err: Error) {
  console.error('模块载入失败');
  return {
    default: () => {
      throw err;
    },
  };
}

/**
 * 绕过StyledComponents的动态创建检查.
 */
function cheatDynamicCreationCheck<T>(cb: () => T): T {
  const originalUseRef = React.useRef;
  try {
    React.useRef = (() => {
      console.error('invalid hook call');
    }) as any;
    return cb();
  } finally {
    React.useRef = originalUseRef;
  }
}

export function useSerializedModule<T>(
  serializedModule?: SerializedModule,
  defaultValue?: T
): T {
  return useMemo(() => {
    if (!serializedModule) return defaultValue;
    const module = Tool.try(() =>
      cheatDynamicCreationCheck(() => {
        return loadModuleFromCode(serializedModule.compiledSrc);
      })
    ).catch((err) => fallback(err));
    if (!module) return defaultValue;
    if (module.default) {
      return module.default;
    } else {
      return values(module)[0];
    }
  }, [serializedModule, defaultValue]);
}
