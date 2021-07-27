import {
    useContext
} from 'react';

import {
    IMudFederationContext,
    MudFederationContext
} from '../../context/mudFederationContext';

export default function useMudFederation() : IMudFederationContext {
    const {
        connect,
        getFirstConfiguredEndpoint,
        worldWebId,
        setWorldWebId
    } = useContext(MudFederationContext);

    return {
        connect,
        getFirstConfiguredEndpoint,
        worldWebId,
        setWorldWebId
    };
}
  