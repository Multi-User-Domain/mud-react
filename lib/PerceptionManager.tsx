import { 
    Thing,
    getStringNoLocale,
    getUrl, 
    asUrl,
    ThingPersisted,
    getThingAll
} from '@inrupt/solid-client';

import { VCARD } from "@inrupt/lit-generated-vocab-common";
import { MUD, MUDAPI, MUD_CONTENT } from "./MUD";
import { getContentRequest, parseTurtleToSolidDataset, getThingName } from "./utils";

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

    /**
     * method describes parameterised Thing by adding relevant messages to the feed
     * @param thing: Thing to describe
     */
    const describeThing = (worldWebId, thing: Thing) : Promise<ITerminalMessage[]> => {
        // add a fast message with the name and description (and possibly image)
        const uri = asUrl(thing as ThingPersisted);
        const imageUrl = getUrl(thing, MUD.primaryImageContent);
        let newMessages: ITerminalMessage[] = [];

        if(imageUrl && !recentUris.includes(uri)) {
            newMessages.push(getITerminalMessage(<img src={imageUrl}></img>));
        }

        const msg = (getThingName(thing) + ". " || "") + (getStringNoLocale(thing, MUD.primaryTextContent) || "");
        if(msg.length > 3) {
            newMessages.push(getITerminalMessage(msg));
        }

        // search for content online
        return new Promise<ITerminalMessage[]>((resolve, reject) => {
            getContentRequest(worldWebId + MUDAPI.contentPath, uri).then((response) => {
            if(response && response.data != null) {

                parseContent(response.data).then((messages) => {
                    for(let message of messages) {
                        newMessages.push(getITerminalMessage(message));
                    }

                    // remember previous descriptions and don't repeat
                    recentUris.push(uri);

                    return resolve(newMessages);
                });
            }
        });
        });
    }

    return {
        getITerminalMessage: getITerminalMessage,
        describeThing: describeThing
    };
})();
