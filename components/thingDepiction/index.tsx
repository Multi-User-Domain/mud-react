import { Container, Circle, Center } from "@chakra-ui/react"
import styles from "./terminal.module.css";

import { WindupChildren, OnChar } from "windups";
import VisuallyHidden from "@reach/visually-hidden";
import { Thing, getUrl } from "@inrupt/solid-client";
import { FOAF } from "@inrupt/lit-generated-vocab-common";

/**
 * purpose: Thing Depiction component can display any Thing with the FOAF:depiction property and render it
 * renders a default icon if the property is not present
 */

export default function ThingDepiction({thing} : {thing: Thing}): React.ReactElement {

    const imageUrl = getUrl(thing, FOAF.depiction);

    if(imageUrl) return <img src={imageUrl}></img>;
    return <Center h="100%"><Circle bg="tomato" w="20px" h="20px"></Circle></Center>;
}
