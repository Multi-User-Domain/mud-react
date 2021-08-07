
import { ReactElement } from "react";

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

import {ThingList, IThingList} from "@multi-user-domain/mud-lib";

export interface IThingListModal extends IThingList {
    headerContent?: ReactElement;
    isOpen: boolean;
    onClose: () => void;
}

/**
* A modal which renders a ThingList in a modal, where the parent defines the handler for a selected element
* if the ThingListModal should only be closed by making a selection, pass onClose=null
*/
export function ThingListModal({headerContent=null, things, filter=null, rowComponent, selectThing, isOpen, onClose=null} : IThingListModal) : React.ReactElement {
    
        if (!things) return <div>loading...</div>;

        let footerContent = null;
        if(onClose != null) footerContent = <Button onClick={onClose}>Close</Button>;

        return (
            <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{headerContent}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <ThingList things={things} filter={filter} selectThing={selectThing} rowComponent={rowComponent} />
                </ModalBody>
    
                <ModalFooter>
                {footerContent}
                </ModalFooter>
            </ModalContent>
            </Modal>
            
            </>
        );
}