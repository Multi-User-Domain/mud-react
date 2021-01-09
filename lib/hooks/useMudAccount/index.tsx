import {
  useContext
} from 'react';

import {
  IMudAccountInfo,
  MudAccountContext
} from '../../context/mudAccountContext';

export default function useMudAccount() : IMudAccountInfo {
  const {
    charactersDataSet,
    characters
  } = useContext(MudAccountContext);

  return {
    charactersDataSet,
    characters
  };
}
