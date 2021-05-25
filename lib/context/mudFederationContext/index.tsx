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
    getUrl,
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
    getFirstConfiguredEndpoint: (endpoint: string) => string
}

export const MudFederationContext = createContext<IMudFederationContext>({getFirstConfiguredEndpoint: null});

export const MudFederationProvider = ({
    worldWebId,
    children
}: {worldWebId: string, children: ReactNode}): ReactElement => {
    // for now connected servers are just an array of configurations, prioritised only by FIFO
    const [ configurations, setConfigurations ] = useState<Thing[]>(null);

    /**
     * @returns the first endpoint in the stored configurations which provides the parameterized endpoint, or null if none found
     */
    const getFirstConfiguredEndpoint: (endpoint: string) => string = (endpoint) => {
        for(let i = 0; i < configurations.length; i++) {
            let url: string = getUrl(configurations[i], endpoint);
            if(url) return url;
        }
        return null;
    }

    const connect: (host: string) => void = (host) => {
        // normalize connection input
        if(!host.endsWith("/")) worldWebId += "/";

        // read the MUD configuration of the world server and store it
        const URL = host + MUD_CONFIG_PATH;
        getSolidDataset(URL).then((dataset) => {
            let priorConfigurations: Thing[] = configurations ? configurations : [];
            setConfigurations(priorConfigurations.concat(getFilteredThings(dataset, MUD.Configuration)));
        });
    }

    //TODO: method to disconnect from a server

    useEffect(() => {
        connect(worldWebId);
        //TODO: enforce that at least one world server is connected to (the main world server)
    }, []);

    return(
        <MudFederationContext.Provider
            value={{
                getFirstConfiguredEndpoint
            }}
        >
            {children}
        </MudFederationContext.Provider>
    );
};

