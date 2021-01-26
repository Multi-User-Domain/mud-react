import {useState} from "react";

import { 
    Container } from "@chakra-ui/react"

import useTerminalFeed from "../../lib/hooks/useTerminalFeed";
import styles from "./terminal.module.css";

import { WindupChildren } from "windups";
import VisuallyHidden from "@reach/visually-hidden";

export default function Terminal(): React.ReactElement {
    const {messages} = useTerminalFeed();
    const messagesRead = []; //messages already read (no update)
    const messagesUnread = [];

    for(let message of messages) {
        const comp = <li className={styles.message}>{message.content}</li>;
        if(message.read) messagesRead.push(comp);
        else {
            messagesUnread.push(comp);
            message.read = true;
        }
    }

    // we duplicate it to display content differently visually and when accessing via screen reader
    return (
        <Container>
            <VisuallyHidden><ul className={styles.messageFeed}>{messagesRead}{messagesUnread}</ul></VisuallyHidden>
            <div aria-hidden>
                <ul className={styles.messageFeed}>{messagesRead}</ul>
                <WindupChildren>
                    <ul className={styles.messageFeed}>{messagesUnread}</ul>
                </WindupChildren>
            </div>
        </Container>
    )
}
