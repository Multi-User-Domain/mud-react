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

import { MUD, MUDAPI } from "../../MUD";
import { getFilteredThings } from "../../utils";

export interface IMudWorldContext {
    worldWebId: string;
    settlements: [Thing];
    settlementDataSet: SolidDataset;
}

export const MudWorldContext = createContext<IMudWorldContext>({worldWebId: null, settlements: null, settlementDataSet: null});

export const MudWorldProvider = ({
    worldWebId,
    children
}): ReactElement => {
    const [ settlementDataSet, setSettlementDataSet ] = useState(null);
    const [ settlements, setSettlements ] = useState(null);

    useEffect(() => {
        const URL = worldWebId + MUDAPI.settlementsPath;
        getSolidDataset(URL).then((dataset) => {
            setSettlementDataSet(dataset);
            setSettlements(getFilteredThings(dataset, MUD.settlementRDFType));
        });
    }, []);

    return(
        <MudWorldContext.Provider
            value={{
                worldWebId,
                settlementDataSet,
                settlements
            }}
        >
            {children}
        </MudWorldContext.Provider>
    );
};
