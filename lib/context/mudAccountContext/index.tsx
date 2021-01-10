import {
    ReactElement,
    createContext,
    useState,
    useEffect,
    useRef
} from 'react';

import { FOAF } from "@inrupt/lit-generated-vocab-common";

import {
  Thing,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getThingAll,
  getUrl,
  SolidDataset
} from "@inrupt/solid-client";

import { MUD } from "../../MUD";

export interface IMudAccountInfo {
    charactersDataSet: SolidDataset;
    characters: [Thing];
}

export const MudAccountContext = createContext<IMudAccountInfo>({characters: null, charactersDataSet: null});

export const MudAccountProvider = ({
    webId,
    children
}): ReactElement => {
    const [ charactersDataSet, setCharactersDataSet ] = useState(null);
    const [ characters, setCharacters ] = useState(null);

    /**
     * @returns All Things from a given dataset if they are of type mud:Character
     */
    const getCharacters = (dataset) => {
        let ret = [];
        getThingAll(dataset).forEach((thing) => {
            //TODO: filter out Things which are not characters
            ret.push(thing);
        });
        return ret
    };

    useEffect(() => {
        // following the Web-ID gives us the authenticated user's profile card, which we can use to find an associated mud account
        // TODO: handle case that this information does not exist
        getSolidDataset(webId).then((profileDataSet) => {
            const profileThing = getThing(profileDataSet, webId);
            const accountUrl = getUrl(profileThing, FOAF.account);

            // get MUD:Account from the user's profile card
            getSolidDataset(accountUrl).then((accountDataSet) => {
                const accountThing = getThing(accountDataSet, accountUrl);

                //get the character list dataset from the account
                const charactersDataSetLocation =getStringNoLocale(accountThing, MUD.charactersListPredicate);
                getSolidDataset(charactersDataSetLocation).then((charactersDataSet) => {
                    setCharactersDataSet(charactersDataSet);
                    setCharacters(getCharacters(charactersDataSet));
                }).catch((error) => {
                    console.log(error)
                });
            }).catch((error) => {
                console.log(error)
            });
        }).catch((error) => {
            console.log(error)
        });
    }, []);

    return(
        <MudAccountContext.Provider
            value={{
                charactersDataSet: charactersDataSet,
                characters: characters
            }}
        >
            {children}
        </MudAccountContext.Provider>
    );
};
