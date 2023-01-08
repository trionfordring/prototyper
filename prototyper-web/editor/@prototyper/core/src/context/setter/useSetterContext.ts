import { useContext } from 'react';

import { SetterContext, SetterContextType } from './SetterContext';

export const useSetterContext = <S = {}>(
  selector: (props: any) => S = () => ({} as S)
): S & SetterContextType => {
  const { props, ...other } = useContext(SetterContext);
  const selectAns: S = selector(props);

  return {
    ...selectAns,
    ...other,
    props,
  };
};
