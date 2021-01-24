import {useState} from "react";

import { 
    Container } from "@chakra-ui/react"

import useTerminalFeed from "../../lib/hooks/useTerminalFeed";
import styles from "./terminal.module.css";

import { WindupChildren } from "windups";
import VisuallyHidden from "@reach/visually-hidden";

export default function Terminal(): React.ReactElement {
    const {messages} = useTerminalFeed();
    const messagesDisplayed = []; //messages, but rendered

    for(let message of messages) {
        messagesDisplayed.push(<li className={styles.message}>{message}</li>)
    }

    const messageFeed = <ul className={styles.messageFeed}>{messagesDisplayed}</ul>;

    // we duplicate it to display content differently visually and when accessing via screen reader
    return (
        <Container>
            <VisuallyHidden>{messageFeed}</VisuallyHidden>
            <div aria-hidden>
                <WindupChildren>
                    {messageFeed}
                </WindupChildren>
            </div>
        </Container>
    )
}
