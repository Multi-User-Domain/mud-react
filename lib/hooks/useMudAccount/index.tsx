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
    postTransitTask,
    addCharacter
  } = useContext(MudAccountContext);

  return {
    characterDataSet,
    characters,
    postTransitTask,
    addCharacter
  };
}
