import {
    ReactElement,
    createContext,
    useState,
    useEffect,
    ReactNode
} from 'react';

import { RDF, VCARD, FOAF } from "@inrupt/lit-generated-vocab-common";

import {
  Thing,
  SolidDataset,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  saveSolidDatasetAt,
  getFetchedFrom,
  setThing,
  createThing,
  setUrl,
  setStringUnlocalized
} from "@inrupt/solid-client";

import { useSession } from "@inrupt/solid-ui-react/dist";

import { getFilteredThings } from "../../utils";
import { MUD, MUD_CHARACTER } from "../../MUD";
import { IActionManager, actionManager } from "../../ActionManager";

export interface IMudAccountContext {
    characters: Thing[];
    characterDataSet: SolidDataset;
    postTransitTask?: (worldWebId: string, subjectThing: Thing, destinationLocatable: Thing) => Promise<any>;
    addCharacter?: (string) => void;
}

export const MudAccountContext = createContext<IMudAccountContext>({characters: null, characterDataSet: null});

interface IMudAccountProvider {
    webId: string;
    actionManager: IActionManager;
    children: ReactNode;
};

export const MudAccountProvider = ({
    webId,
    actionManager,
    children
}: IMudAccountProvider ): ReactElement => {
    const { fetch } = useSession();
    const [ characterDataSet, setCharacterDataSet ] = useState(null);
    const [ characters, setCharacters ] = useState(null);

    const saveDataset = async (newThing, datasetToUpdate) => {
        const savedDataset = await saveSolidDatasetAt(
          getFetchedFrom(datasetToUpdate),
          setThing(datasetToUpdate, newThing),
          { fetch }
        );
        setCharacterDataSet(savedDataset);
      };

    const postTransitTask = (worldWebId: string, subjectThing: Thing, destinationLocatable: Thing) : Promise<any> => {
        return actionManager.postTransitTask(worldWebId, subjectThing, destinationLocatable);
    }

    /**
    * Adds a character to the collection
    */
    const addCharacter = async (newCharName: string) => {
        // creates a new character Thing, sets properties to it
        let newCharacter = setUrl(createThing(), RDF.type, MUD_CHARACTER.Character);
        newCharacter = setUrl(newCharacter, MUD.owner, webId);
        newCharacter = setStringUnlocalized(newCharacter, VCARD.fn, newCharName);
        newCharacter = setStringUnlocalized(newCharacter, FOAF.name, newCharName);
        const dataSetWithCharacter = setThing(
            characterDataSet,
            newCharacter
        );
        await saveDataset(newCharacter, dataSetWithCharacter);
        setCharacters(characters.concat(newCharacter));
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
                const charactersDataSetLocation = getStringNoLocale(accountThing, MUD.charactersList);
                getSolidDataset(charactersDataSetLocation).then((dataset) => {
                    setCharacterDataSet(dataset);
                    setCharacters(getFilteredThings(dataset, MUD_CHARACTER.Character));
                });
            });
        });
    }, []);

    return(
        <MudAccountContext.Provider
            value={{
                characterDataSet,
                characters,
                postTransitTask,
                addCharacter
            }}
        >
            {children}
        </MudAccountContext.Provider>
    );
};
