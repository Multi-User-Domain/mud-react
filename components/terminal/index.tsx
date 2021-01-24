import {useState} from "react";

import { 
    Container } from "@chakra-ui/react"

import useTerminalFeed from "../../lib/hooks/useTerminalFeed";
import styles from "./terminal.module.css";

export default function Terminal(): React.ReactElement {
    const {messages} = useTerminalFeed();
    const messagesDisplayed = []; //messages, but rendered

    for(let message of messages) {
        messagesDisplayed.push(<li className={styles.message}>{message}</li>)
    }

    return (
        <Container>
            <ul className={styles.messageFeed}>{messagesDisplayed}</ul>
        </Container>
    )
}
