import { noop } from 'lodash';
import { useMemo, useState } from 'react';
import React from 'react';
import styled from 'styled-components';

export function TestDynamicStyled() {
  const [num, setNum] = useState(1);
  const init = num < 3;
  const Container = useMemo(() => {
    const backup = React.useRef;
    React.useRef = noop as any;
    try {
      if (init) {
        return styled.div``;
      } else {
        return styled.div`
          background-color: #000;
        `;
      }
    } finally {
      React.useRef = backup;
    }
  }, [init]);
  return (
    <Container>
      <p>num:{num}</p>
      <button onClick={() => setNum((n) => n + 1)}>点击加一</button>
    </Container>
  );
}
