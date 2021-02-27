
import { ReactElement } from "react";

import {
    Thing,
    getStringNoLocale,
    getUrl
} from "@inrupt/solid-client";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from "@chakra-ui/react";

  import { VCARD } from "@inrupt/lit-generated-vocab-common";
  import { MUD } from "../../../lib/MUD";

export default function DescriptionModal(
    {thing, headerProperty, footerContent, isOpen, onClose=null, ...modalProps} : {thing: Thing, headerProperty?, footerContent?: ReactElement, isOpen: boolean, onClose: () => void}): ReactElement {
    
    if(!thing) return null;

    //header content
    if(headerProperty == null) headerProperty = VCARD.fn;

    //body content
    const imageUrl = getUrl(thing, MUD.primaryImageContent);
    let image = null;
    if(imageUrl) image = <img src={imageUrl}></img>
    const modalBody = (
        <>
        {image}
        <p>{getStringNoLocale(thing, MUD.primaryTextContent)}</p>
        </>
    );

    //footer content
    if(footerContent == null) footerContent = <Button onClick={onClose}>Close</Button>

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><h3>{getStringNoLocale(thing, headerProperty)}</h3></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                {modalBody}
                </ModalBody>
    
                <ModalFooter>
                {footerContent}
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
        )
}