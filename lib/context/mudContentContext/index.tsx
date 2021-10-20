import {
    ReactElement,
    createContext,
} from 'react';

import axios, { AxiosResponse } from 'axios';

import { 
    Thing,
    getStringNoLocale,
    getUrl,
    getUrlAll, 
    asUrl,
    ThingPersisted,
    getThingAll,
    getThing,
} from '@inrupt/solid-client';

import { MUD, MUD_CONTENT } from "../../MUD";
import { parseTurtleToSolidDataset, getThingName, triplesToTurtle } from "../../utils";
import useMudFederation from "../../hooks/useMudFederation";
import useMudScene from "../../hooks/useMudScene";

/**
 * The Content Context leverages the Federation to serve Content describing the users' perspective
 * 
 * This class: what and why
 * Context: where
 * Component: how
 * 
 * TODO: when? Maybe a message scehduler, informed by user settings and the PM?
 */

// TODO: inject the logic which serializes a graph into content
export interface ITerminalMessage {
    id: string;
    read?: boolean;
    content: string | React.ReactElement;
}

export interface IMUDContentContext {
    getITerminalMessage?: (content: string | React.ReactElement) => ITerminalMessage;
    getThingDescription?: (thing: Thing) => Promise<ITerminalMessage[]>;
    getSceneDescription?: (things: Thing[]) => Promise<ITerminalMessage[]>;
};

export const MudContentContext = createContext<IMUDContentContext>({});

export const MudContentProvider = ({
    children
}): ReactElement => {

    const { getFirstConfiguredEndpoint } = useMudFederation();
    const { buildScene } = useMudScene();

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

            getThingAll(dataset).forEach((perspective) => {
                // TODO: now would be the time to perform selection on the content
                // TODO: https://github.com/inrupt/solid-client-js/issues/948
                getUrlAll(perspective, MUD_CONTENT.sees).forEach((seenURL) => {
                    const contentThing: Thing = getThing(dataset, seenURL);
                    const value: string = getStringNoLocale(contentThing, MUD_CONTENT.hasText);

                    if(value && !values.includes(value)) values.push(value);
                });
                
            });

            return values;
        });
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
    const getThingDescription = (thing: Thing) : Promise<ITerminalMessage[]> => {
        return getSceneDescription([thing]);
    }

    const postScene = (data: any) : Promise<AxiosResponse<any>> => {
        return axios.post(getFirstConfiguredEndpoint(MUD_CONTENT.sceneDescriptionEndpoint), data);
    }

    const getSceneDescription = (things: Thing[]) : Promise<ITerminalMessage[]> => {
        // add a fast message with the name and description (and possibly image)
        let newMessages: ITerminalMessage[] = getPrimaryContent(things);

        // remember previous descriptions and don't repeat
        for(let thing of things) recentUris.push(asUrl(thing as ThingPersisted));

        // search for content online
        return new Promise<ITerminalMessage[]>((resolve, reject) => {

            // build scene data
            buildScene(things, true).then((scene) => {

                triplesToTurtle(Array.from(scene)).then((requestData) => {

                    postScene(requestData).then((response) => {
                        if(response && response.data != null) {
    
                            // parseContent has turned the content graph into an array of messages
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
        });
    }

    return(
        <MudContentContext.Provider
            value={{
                getITerminalMessage,
                getThingDescription,
                getSceneDescription
            }}
        >
            {children}
        </MudContentContext.Provider>
    );
};
