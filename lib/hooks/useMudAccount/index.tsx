import {
  useContext
} from 'react';

import {
  IMudAccountInfo,
  MudAccountContext
} from '../../context/mudAccountContext';

// TODO: this is better defined in a LIT
const accountPredicate = 'https://calum.inrupt.net/public/voc/mudchar.ttl#Account';
const charactersListPredicate = 'https://calum.inrupt.net/public/voc/mudchar.ttl#CharactersList';

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
