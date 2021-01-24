import {
    useContext
  } from 'react';
  
  import {
    ITerminalFeedContext,
    TerminalFeedContext
  } from '../../context/terminalFeedContext';
  
  export default function useTerminalFeed() : ITerminalFeedContext {
    const {
      messages,
      addMessage
    } = useContext(TerminalFeedContext);
  
    return {
        messages,
        addMessage
    };
  }
  