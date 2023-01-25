import { useContext } from 'react';

import { SetterContext, SetterContextType } from './SetterContext';

import { PropDeclear } from '../../utils';

export const useSetterContext = <S = {}>(
  selector: (props: any, mapper: PropDeclear) => S = () => ({} as S)
): S & SetterContextType => {
  const { props, propsMapper, ...other } = useContext(SetterContext);
  const selectAns: S = selector(props, propsMapper);

  return {
    ...selectAns,
    ...other,
    props,
    propsMapper,
  };
};
