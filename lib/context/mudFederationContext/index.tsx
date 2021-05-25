import {
    ReactElement,
    ReactNode,
    createContext,
    useState,
    useEffect,
} from 'react';

import {
    Thing,
    SolidDataset,
    getSolidDataset,
  } from "@inrupt/solid-client";

import { MUD } from "../../MUD";
import { getFilteredThings } from "../../utils";

/**
 * Manages the connection to MUD services and their configuration - i.e. their capabilities and where to access them
 * Should help with the discovery of other MUD services to build on it (TODO: https://github.com/Multi-User-Domain/Multi-User-Domain.github.io/issues/4)
 * These two features together constitute the federation of MUD services
 */

export const MUD_CONFIG_PATH: string = ".well-known/openid-configuration/";

export interface IMudFederationContext {
    
}

export const MudFederationContext = createContext<IMudFederationContext>({});

export const MudFederationProvider = ({
    worldWebId,
    children
}: {worldWebId: string, children: ReactNode}): ReactElement => {
    // for now connected servers are just an array of configurations, prioritised only by FIFO
    const [ configurations, setConfigurations ] = useState(null);

    const connect: (host: string) => void = (host: string) => {

    }

    //TODO: method to disconnect from a server

    useEffect(() => {
        // normalize the worldWebID input
        if(!worldWebId.endsWith("/")) worldWebId += "/";

        // read the MUD configuration of the world server and store it
        const URL = worldWebId + MUD_CONFIG_PATH;
        getSolidDataset(URL).then((dataset) => {
            setConfigurations(getFilteredThings(dataset, MUD.Configuration));
        });
    }, []);

    return(
        <MudFederationContext.Provider
            value={{
                
            }}
        >
            {children}
        </MudFederationContext.Provider>
    );
};

