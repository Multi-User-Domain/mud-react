import {
    ReactElement,
    createContext,
    useState,
    useEffect,
} from 'react';

import {
    Thing,
    SolidDataset,
    getSolidDataset,
  } from "@inrupt/solid-client";

import { MUD, getFilteredThings } from "@multi-user-domain/mud-lib";
import useMudFederation from '../../hooks/useMudFederation';

/**
 * The source of truth for data about the world which is currently connected by the player
 */

export interface IMudWorldContext {
    settlements: [Thing];
    settlementDataSet: SolidDataset;
}

export const MudWorldContext = createContext<IMudWorldContext>({settlements: null, settlementDataSet: null});

export const MudWorldProvider = ({
    children
}): ReactElement => {
    const { getFirstConfiguredEndpoint } = useMudFederation();
    const [ settlementDataSet, setSettlementDataSet ] = useState(null);
    const [ settlements, setSettlements ] = useState(null);

    useEffect(() => {
        const URL = getFirstConfiguredEndpoint(MUD.worldEndpoint);
        getSolidDataset(URL).then((dataset) => {
            setSettlementDataSet(dataset);
            setSettlements(getFilteredThings(dataset, MUD.Settlement));
        });
    }, []);

    return(
        <MudWorldContext.Provider
            value={{
                settlementDataSet,
                settlements
            }}
        >
            {children}
        </MudWorldContext.Provider>
    );
};
