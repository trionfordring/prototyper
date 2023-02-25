import React from 'react';
import styled from 'styled-components';

import { DraggerSubcate } from './DraggerSubcate';
import { DraggersCategory } from './types';

const Container = styled.div``;

export function DraggerCatePage({
  draggersCategory,
}: {
  draggersCategory: DraggersCategory;
}) {
  return (
    <Container>
      {draggersCategory.subcategories.map((subcate) => (
        <DraggerSubcate draggersSubcategory={subcate} key={subcate.name} />
      ))}
    </Container>
  );
}
