import { 
    Thing,
    getStringNoLocale,
    getUrl, 
    asUrl,
    ThingPersisted
} from '@inrupt/solid-client';
import {
    ReactElement,
    createContext,
    useState,
    useEffect
} from 'react';
import { VCARD } from "@inrupt/lit-generated-vocab-common";
import { MUD, MUDAPI } from "../../MUD";

import { getContentRequest } from "../../utils";
import useMudWorld from "../../hooks/useMudWorld";

export interface ITerminalMessage {
    read?: boolean;
    content: string | React.ReactElement;
}

export interface ITerminalFeedContext {
    messages: ITerminalMessage[];
    addMessage?: (string) => void;
    describeThing?: (Thing) => void;
}

export const TerminalFeedContext = createContext<ITerminalFeedContext>({messages: null});

export const TerminalFeedProvider = ({
    children
}): ReactElement => {
    const [ messages, setMessages ] = useState<ITerminalMessage[]>([]);
    const { worldWebId } = useMudWorld();
    const [ recentUris, setRecentUris] = useState([]);

    // a method for adding a string directly
    const addMessage = (content: string | React.ReactElement) : void => {
        let message: ITerminalMessage = {
            read: false,
            content: content
        };
        setMessages(messages.concat(message));
    }

    const getITerminalMessage = (content: string | React.ReactElement) : ITerminalMessage => {
        return {
            read: false,
            content: content
        };
    }

    /**
     * method describes parameterised Thing by adding relevant messages to the feed
     * @param thing: Thing to describe
     * TODO: manage multiple content servers and try each as a fallback
     * TODO: possibly make own content enrichment if possible
     */
    
    const describeThing = (thing: Thing) : void => {
        // add a fast message with the name and description (and possibly image)
        const uri = asUrl(thing as ThingPersisted);
        const imageUrl = getUrl(thing, MUD.primaryImageContent);
        let newMessages: ITerminalMessage[] = [];

        if(imageUrl && !recentUris.includes(uri)) {
            console.log(imageUrl);
            newMessages.push(getITerminalMessage(<img src={imageUrl}></img>));
        }

        const msg = (getStringNoLocale(thing, VCARD.fn) + ". " || "") + (getStringNoLocale(thing, MUD.primaryTextContent) || "");
        console.log(msg);
        if(msg.length > 3) {
            newMessages.push(getITerminalMessage(msg));
        }

        // search for content online
        getContentRequest(worldWebId + MUDAPI.contentPath, uri).then((response) => {
            if(response && response.data != null) {
                newMessages.push(getITerminalMessage(response.data));
            }
            setMessages(messages.concat(newMessages));
        });

        // remember previous descriptions and don't repeat
        setRecentUris(recentUris.concat(uri));
    }

    useEffect(() => {
        addMessage("Welcome to MUD!");
    }, []);

    return(
        <TerminalFeedContext.Provider
        
        value={{
            messages,
            addMessage,
            describeThing
        }}>
            {children}
        </TerminalFeedContext.Provider>
    );
};
