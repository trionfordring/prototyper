import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const HeaderBox = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const Title = styled.span`
  flex-grow: 1;
`;

export const FormHeader = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <HeaderBox>
      <Title>{title}</Title>
      <div>{children}</div>
    </HeaderBox>
  );
};
