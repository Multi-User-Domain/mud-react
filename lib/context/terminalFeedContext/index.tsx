import {
    ReactElement,
    createContext,
    useState,
    useEffect
} from 'react';

export interface ITerminalFeedContext {
    messages: string[];
    addMessage?: (string) => void;
}

export const TerminalFeedContext = createContext<ITerminalFeedContext>({messages: null});

export const TerminalFeedProvider = ({
    children
}): ReactElement => {
    const [ messages, setMessages ] = useState([]);

    const addMessage = (message: string) => {
        setMessages(messages.concat(message))
    }

    useEffect(() => {
        addMessage("Welcome to MUD!");
    }, []);

    return(
        <TerminalFeedContext.Provider
        
        value={{
            messages,
            addMessage
        }}>
            {children}
        </TerminalFeedContext.Provider>
    );
};
