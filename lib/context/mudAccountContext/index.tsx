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
import useMudAction from '../../hooks/useMudAction';

/**
 * The source of truth for the player data, i.e. the connection to their Pod
 */

export interface IMudAccountContext {
    characters: Thing[];
    characterDataSet: SolidDataset;
    transitCharacter?: (subjectThing: Thing, destinationLocatable: Thing) => Promise<any>;
    addCharacter?: (string) => void;
}

export const MudAccountContext = createContext<IMudAccountContext>({characters: null, characterDataSet: null});

interface IMudAccountProvider {
    webId: string;
    children: ReactNode;
};

export const MudAccountProvider = ({
    webId,
    children
}: IMudAccountProvider ): ReactElement => {
    const { fetch } = useSession();
    const [ characterDataSet, setCharacterDataSet ] = useState(null);
    const [ characters, setCharacters ] = useState(null);
    const { postTransitTask } = useMudAction();

    const saveCharacterDataset = async (newThing, datasetToUpdate) => {
        const savedDataset = await saveSolidDatasetAt(
          getFetchedFrom(datasetToUpdate),
          setThing(datasetToUpdate, newThing),
          { fetch }
        );
        setCharacterDataSet(savedDataset);
        setCharacters(getFilteredThings(savedDataset, MUD_CHARACTER.Character));
      };

    //TODO: should with agents which are not Characters. Currently uses an implicit assumption that the subject is of the Character Dataset
    //TODO: should be able to post a transit task to multiple agents at once
    const transitCharacter = (subjectThing: Thing, destinationLocatable: Thing) : Promise<any> => {
        return postTransitTask(subjectThing, destinationLocatable).then((response) => {

            if(response) {
                //set hasTask on the agent conducting it
                //get the task from the response header
                subjectThing = setUrl(subjectThing, MUD_CHARACTER.hasTask, response.headers['location']);
                saveCharacterDataset(subjectThing, characterDataSet);

                //TODO: schedule the task completion
            }
        });
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
        await saveCharacterDataset(newCharacter, dataSetWithCharacter);
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
                transitCharacter,
                addCharacter
            }}
        >
            {children}
        </MudAccountContext.Provider>
    );
};
