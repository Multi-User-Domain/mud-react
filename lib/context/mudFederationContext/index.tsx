import { ReactElement, ReactNode, createContext, useState } from "react";

import {
  Thing,
  getSolidDataset,
  getUrl,
  SolidDataset,
} from "@inrupt/solid-client";

import { MUD, getFilteredThings } from "@multi-user-domain/mud-lib";

/**
 * Manages the connection to MUD services and their configuration - i.e. their capabilities and where to access them
 * Should help with the discovery of other MUD services to build on it (TODO: https://github.com/Multi-User-Domain/Multi-User-Domain.github.io/issues/4)
 * These two features together constitute the federation of MUD services
 */

export const MUD_CONFIG_PATH: string = ".well-known/mud-configuration/";

export interface IMudFederationContext {
  connect: (host: string) => Promise<SolidDataset>;
  getFirstConfiguredEndpoint: (endpoint: string) => string;
  worldWebId: string;
  setWorldWebId: (worldWebId: string) => void;
}

export const MudFederationContext = createContext<IMudFederationContext>({
  connect: null,
  getFirstConfiguredEndpoint: null,
  worldWebId: null,
  setWorldWebId: null,
});

export const MudFederationProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [worldWebId, setWorldWebId] = useState(null);
  // for now connected servers are just an array of configurations, prioritised only by FIFO
  const [configurations, setConfigurations] = useState<Thing[]>(null);

  /**
   * @returns the first endpoint in the stored configurations which provides the parameterized endpoint, or null if none found
   */
  const getFirstConfiguredEndpoint: (endpoint: string) => string = (
    endpoint
  ) => {
    for (let i = 0; i < configurations.length; i++) {
      let url: string = getUrl(configurations[i], endpoint);
      if (url) return url;
    }
    return null;
  };

  const connect: (host: string) => Promise<SolidDataset> = (host) => {
    // normalize connection input
    if (!host.endsWith("/")) host += "/";

    // read the MUD configuration of the world server and store it
    const URL = host + MUD_CONFIG_PATH;
    return new Promise<SolidDataset>((resolve, reject) =>
      getSolidDataset(URL)
        .then((dataset) => {
          let priorConfigurations: Thing[] = configurations
            ? configurations
            : [];
          setConfigurations(
            priorConfigurations.concat(
              getFilteredThings(dataset, MUD.Configuration)
            )
          );
          return resolve(dataset);
        })
        .catch((err) => {
          return reject(err);
        })
    );
  };

  //TODO: method to disconnect from a server

  return (
    <MudFederationContext.Provider
      value={{
        connect,
        getFirstConfiguredEndpoint,
        worldWebId,
        setWorldWebId,
      }}
    >
      {children}
    </MudFederationContext.Provider>
  );
};
