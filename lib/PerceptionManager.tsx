import axios, { AxiosResponse } from 'axios';

import { 
    Thing,
    getStringNoLocale,
    getUrl, 
    asUrl,
    ThingPersisted,
    getThingAll,
    SolidDataset,
    createSolidDataset,
    setThing
} from '@inrupt/solid-client';

import { MUD, MUDAPI, MUD_CONTENT } from "./MUD";
import { parseTurtleToSolidDataset, getThingName, triplesToTurtle } from "./utils";

/**
 * Perception Manager is responsible for choosing what to display to the user, i.e. for deciding when it has enough content and what
 * content should be displayed to the user, separated from the TerminalContext which is responsible for managing the feed and the
 * Terminal component which is responsible for rendering it
 * 
 * PM: what and why
 * Context: where
 * Component: how
 * 
 * TODO: when? Maybe a message scehduler, informed by user settings and the PM?
 */

export interface ITerminalMessage {
    id: string;
    read?: boolean;
    content: string | React.ReactElement;
}

export interface IPerceptionManager {
    getITerminalMessage: (content: string | React.ReactElement) => ITerminalMessage;
    describeThing: (worldWebId: string, thing: Thing) => Promise<ITerminalMessage[]>;
    describeScene: (worldWebId: string, things: Thing[]) => Promise<ITerminalMessage[]>;
};

export const perceptionManager: IPerceptionManager = (() => {
    let recentUris = [];

    const getITerminalMessage = (content: string | React.ReactElement) : ITerminalMessage => {
        return {
            id: Math.random().toString(36).substr(2, 9),
            read: false,
            content: content
        };
    }

    const parseContent = (data) : Promise<string[]> => {

        return parseTurtleToSolidDataset(data).then((dataset) => {
            let values: string[] = [];

            getThingAll(dataset).forEach((thing) => {
                const value: string = getStringNoLocale(thing, MUD_CONTENT.sight);
                if(value) values.push(value);
            });

            return values;
        });
    }

    const buildSceneTurtleData = (things: Thing[]): Promise<string> => {
        const scene: SolidDataset = createSolidDataset();

        for(let thing of things) {
            setThing(scene, thing);
        }

        return triplesToTurtle(Array.from(scene));
    }

    /**
     * builds a list of ITerminalMessage objects by getting the primary content data from parameterised things
     */
    const getPrimaryContent = (things: Thing[]) : ITerminalMessage[] => {
        let messages: ITerminalMessage[] = [];
        
        for(let thing of things) {
            const uri = asUrl(thing as ThingPersisted);
            const imageUrl = getUrl(thing, MUD.primaryImageContent);

            if(imageUrl && !recentUris.includes(uri)) {
                messages.push(getITerminalMessage(<img src={imageUrl}></img>));
            }
    
            const isPresent = value => Boolean(value);
            const msg = [getThingName(thing), getStringNoLocale(thing, MUD.primaryTextContent)].filter(isPresent).join(". ");
            if(msg.length > 3) {
                messages.push(getITerminalMessage(msg));
            }
        }

        return messages;
    }

    /**
     * method describes parameterised Thing by adding relevant messages to the feed
     * @param thing: Thing to describe
     */
    const describeThing = (worldWebId: string, thing: Thing) : Promise<ITerminalMessage[]> => {
        return describeScene(worldWebId, [thing]);
    }

    const postScene = (worldWebId: string, data: any) : Promise<AxiosResponse<any>> => {
        return axios.post(worldWebId + MUDAPI.contentPath, data);
    }

    const describeScene = (worldWebId: string, things: Thing[]) : Promise<ITerminalMessage[]> => {
        // add a fast message with the name and description (and possibly image)
        let newMessages: ITerminalMessage[] = getPrimaryContent(things);

        // remember previous descriptions and don't repeat
        for(let thing of things) recentUris.push(asUrl(thing as ThingPersisted));

        // search for content online
        return new Promise<ITerminalMessage[]>((resolve, reject) => {

            // build scene data
            buildSceneTurtleData(things).then((requestData) => {
                postScene(worldWebId, requestData).then((response) => {
                    if(response && response.data != null) {

                        parseContent(response.data).then((messages) => {
                            for(let message of messages) {
                                newMessages.push(getITerminalMessage(message));
                            }
        
                            return resolve(newMessages);
                        });
                    }
                });
            });
        });
    }

    return {
        getITerminalMessage: getITerminalMessage,
        describeThing: describeThing,
        describeScene: describeScene
    };
})();
