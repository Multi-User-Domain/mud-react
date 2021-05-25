import {
    useContext
} from 'react';

import {
    IMudFederationContext,
    MudFederationContext
} from '../../context/mudFederationContext';

export default function useMudFederation() : IMudFederationContext {
    const {
        getFirstConfiguredEndpoint
    } = useContext(MudFederationContext);

    return {
        getFirstConfiguredEndpoint
    };
}
  