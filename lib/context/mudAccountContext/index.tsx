import {
    ReactElement,
    createContext,
    useState
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

export interface IMudAccountInfo {
    charactersDataSet: SolidDataset;
    characters: [Thing];
}

// TODO: this is better defined in a LIT
const accountPredicate = 'https://calum.inrupt.net/public/voc/mudchar.ttl#Account';
const charactersListPredicate = 'https://calum.inrupt.net/public/voc/mudchar.ttl#CharacterList';

export const MudAccountContext = createContext<IMudAccountInfo>({characters: null, charactersDataSet: null});

export const MudAccountProvider = ({
    webId,
    children
}): ReactElement => {
    const [ charactersDataSet, setCharactersDataSet ] = useState(null);
    const [ characters, setCharacters ] = useState(null);

    /**
     * @returns All Things from a given dataset if they are of type mudchar:Character
     */
    const getCharacters = (dataset) => {
        let ret = [];
        getThingAll(dataset).forEach((thing) => {
            //TODO: filter out Things which are not characters
            ret.push(thing);
        });
        return ret
    };

    // following the Web-ID gives us the authenticated user's profile card, which we can use to find an associated mud account
    // TODO: handle case that this information does not exist
    getSolidDataset(webId).then((profileDataSet) => {
        const profileThing = getThing(profileDataSet, webId);
        const accountUrl = getUrl(profileThing, FOAF.account);

        // get MUD:Account from the user's profile card
        getSolidDataset(accountUrl).then((accountDataSet) => {
            const accountThing = getThing(accountDataSet, accountUrl);

            //get the character list dataset from the account
            const charactersDataSetLocation =getStringNoLocale(accountThing, charactersListPredicate);
            getSolidDataset(charactersDataSetLocation).then((charactersDataSet) => {
                setCharactersDataSet(charactersDataSet);
                setCharacters(getCharacters(charactersDataSet));
            });
        });
    });

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
