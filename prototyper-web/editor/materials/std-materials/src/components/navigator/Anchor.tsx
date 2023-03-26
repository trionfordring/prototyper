import { AnchorProps, Anchor as AntAnchor } from 'antd';
import React from 'react';

import { useConnectors } from '../../utils/useConnectors';

export const Anchor = ({}: AnchorProps) => {
  const { connectAndDrag } = useConnectors();
  // return <AntAnchor ref={connectAndDrag}></AntAnchor>;
};
