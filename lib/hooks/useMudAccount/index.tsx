import {
  useContext
} from 'react';

import {
  IMudAccountContext,
  MudAccountContext
} from '../../context/mudAccountContext';

export default function useMudAccount() : IMudAccountContext {
  const {
    characterDataSet,
    characters,
    transitCharacter,
    addCharacter
  } = useContext(MudAccountContext);

  return {
    characterDataSet,
    characters,
    transitCharacter,
    addCharacter
  };
}
