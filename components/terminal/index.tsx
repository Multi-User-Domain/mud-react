import {useEffect, useState} from "react";

import { 
    Container } from "@chakra-ui/react"

import useTerminalFeed from "../../lib/hooks/useTerminalFeed";
import "./terminal.module.css";

import { WindupChildren, OnChar } from "windups";
import VisuallyHidden from "@reach/visually-hidden";
import { ITerminalMessage } from "../../lib/context/mudContentContext";
import { useRef } from "react";

export function TerminalMessage({message, children} : {message: ITerminalMessage, children: any}) : React.ReactElement {
    return (
        <li className="message">{children}</li>
    );
}

export default function Terminal(): React.ReactElement {
    const {messages} = useTerminalFeed();
    const messagesEnd = useRef(null);
    const messagesRead = []; //messages already read (no update)
    const messagesUnread = [];

    for(let message of messages) {
        const comp = <TerminalMessage message={message} key={message.id}>{message.content}</TerminalMessage>;
        if(message.read) messagesRead.push(comp);
        else {
            messagesUnread.push(comp);
            message.read = true;
        }
    }

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    });

    // we duplicate it to display content differently visually and when accessing via screen reader
    return (
        <Container>
            <VisuallyHidden><ul className="messageFeed">{messagesRead}{messagesUnread}</ul></VisuallyHidden>
            <div aria-hidden className="messageFeed">
                <ul>{messagesRead}</ul>
                <WindupChildren>
                    <OnChar fn={scrollToBottom}>
                        <ul>{messagesUnread}</ul>
                    </OnChar>
                </WindupChildren>
                <div style={{ float:"left", clear: "both"}} ref={messagesEnd}></div>
            </div>
        </Container>
    )
}
