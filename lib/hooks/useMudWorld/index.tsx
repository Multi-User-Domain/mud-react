import {
    useContext
  } from 'react';
  
  import {
    IMudWorldContext,
    MudWorldContext
  } from '../../context/mudWorldContext';
  
  export default function useMudAccount() : IMudWorldContext {
    const {
        settlementDataSet,
        settlements
    } = useContext(MudWorldContext);
  
    return {
        settlementDataSet,
        settlements
    };
  }
  