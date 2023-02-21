import { isNil } from 'lodash';

export const SCRIPT_TEMPLATE = `import React, { useState } from 'react';

export default function useScript() {
  const [num, setNum] = useState(1);

  return {
    num,
    add() {
      setNum(n=>n+1);
    }
  };
}
`.replaceAll('\r', '');

export const CONTAINER_TEMPLATE = `import styled from 'styled-components';

const Container = styled.div\`
  // 在此输入样式
\`;
export default Container;`.replaceAll('\r', '');

export function withScriptTemplate(code?: string) {
  if (!isNil(code)) return code;
  return SCRIPT_TEMPLATE;
}

export function withContainerTemplate(code?: string) {
  if (!isNil(code)) return code;
  return CONTAINER_TEMPLATE;
}
