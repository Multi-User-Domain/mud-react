import {
    useContext
  } from 'react';
  
  import {
    IMudWorldContext,
    MudWorldContext
  } from '../../context/mudWorldContext';
  
  export default function useMudAccount() : IMudWorldContext {
    const {
        worldWebId,
        settlementDataSet,
        settlements
    } = useContext(MudWorldContext);
  
    return {
        worldWebId,
        settlementDataSet,
        settlements
    };
  }
  