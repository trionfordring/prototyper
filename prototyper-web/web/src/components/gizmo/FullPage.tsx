import styled, { css } from 'styled-components';

export type PageBackgroudType = 'none' | 'light-grey';

export const FullPage = styled.div<{
  background?: PageBackgroudType;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -10;

  overflow: auto;
  ${({ background = 'none' }) => {
    return getBackgroud(background);
  }};
`;

const LightGreyCss = css`
  background-color: #f0f0f0;
`;

function getBackgroud(type: PageBackgroudType) {
  switch (type) {
    case 'none':
      return css``;
    case 'light-grey':
      return LightGreyCss;
  }
}
