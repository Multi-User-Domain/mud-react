import { 
    Thing
} from '@inrupt/solid-client';
import {
    ReactNode,
    ReactElement,
    createContext,
    useState,
    useEffect
} from 'react';

import { ITerminalMessage } from "../../context/mudContentContext";
import useMudContent from '../../hooks/useMudContent';

/**
 * The source of truth for messages in the terminal (the content displayed to the player) and provides methods to add to it
 */

export interface ITerminalFeedContext {
    messages: ITerminalMessage[];
    addMessage?: (message: string) => void;
    describeThing?: (thing: Thing) => void;
    describeScene?: (things: Thing[]) => void;
}

export interface ITerminalFeedProvider {
    children: ReactNode;
};

export const TerminalFeedContext = createContext<ITerminalFeedContext>({messages: null});

export const TerminalFeedProvider = ({
    children
}: ITerminalFeedProvider): ReactElement => {
    const { getITerminalMessage, getThingDescription, getSceneDescription } = useMudContent();
    const [ messages, setMessages ] = useState<ITerminalMessage[]>([]);

    // a method for adding a string directly
    const addMessage = (content: string | React.ReactElement) : void => {
        let message: ITerminalMessage = getITerminalMessage(content);
        setMessages(messages.concat(message));
    }

    const addMessages = (retMessages: ITerminalMessage[]) : void => {
        setMessages(messages.concat(retMessages));
    }

    /**
     * method describes parameterised Thing by adding relevant messages to the feed
     * @param thing: Thing to describe
     */
    const describeThing = (thing: Thing) : void => {
        getThingDescription(thing).then((messages) => {
            addMessages(messages);
        });
    }

    const describeScene = (things: Thing[]) : void => {
        getSceneDescription(things).then((messages) => {
            addMessages(messages);
        });
    }

    useEffect(() => {
        addMessage("Welcome to MUD!");
    }, []);

    return(
        <TerminalFeedContext.Provider
        
        value={{
            messages,
            addMessage,
            describeThing,
            describeScene
        }}>
            {children}
        </TerminalFeedContext.Provider>
    );
};
