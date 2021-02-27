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
import useMudWorld from "../../hooks/useMudWorld";

import { ITerminalMessage, IPerceptionManager } from "../../PerceptionManager";

export interface ITerminalFeedContext {
    messages: ITerminalMessage[];
    addMessage?: (string) => void;
    describeThing?: (Thing) => void;
}

export interface ITerminalFeedProvider {
    children: ReactNode;
    perceptionManager: IPerceptionManager;
};

export const TerminalFeedContext = createContext<ITerminalFeedContext>({messages: null});

export const TerminalFeedProvider = ({
    children,
    perceptionManager
}: ITerminalFeedProvider): ReactElement => {
    const { worldWebId } = useMudWorld();
    const [ messages, setMessages ] = useState<ITerminalMessage[]>([]);

    // a method for adding a string directly
    const addMessage = (content: string | React.ReactElement) : void => {
        let message: ITerminalMessage = perceptionManager.getITerminalMessage(content);
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
        perceptionManager.describeThing(worldWebId, thing).then((messages) => {
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
            describeThing
        }}>
            {children}
        </TerminalFeedContext.Provider>
    );
};
